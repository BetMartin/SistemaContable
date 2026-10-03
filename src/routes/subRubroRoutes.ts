// routes/subRubroRoutes.ts
import express from 'express';
import { SubRubroController } from '../controllers/SubRubroController';

const router = express.Router();
const subRubroController = new SubRubroController();

// Ruta para listar todos los subrubros
router.get('/listar', async (req, res) => {
  try {
    const subRubros = await subRubroController.listarSubRubros();
    res.json(subRubros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los subrubros'});
  }
});

// Ruta para listar subrubros por idRubro
router.get('/listar/:idRubro', async (req, res) => {
  const idRubro = parseInt(req.params.idRubro);
  try {
    const subRubros = await subRubroController.listarSubRubrosPorIdRubro(idRubro);
    res.json(subRubros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los subrubros por idRubro'});
  }
});
// Ruta para obtener un subRubro por id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const subRubro = await subRubroController.obtenerSubRubroPorId(id);
    res.json(subRubro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el subRubro por id'});
  }
});

export default router;