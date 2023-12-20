import bcrypt from 'bcrypt';
import { db } from "../config.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

export const signup = async (req, res) => {
    const { username, password, telefono } = req.body;

    const cobradoresCollectionRef = collection(db, 'Cobradores');
    const q = query(cobradoresCollectionRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newCobradorRef = await addDoc(collection(db, 'Cobradores'), {username, passwordHash, telefono})

    res.status(201).json({ id: newCobradorRef.id, username });
};