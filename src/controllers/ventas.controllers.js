import { db } from "../config.js"
import { collection, addDoc, getDocs, getDoc, documentId, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { addDays, format, parse } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const agregarVenta = async (req, res) => {
    try {
        const { cobradorId } = req.params;
        const { clienteId, productoId, numeroCuotas, precioTotal } = req.body;
        
        if (!cobradorId || !clienteId || !productoId || !numeroCuotas || precioTotal === undefined) {
            return res.status(400).send("Todos los campos son requeridos");
        }

        if (numeroCuotas < 1 || numeroCuotas > 12) {
            return res.status(400).send("El número de cuotas debe estar entre 1 y 12");
        }

        const montoCuota = precioTotal / numeroCuotas
        const fechaVenta = new Date();
        let cuotas = {};

        for (let i = 0; i < numeroCuotas; i++) {
            const fechaVencimiento = addDays(fechaVenta, 7 * (i + 1));
            const fechaVencimientoFormateada = format(fechaVencimiento, 'yyyy-MM-dd');
            const idCuota = uuidv4()
            cuotas[idCuota] = {
                pagado: false,
                monto: montoCuota,
                fecha: fechaVencimientoFormateada,
                id: idCuota
            };
        }

        const ventaData = {
            cobradorId,
            clienteId,
            productoId,
            precioTotal,
            saldoRestante: precioTotal,
            formaDePago: {
                cuotas
            }
        };

        const docRef = await addDoc(collection(db, 'Ventas'), ventaData);
        res.send({ msg: "Venta agregada", docId: docRef.id });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error interno del servidor");
    }
};

export const getVentas = async (req, res) => {
    try {
        const ventasCollectionRef = collection(db, 'Ventas');
        const snapshot = await getDocs(ventasCollectionRef);

        const ventas = await Promise.all(snapshot.docs.map(async (d) => {
            const venta = d.data();
            const ventaId = d.id;

            // Obtener datos del cliente
            const clienteDocRef = doc(db, 'Clientes', venta.clienteId);
            const clienteDoc = await getDoc(clienteDocRef);
            const clienteData = clienteDoc.exists() ? clienteDoc.data() : null;

            // Obtener datos del cobrador
            const cobradorDocRef = doc(db, 'Cobradores', venta.cobradorId);
            const cobradorDoc = await getDoc(cobradorDocRef);
            const cobradorData = cobradorDoc.exists() ? cobradorDoc.data() : null;

            // Obtener datos del producto
            const productoDocRef = doc(db, 'Productos', venta.productoId);
            const productoDoc = await getDoc(productoDocRef);
            const productoData = productoDoc.exists() ? productoDoc.data() : null;

            return {
                id: ventaId,
                ...venta,
                cliente: clienteData,
                cobrador: cobradorData,
                producto: productoData
            };
        }));

        res.json(ventas);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error interno del servidor");
    }
};

export const getVentasporCobrador = async (req, res) => {
    const { cobradorId } = req.params
    const { fecha } = req.body // Tiene que ser en formato dd/mm/yyyy
    try {
        const ventasQuery = query(collection(db, 'Ventas'), where('cobradorId', '==', cobradorId))
        const querySnapshot = await getDocs(ventasQuery)

        if (fecha) {
            const fechaParsed = parse(fecha, 'dd/MM/yyyy', new Date())
            const fechaFormatted = format(fechaParsed, 'yyyy-MM-dd')

            let totalACobrar = 0 
            let montoRestanteACobrar = 0
            let cuotasDia = {}

            if (querySnapshot.empty) return res.status(404).send('No se encontraron ventas.')

            querySnapshot.forEach((doc) => {
                const venta = doc.data()
                Object.entries(venta.formaDePago.cuotas).forEach(([cuotaId, cuota]) => {
                    if (cuota.fecha === fechaFormatted && !cuota.pagado) {
                        totalACobrar += cuota.monto
                        montoRestanteACobrar += cuota.monto
                        cuotasDia[cuotaId] = {...cuota, fecha: fecha}
                    }
                })
            })
            
            res.json({
                totalACobrar,
                montoRestanteACobrar,
                cuotasDia
            })
        } else {
            const ventas = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('Ventas por cobrador')
            res.json(ventas);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error interno del servidor");
    }
};

export const actualizarCuota = async (req, res) => {
    try {
        const { ventaId } = req.params
        const { cuotaId } = req.body

        const ventaRef = doc(db, 'Ventas', ventaId)
        const ventaSnap = await getDoc(ventaRef)

        if(!ventaSnap.exists()) {
            return res.status(404).send('Venta no encontrada.')
        }
        
        const ventaData = ventaSnap.data()
        const cuota = ventaData.formaDePago.cuotas[cuotaId]

        if(!cuota) {
            return res.status(404).send('Cuota no encontrada.')
        }

        if(cuota.pagado) {
            return res.status(400).send('La cuota ya esta abonada.')
        }

        const saldoRestante = ventaData.saldoRestante - cuota.monto

        const cuotaUpdate = {
            [`formaDePago.cuotas.${cuotaId}.pagado`]: true,
            saldoRestante: saldoRestante
        }

        await updateDoc(ventaRef, cuotaUpdate)

        res.send('Cuota actualizada.')
    } catch (error) {
        console.error(error)
        res.status(500).send('Error en el servidor.')
    }
} 

export const eliminarVenta = async (req, res) => {
    try {
        const { cobradorId } = req.params
        const { ventaId } = req.body
    
        const ventaRef = doc(db, 'Ventas', ventaId)
        await deleteDoc(ventaRef)
    
        res.send('Venta eliminada.')
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor.')
    }
}

export const calcularCobroPorFecha = async (req, res) => {
    const { cobradorId } = req.params
    const { fecha } = req.body 
    try {
        const ventasRef = collection(db, 'Ventas')
        const q = query(ventasRef, where('cobradorId', '==', cobradorId))

        const querySnapshot = await getDocs(q)
        let totalACobrar = 0
        let montoRestanteACobrar = 0
        let cuotasDelDia = {}

        querySnapshot.forEach((doc) => {
            const venta = doc.data();
            Object.entries(venta.formaDePago.cuotas).forEach(([cuotaId, cuota]) => {
                if (cuota.fecha === fecha && !cuota.pagado) {
                    totalACobrar += cuota.monto;
                    montoRestanteACobrar += cuota.monto;
                    cuotasDelDia[cuotaId] = cuota;
                }
            })
        })

        res.json({
            totalACobrar,
            montoRestanteACobrar,
            cuotasDelDia
        })
    } catch (error) {
        console.error('Error al calcular el cobro:', error)
        res.status(500).send('Error en el servidor.')
    }
}