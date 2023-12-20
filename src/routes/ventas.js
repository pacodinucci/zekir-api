import { Router } from 'express';
import { agregarVenta, getVentas, getVentasporCobrador, actualizarCuota, eliminarVenta } from '../controllers/ventas.controllers.js';

const router = Router();

router.post('/ventas/:cobradorId', agregarVenta); 
router.get('/ventas', getVentas); 
router.get('/ventas/:cobradorId', getVentasporCobrador);
router.patch('/ventas/:ventaId', actualizarCuota); 
router.delete('/ventas/:cobradorId', eliminarVenta); 

export default router;