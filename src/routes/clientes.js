import { Router } from "express";
import { agregarCliente, getClientes, updateCliente, deleteCliente } from "../controllers/clientes.controllers.js";

const router = Router();

router.post("/clientes/:cobradorId", agregarCliente);
router.get("/clientes", getClientes);
router.patch("/clientes/:id", updateCliente);
router.delete("/clientes/:id", deleteCliente);

export default router;