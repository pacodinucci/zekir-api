import jwt from 'jsonwebtoken';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config();

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.Header['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};