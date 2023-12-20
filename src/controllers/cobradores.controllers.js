import { db } from "../config.js"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

export const agregarCobrador = async (req, res) => {
    try {
        const { usuario, nombre, apellido, telefono } = req.body;

        if (!usuario || !nombre || !apellido) {
            return res.status(400).send("Los campos usuario, nombre y apellido son requeridos");
        };

        const data = { usuario, nombre, apellido, telefono };
        const docRef = await addDoc(collection(db, 'Cobradores'), data);
        res.send({ msg: "Cobrador agegado", docId: docRef.id });
    } catch (error) {
        console.error(error.message)
    }
}

export const getCobradores = async (req, res) => {
    try {
        const cobradoresCollectionRef = collection(db, 'Cobradores');
        const { usuario } = req.body;

        let cobradoresList = [];

        if (usuario) {
            const q = query(cobradoresCollectionRef, where("usuario", "==", usuario));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return res.status(404).send("Usuario de cobrador no encontrado.");
            }

            querySnapshot.forEach((doc) => {
                cobradoresList.push({ id: doc.id, ...doc.data() });
            });
        } else {
            const snapshot = await getDocs(cobradoresCollectionRef);
            cobradoresList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        res.json(cobradoresList);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error al obtener cobrador(es).");
    }
}

export const updateCobrador = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const cobradorDocRef = doc(db, 'Cobradores', id);
        await updateDoc(cobradorDocRef, data)

        res.send({ msg: "Datos del cobrador actualizados.", docId: id })
    } catch (error) {
        console.error(error.message)
    }
}

export const deleteCobrador = async (req, res) => {
    try {
        const { id } = req.params;

        const cobradorDocRef = doc(db, 'Cobradores', id);
        await deleteDoc(cobradorDocRef);

        res.send({ msg: "Cobrador eliminado", docId: id });
    } catch (error) {
        console.error(error.message);
    }
}