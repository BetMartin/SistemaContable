// controllers/PlanCuentaController.ts
import { mysqlConnection } from "../services/db";
import { PlanCuenta } from "../models/PlanCuenta";
import { SubRubro } from "../models/SubRubro";
import { Rubro } from "../models/Rubro";
import { Entrada } from "../models/Entrada";
import { Asiento } from "../models/Asiento";
import { TipoEntrada } from "../models/TipoEntrada";

class PlanCuentaController {
  /**
   * Lista todos los PlanCuenta guardados en la base de datos.
   * @returns Promise<PlanCuenta[]> Lista de objetos PlanCuenta.
   */
  listarPlanCuentas(): Promise<PlanCuenta[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM planCuenta';
      mysqlConnection.query(query, (err, results) => {
        if (err) {
          console.error('Error al listar planCuenta:', err);
          return reject(new Error('No se pudo listar los planCuenta.'));
        }
        const planCuentas: PlanCuenta[] = results.map((row: any) => new PlanCuenta(row.id, row.nroCuenta, row.denominacion, row.subRubro, []));
        resolve(planCuentas);
      });
    });
  }
  
  /**
   * Lista todos los PlanCuenta por idSubRubro.
   * @param idSubRubro - ID del SubRubro.
   * @returns Promise<PlanCuenta[]> Lista de objetos PlanCuenta.
   */
  listarPlanCuentasPorIdSubRubro(idSubRubro: number): Promise<PlanCuenta[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM planCuenta WHERE idSubRubro = ?';
      mysqlConnection.query(query, [idSubRubro], (err, results) => {
        if (err) {
          console.error('Error al listar planCuenta por idSubRubro:', err);
          return reject(new Error('No se pudo listar los planCuenta por idSubRubro.'));
        }
        const planCuentas: PlanCuenta[] = results.map((row: any) => new PlanCuenta(row.id, row.nroCuenta, row.denominacion, row.subRubro, []));
        resolve(planCuentas);
      });
    });
  }
   /**
   * Busca PlanCuenta por valor que coincida con nroCuenta o denominación.
   * @param valor - Valor a buscar.
   * @returns Promise<PlanCuenta[]> Lista de objetos PlanCuenta.
   */
   buscarPlanCuentasPorValor(valor: string): Promise<PlanCuenta[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT pc.id AS planCuentaId, pc.nroCuenta, pc.denominacion AS planCuentaDenominacion,
               sr.id AS subRubroId, sr.denominacion AS subRubroDenominacion, sr.nroSubRubro,
               r.id AS rubroId, r.denominacion AS rubroDenominacion
        FROM planCuenta pc
        LEFT JOIN subRubro sr ON pc.idSubRubro = sr.id
        LEFT JOIN rubro r ON sr.idRubro = r.id
        WHERE pc.nroCuenta LIKE ? OR pc.denominacion LIKE ?
      `;
      const likeValor = `%${valor}%`;
      mysqlConnection.query(query, [likeValor, likeValor], (err, results) => {
        if (err) {
          console.error('Error al buscar planCuenta por valor:', err);
          return reject(new Error('No se pudo buscar los planCuenta.'));
        }
        const planCuentas: PlanCuenta[] = results.map((row: any) => {
          const rubro = new Rubro(row.rubroId, row.rubroDenominacion);
          const subRubro = new SubRubro(row.subRubroId, row.subRubroDenominacion, row.nroSubRubro, rubro);
          return new PlanCuenta(row.planCuentaId, row.nroCuenta, row.planCuentaDenominacion, subRubro);
        });
        resolve(planCuentas);
      });
    });
  }
  /**
   * Busca un PlanCuenta por nroCuenta.
   * @param nroCuenta - Número de cuenta.
   * @returns Promise<PlanCuenta> Objeto PlanCuenta.
   */
  buscarPlanCuentaPorNroCuenta(nroCuenta: string): Promise<PlanCuenta> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM planCuenta WHERE nroCuenta = ?';
      mysqlConnection.query(query, [nroCuenta], (err, results) => {
        if (err) {
          console.error('Error al buscar planCuenta por nroCuenta:', err);
          return reject(new Error('No se pudo buscar el planCuenta.'));
        }
        if (results.length === 0) {
          return reject(new Error('No se encontró el planCuenta.'));
        }
        const row = results[0];
        const planCuenta = new PlanCuenta(row.id, row.nroCuenta, row.denominacion, row.subRubro, []);
        resolve(planCuenta);
      });
    });
  }

  /**
   * Guarda un nuevo PlanCuenta en la base de datos.
   * @param planCuenta - Objeto PlanCuenta a guardar.
   * @returns Promise<void>
   */
  guardarPlanCuenta(planCuenta: PlanCuenta): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO planCuenta (nroCuenta, denominacion, idsubRubro) VALUES (?, ?, ?)';
      mysqlConnection.query(query, [planCuenta.nroCuenta, planCuenta.denominacion, planCuenta.subRubro.id], (err) => {
        if (err) {
          console.error('Error al guardar planCuenta:', err);
          return reject(new Error('No se pudo guardar el planCuenta.'));
        }
        resolve();
      });
    });
  }

   /**
   * Elimina un PlanCuenta si cuentaActiva es false.
   * @param id - ID del PlanCuenta a eliminar.
   * @returns Promise<void>
   */
   eliminarPlanCuenta(id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const planCuenta = await this.buscarPlanCuentaPorId(id);
        if (planCuenta.cuentaActiva) {
          return reject(new Error('No se pudo eliminar el planCuenta. Asegúrese de que la cuenta esté inactiva.'));
        }

        const query = 'DELETE FROM planCuenta WHERE id = ?';
        mysqlConnection.query(query, [id], (err, results) => {
          if (err) {
            console.error('Error al eliminar planCuenta:', err);
            return reject(new Error('No se pudo eliminar el planCuenta.'));
          }
          if (results.affectedRows === 0) {
            return reject(new Error('No se pudo eliminar el planCuenta. Asegúrese de que la cuenta esté inactiva.'));
          }
          resolve();
        });
      } catch (error) {
        console.error('Error al buscar planCuenta por id:', error);
        return reject(new Error('No se pudo buscar el planCuenta.'));
      }
    });
  }

  /**
   * Busca un PlanCuenta por su ID.
   * @param id - ID del PlanCuenta a buscar.
   * @returns Promise<PlanCuenta>
   */
  buscarPlanCuentaPorId(id: number): Promise<PlanCuenta> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT pc.id AS planCuentaId, pc.nroCuenta, pc.denominacion AS planCuentaDenominacion,
               sr.id AS subRubroId, sr.denominacion AS subRubroDenominacion, sr.nroSubRubro,
               r.id AS rubroId, r.denominacion AS rubroDenominacion
        FROM planCuenta pc
        LEFT JOIN subRubro sr ON pc.idSubRubro = sr.id
        LEFT JOIN rubro r ON sr.idRubro = r.id
        WHERE pc.id = ?
      `;
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error('Error al buscar planCuenta por id:', err);
          return reject(new Error('No se pudo buscar el planCuenta.'));
        }
        if (results.length === 0) {
          return reject(new Error('PlanCuenta no encontrado.'));
        }
        const row = results[0];
        const rubro = new Rubro(row.rubroId, row.rubroDenominacion);
        const subRubro = new SubRubro(row.subRubroId, row.subRubroDenominacion, row.nroSubRubro, rubro);
        const planCuenta = new PlanCuenta(id, row.nroCuenta, row.planCuentaDenominacion, subRubro);
        resolve(planCuenta);
      });
    });
  }
    /**
 * Busca un PlanCuenta por su ID y genera una lista con todas las entradas realizadas.
 * @param idPlanCuenta - ID del PlanCuenta a buscar.
 * @returns Promise<PlanCuenta> Objeto PlanCuenta con sus entradas asociadas.
 */
buscarPlanCuentaConEntradas(idPlanCuenta: number): Promise<PlanCuenta> {
  return new Promise((resolve, reject) => {
    const queryPlanCuenta = `
      SELECT pc.id AS planCuentaId, pc.nroCuenta, pc.denominacion AS planCuentaDenominacion,
             sr.id AS subRubroId, sr.denominacion AS subRubroDenominacion, sr.nroSubRubro,
             r.id AS rubroId, r.denominacion AS rubroDenominacion
      FROM planCuenta pc
      LEFT JOIN subRubro sr ON pc.idSubRubro = sr.id
      LEFT JOIN rubro r ON sr.idRubro = r.id
      WHERE pc.id = ?
    `;

    const queryEntradas = `
      SELECT e.*, a.fecha AS asientoFecha, te.denominacion AS tipoEntradaDenominacion
      FROM entrada e
      LEFT JOIN asiento a ON e.idAsiento = a.id
      LEFT JOIN tipoEntrada te ON e.idTipoEntrada = te.id
      WHERE e.idCuenta = ?
    `;

    // Buscar el PlanCuenta
    mysqlConnection.query(queryPlanCuenta, [idPlanCuenta], (err, planCuentaResult) => {
      if (err) {
        console.error('Error al buscar el PlanCuenta:', err);
        return reject(new Error('No se pudo buscar el PlanCuenta.'));
      }

      if (planCuentaResult.length === 0) {
        return reject(new Error('PlanCuenta no encontrado.'));
      }

      const row = planCuentaResult[0];
      const rubro = new Rubro(row.rubroId, row.rubroDenominacion);
      const subRubro = new SubRubro(row.subRubroId, row.subRubroDenominacion, row.nroSubRubro, rubro);
      const planCuenta = new PlanCuenta(
        row.planCuentaId,
        row.nroCuenta,
        row.planCuentaDenominacion,
        subRubro,
        []
      );

      // Buscar las entradas asociadas al PlanCuenta
      mysqlConnection.query(queryEntradas, [idPlanCuenta], (err, entradasResult) => {
        if (err) {
          console.error('Error al buscar las entradas del PlanCuenta:', err);
          return reject(new Error('No se pudieron buscar las entradas del PlanCuenta.'));
        }

        try {
          const entradas = entradasResult.map((entradaRow: any) => {
            const asiento = new Asiento(entradaRow.idAsiento, entradaRow.asientoFecha);
            const tipoEntrada = new TipoEntrada(entradaRow.idTipoEntrada, entradaRow.tipoEntradaDenominacion);
            return new Entrada(
              entradaRow.id,
              asiento,
              planCuenta,
              entradaRow.descripcion,
              entradaRow.monto,
              tipoEntrada
            );
          });

          // Asignar las entradas al PlanCuenta
          planCuenta.entradas = entradas;

          // Resolver el PlanCuenta completo
          resolve(planCuenta);
        } catch (error) {
          console.error('Error al procesar las entradas del PlanCuenta:', error);
          reject(new Error('No se pudo procesar las entradas del PlanCuenta.'));
        }
      });
    });
  });
}
}

export { PlanCuentaController };