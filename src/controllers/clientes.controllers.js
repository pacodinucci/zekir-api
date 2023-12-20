import { db } from "../config.js"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, query, where } from "firebase/firestore";

export const agregarCliente = async (req, res) => {
    try {
        const { cobradorId } = req.params;
        const { nombre, apellido, telefono, direccion } = req.body;

        if(!nombre || !apellido || !telefono || !direccion ) {
            return res.status(400).send("Los campos nombre y apellido son requeridos");
        };

        const cobradorDocRef = doc(db, 'Cobradores', cobradorId);
        const cobradorDoc = await getDoc(cobradorDocRef);

        if (!cobradorDoc.exists()) {
            return res.status(404).send("Cobrador no encontrado");
        }

        const cobradorData = cobradorDoc.data();

        console.log(cobradorData)

        if (!cobradorData.username) {
            return res.status(404).send("Usuario del cobrador no encontrado");
        }

        const clienteData = {
            nombre,
            apellido,
            telefono,
            direccion,
            cobrador: {
                id: cobradorId,
                nombre: cobradorData.username 
            }
        };

        const docRef = await addDoc(collection(db, 'Clientes'), clienteData);
        res.send({ msg: "Cliente agegado", docId: docRef.id });
    } catch (error) {
        console.log(error.message)
    }
}

export const getClientes = async (req, res) => {
    try {
        const clientesCollectionRef = collection(db, 'Clientes');
        const snapshot = await getDocs(clientesCollectionRef);
        const clientesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(clientesList);
    } catch (error) {
        console.error(error.message)
    }
}

export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const clienteDocRef = doc(db, 'Clientes', id);
        await updateDoc(clienteDocRef, data)

        res.send({ msg: "Datos del cliente actualizados.", docId: id})
    } catch (error) {
        console.error(error.message)
    }
}

export const deleteCliente = async (req, res) => {
    try {
        const {id} = req.params;

        const clienteDocRef = doc(db, 'Cliente', id);
        await deleteDoc(clienteDocRef);

        res.send({ msg: "Cliente eliminado", docId: id });
    } catch (error) {
        console.error(error.message);
    }
}