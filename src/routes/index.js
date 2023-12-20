import { Router } from "express";
import auth from "./auth.js";
import cobradores from "./cobradores.js";
import productos from "./productos.js";
import clientes from "./clientes.js";
import ventas from "./ventas.js"

const router = Router();

router.use("/", auth);
router.use("/", cobradores);
router.use("/", productos);
router.use("/", clientes);
router.use("/", ventas);


export default router;

