import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from "../config.js";
import { getDocs, query, where, collection } from 'firebase/firestore';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config();

export const signin = async (req, res) => {
  const { username, password } = req.body;
  const cobradoresCollectionRef = collection(db, 'Cobradores');
  const q = query(cobradoresCollectionRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  const user = querySnapshot.docs[0].data();
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const userForToken = {
    username: user.username,
    id: querySnapshot.docs[0].id,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.send({
    token,
    username: user.username,
    id: userForToken.id
  });
};

