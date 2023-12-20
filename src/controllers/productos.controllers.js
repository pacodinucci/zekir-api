import { db } from "../config.js"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

export const agregarProducto = async (req, res) => {
    try {
        const { marca, titulo, descripcion, precio } = req.body;

        if(!marca || !titulo || !precio) {
            return res.status(400).send("Los campos marca y titulo y precio son requeridos");
        };

        const data = { marca, titulo, descripcion, precio};
        const docRef = await addDoc(collection(db, 'Productos'), data);
        res.send({ msg: "Producto agegado", docId: docRef.id });
    } catch (error) {
        console.error(error.message)
    }
}

export const getProductos = async (req, res) => {
    try {
        const productosCollectionRef = collection(db, 'Productos');
        const snapshot = await getDocs(productosCollectionRef);
        const productosList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(productosList);
    } catch (error) {
        console.error(error.message)
    }
}

export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const productoDocRef = doc(db, 'Productos', id);
        await updateDoc(productoDocRef, data);

        res.send({ msg: "Datos del producto actualizados.", docId: id})
    } catch (error) {
        console.error(error.message)
    }
}

export const deleteProducto = async (req, res) => {
    try {
        const {id} = req.params;

        const productoDocRef = doc(db, 'Productos', id);
        await deleteDoc(productoDocRef);

        res.send({ msg: "Producto eliminado", docId: id });
    } catch (error) {
        console.error(error.message);
    }
}