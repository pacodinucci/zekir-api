import { Router } from "express";
import { agregarCobrador, getCobradores, updateCobrador, deleteCobrador } from "../controllers/cobradores.controllers.js";

const router = Router();

router.post("/cobradores", agregarCobrador);
router.get("/cobradores", getCobradores);
router.patch("/cobradores/:id", updateCobrador);
router.delete("/cobradores/:id", deleteCobrador);

export default router;