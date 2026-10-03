import express from 'express';
import { EntradaController } from '../controllers/EntradaController';
import { mysqlConnection } from '../services/db';

const router = express.Router();
const entradaController = new EntradaController();

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

// Ruta para buscar todas las entradas por idCuenta
router.get('/buscarPorIdCuenta/:idCuenta', async (req, res) => {
  const idCuenta = parseInt(req.params.idCuenta, 10);
  try {
    const entradas = await entradaController.buscarEntradasPorIdCuenta(idCuenta);
    res.json(entradas);
  } catch (error) {
    console.error('Error al buscar las entradas por idCuenta:', error);
    res.status(500).json({ mensaje: 'Error al buscar las entradas por idCuenta' });
  }
});

// Ruta para buscar todas las entradas por idCuenta y fecha (mes y año)
router.get('/buscarPorIdCuentaYFecha/:idCuenta/:fecha', async (req, res) => {
  const idCuenta = parseInt(req.params.idCuenta, 10);
  const fecha = req.params.fecha; // Formato "yyyy-mm"
  try {
    const entradas = await entradaController.buscarEntradasPorIdCuentaYFecha(idCuenta, fecha);
    res.json(entradas);
  } catch (error) {
    console.error('Error al buscar las entradas por idCuenta y fecha:', error);
    res.status(500).json({ mensaje: 'Error al buscar las entradas por idCuenta y fecha' });
  }
});


router.get('/buscar', async (req, res) => {
  const { cuenta, mes } = req.query;

  if (!cuenta || !mes) {
    return res.status(400).json({ mensaje: 'Los parámetros cuenta y mes son obligatorios.' });
  }

  try {
    const query = `
      SELECT 
          e.id AS entradaId,
          e.descripcion,
          e.monto,
          e.idTipoEntrada,
          te.denominacion AS tipoEntrada,
          e.idCuenta,
          pc.nroCuenta,
          pc.denominacion AS cuentaDenominacion,
          a.fecha,
          sr.id AS idSubRubro,
          r.id AS idRubro
      FROM 
          entrada e
      INNER JOIN 
          planCuenta pc ON e.idCuenta = pc.id
      INNER JOIN 
          tipoEntrada te ON e.idTipoEntrada = te.id
      INNER JOIN 
          asiento a ON e.idAsiento = a.id
      INNER JOIN
          subRubro sr ON pc.idSubRubro = sr.id
      INNER JOIN
          rubro r ON sr.idRubro = r.id
      WHERE 
          e.idCuenta = ?
          AND DATE_FORMAT(a.fecha, '%Y-%m') = ?;
    `;

    // Ejecutar la consulta
    const resultados = await queryAsync(query, [cuenta, mes]);

    // Calcular el saldo dinámicamente
    let totalDebe = 0;
    let totalHaber = 0;

    resultados.forEach((movimiento: any) => {
      const tipoPartida = definirTipoPartida(movimiento.idTipoEntrada, movimiento.idRubro);

      if (tipoPartida === "DEBE") {
        totalDebe += movimiento.monto;
      } else if (tipoPartida === "HABER") {
        totalHaber += movimiento.monto;
      }
    });

    const saldo = totalDebe - totalHaber;

    res.json({ movimientos: resultados, saldo });
  } catch (error) {
    console.error('Error al buscar entradas del libro mayor:', error);
    res.status(500).json({ mensaje: 'Error al buscar entradas del libro mayor.' });
  }
});


router.get("/saldo", async (req, res) => {
  const { cuenta } = req.query;

  if (!cuenta) {
    return res.status(400).json({ mensaje: "El ID de la cuenta es obligatorio." });
  }

  try {
    const query = `
      SELECT 
          SUM(CASE WHEN e.idTipoEntrada = 1 THEN e.monto ELSE 0 END) AS totalDebe,
          SUM(CASE WHEN e.idTipoEntrada = 2 THEN e.monto ELSE 0 END) AS totalHaber
      FROM entrada e
      WHERE e.idCuenta = ?;
    `;
    const rows: any = await queryAsync(query, [cuenta]);

    // Validar que existan resultados
    if (!rows || rows.length === 0 || (!rows[0].totalDebe && !rows[0].totalHaber)) {
      return res.json({ saldo: 0 }); // Si no hay movimientos, el saldo es 0
    }

    const saldo = (rows[0].totalDebe || 0) - (rows[0].totalHaber || 0);
    res.json({ saldo });
  } catch (error) {
    console.error("Error al calcular el saldo de la cuenta:", error);
    res.status(500).json({ mensaje: "Error al calcular el saldo de la cuenta." });
  }
});



router.post("/registrar", async (req, res) => {
  const { idCuenta, descripcion, monto, tipoEntrada } = req.body;

  if (!idCuenta || !descripcion || !monto || !tipoEntrada) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
  }

  try {
    // Obtener el saldo actual de la cuenta
    const querySaldo = `
      SELECT 
          SUM(CASE WHEN e.idTipoEntrada = 1 THEN e.monto ELSE 0 END) AS totalDebe,
          SUM(CASE WHEN e.idTipoEntrada = 2 THEN e.monto ELSE 0 END) AS totalHaber
      FROM entrada e
      WHERE e.idCuenta = ?;
    `;
    const [rows]: any = await queryAsync(querySaldo, [idCuenta]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "La cuenta no tiene movimientos registrados." });
    }

    const saldoActual = rows[0].totalDebe - rows[0].totalHaber;

    // Validar que el saldo sea suficiente si el movimiento es de tipo "baja"
    if (tipoEntrada === 2 && monto > saldoActual) {
      return res
        .status(400)
        .json({
          mensaje: `Saldo insuficiente. El saldo actual de la cuenta es ${saldoActual.toFixed(
            2
          )}, y el monto a registrar es ${monto.toFixed(2)}.`,
        });
    }

    // Registrar el movimiento
    const queryInsert = `
      INSERT INTO entrada (idCuenta, descripcion, monto, idTipoEntrada)
      VALUES (?, ?, ?, ?);
    `;
    await queryAsync(queryInsert, [idCuenta, descripcion, monto, tipoEntrada]);

    res.status(201).json({ mensaje: "Movimiento registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar el movimiento:", error);
    res.status(500).json({ mensaje: "Error al registrar el movimiento." });
  }
});



/**
* Determina si un movimiento es DEBE o HABER según la lógica proporcionada.
*/
function definirTipoPartida(idTipoEntrada: number, idRubro: number): string {
  if (idTipoEntrada === 1 && (idRubro === 1 || idRubro === 5)) {
      return "DEBE";
  } else if (idTipoEntrada === 2 && (idRubro === 1 || idRubro === 5)) {
      return "HABER";
  } else if (idTipoEntrada === 1 && [2, 3, 4].includes(idRubro)) {
      return "HABER";
  } else if (idTipoEntrada === 2 && [2, 3, 4].includes(idRubro)) {
      return "DEBE";
  }
  return "";
}





export default router;