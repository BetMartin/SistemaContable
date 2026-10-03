// routes/planCuentaRoutes.ts
import express from 'express';
import { PlanCuentaController } from '../controllers/PlanCuentaController';
import { PlanCuenta } from '../models/PlanCuenta';
import { SubRubro } from '../models/SubRubro';
import { SubRubroController } from '../controllers/SubRubroController';

const router = express.Router();
const planCuentaController = new PlanCuentaController();
const subRubroController = new SubRubroController();

// Ruta para listar todos los planCuenta
router.get('/listar', async (req, res) => {
  try {
    const planCuentas = await planCuentaController.listarPlanCuentas();
    res.json(planCuentas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los planCuenta'});
  }
});

// Ruta para buscar planCuenta por nroCuenta
router.get('/buscar/:nroCuenta', async (req, res) => {
  const nroCuenta = req.params.nroCuenta;
  try {
    const planCuenta = await planCuentaController.buscarPlanCuentaPorNroCuenta(nroCuenta);
    res.json(planCuenta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el planCuenta'});
  }
});
// Ruta para buscar planCuenta por id
router.get('/buscarPorId/:id', async (req, res) => {
  const id = req.params.id;
  const idNumber = parseInt(id, 10);
  try {
    const planCuenta = await planCuentaController.buscarPlanCuentaPorId(idNumber);
    res.json(planCuenta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el planCuenta'});
  }
});

// Ruta para buscar planCuenta por valor
router.get('/buscarPorValor/:valor', async (req, res) => {
  const valor = req.params.valor;
  try {
    const planCuentas = await planCuentaController.buscarPlanCuentasPorValor(valor);
    res.json(planCuentas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar los planCuenta por valor'});
  }
});


// Ruta para guardar un nuevo planCuenta
router.post('/guardar', async (req, res) => {
  const { denominacion, subrubro } = req.body;
  if (isNaN(subrubro)) {
    return res.status(400).json({ mensaje: 'El subrubro debe ser un número válido' });
  }
  try {
    const subRubro = await subRubroController.obtenerSubRubroPorId(subrubro);
    const cantCuentas =(await planCuentaController.listarPlanCuentasPorIdSubRubro(subrubro)).length + 1;
    const nroCuenta = cantCuentas.toString();
    const planCuenta = new PlanCuenta(0, nroCuenta, denominacion, subRubro, []);
    await planCuentaController.guardarPlanCuenta(planCuenta);
    res.status(201).json({ mensaje: 'PlanCuenta guardado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar el planCuenta'});
  }
});

// Ruta para eliminar un planCuenta
router.delete('/eliminar/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await planCuentaController.eliminarPlanCuenta(id);
    res.json({ mensaje: 'PlanCuenta eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el planCuenta'});
  }
});
// Ruta para buscar planCuenta con entradas por id
router.get('/buscarEntradas/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const planCuenta = await planCuentaController.buscarPlanCuentaConEntradas(id);
    res.json(planCuenta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el planCuenta con entradas' });
  }
});

export default router;