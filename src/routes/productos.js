import { Router } from "express";
import { agregarProducto, getProductos, updateProducto, deleteProducto } from "../controllers/productos.controllers.js";

const router = Router();

router.post("/productos", agregarProducto);
router.get("/productos", getProductos);
router.patch("/productos/:id", updateProducto);
router.delete("/productos/:id", deleteProducto);

export default router;