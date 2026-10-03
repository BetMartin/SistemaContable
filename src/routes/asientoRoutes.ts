import express from 'express';
import { AsientoController } from '../controllers/AsientoController';
import { Asiento } from '../models/Asiento';
import { Entrada } from '../models/Entrada';  
import { PlanCuenta } from '../models/PlanCuenta';
import { TipoEntrada } from '../models/TipoEntrada';
import { SubRubro } from '../models/SubRubro';
import { Rubro } from '../models/Rubro';
import { PlanCuentaController } from '../controllers/PlanCuentaController';
import { mysqlConnection } from '../services/db';
import { Router, Request, Response } from "express";
 // La función para envolver consultas



const router = express.Router();
const asientoController = new AsientoController();


// Ruta para listar todos los asientos detallados
router.get('/listarDetallados', async (req, res) => {
  try {
    const asientosDetallados = await asientoController.listarTodosLosAsientosDetallados();
    res.json(asientosDetallados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los asientos detallados'});
  }
});

// Ruta para listar los asientos por fecha
router.get('/listarPorFecha/:fecha', async (req, res) => {
    const { fecha } = req.params;
    try {
      const asientosPorFecha = await asientoController.listarAsientosPorFecha(fecha);
      res.json(asientosPorFecha);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al listar los asientos por fecha' });
    }
  });

  function queryAsync(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}


router.post("/guardar", async (req: Request, res: Response) => {
  const { fecha, movimientos } = req.body;

  // Validación de los datos recibidos
  if (!fecha || !movimientos || movimientos.length === 0) {
      return res.status(400).json({ mensaje: "Datos incompletos para guardar el asiento." });
  }

  try {
      // Iniciar la transacción
      await queryAsync("START TRANSACTION");

      // Insertar el asiento en la tabla `asiento`
      const queryAsiento = "INSERT INTO asiento (fecha) VALUES (?)";
      const asientoResult: any = await queryAsync(queryAsiento, [fecha]);
      const idAsiento = asientoResult.insertId;

      // Preparar las entradas asociadas al asiento
      const queryEntrada = `
          INSERT INTO entrada (idAsiento, idCuenta, descripcion, monto, idTipoEntrada)
          VALUES ?
      `;
      const valores = movimientos.map((mov: any) => [
          idAsiento,
          mov.idCuenta,
          mov.descripcion,
          mov.monto,
          mov.tipoEntrada,
      ]);

      // Ejecutar la consulta para guardar las entradas
      await queryAsync(queryEntrada, [valores]);

      // Confirmar la transacción
      await queryAsync("COMMIT");

      res.status(201).json({ mensaje: "Asiento y movimientos guardados correctamente." });
  } catch (error) {
      // Revertir la transacción en caso de error
      await queryAsync("ROLLBACK");
      console.error("Error al guardar el asiento:", error);
      res.status(500).json({ mensaje: "Error al guardar el asiento." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ mensaje: "El ID del asiento es obligatorio." });
  }

  try {
      const query = "SELECT fecha FROM asiento WHERE id = ?";
      const [rows]: any = await queryAsync(query, [id]);

      if (rows.length === 0) {
          return res.status(404).json({ mensaje: "Asiento no encontrado." });
      }

      res.json(rows[0]);
  } catch (error) {
      console.error("Error al obtener el asiento:", error);
      res.status(500).json({ mensaje: "Error al obtener el asiento." });
  }
});


  
  
export default router;