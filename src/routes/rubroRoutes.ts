
import express from 'express';
import { RubroController } from '../controllers/RubroController';

const router = express.Router();
const rubroController = new RubroController();

// Ruta para listar todos los rubros
router.get('/listar', async (req, res) => {
  try {
    const rubros = await rubroController.listarRubros();
    res.json(rubros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los rubros'});
  }
});

// Ruta para listar todos los rubros detallados
router.get('/listarDetallada', async (req, res) => {
  try {
    const rubrosDetallados = await rubroController.listarRubrosDetallada();
    res.json(rubrosDetallados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los rubros detallados'});
  }
});
export default router;