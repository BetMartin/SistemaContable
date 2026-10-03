import { mysqlConnection } from "../services/db";
import { Asiento } from "../models/Asiento";
import { Rubro } from "../models/Rubro";
import { Entrada } from "../models/Entrada";
import { PlanCuenta } from "../models/PlanCuenta";
import { SubRubro } from "../models/SubRubro";
import { TipoEntrada } from "../models/TipoEntrada";


class AsientoController {
  // Otros métodos...

  /**
   * Lista todos los asientos.
   * @returns Promise<Asiento[]> Lista de objetos Asiento.
   */
  listarTodosLosAsientos(): Promise<Asiento[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM asiento';
      mysqlConnection.query(query, (err, results) => {
        if (err) {
          console.error('Error al listar todos los asientos:', err);
          return reject(new Error('No se pudo listar los asientos.'));
        }
        const asientos: Asiento[] = results.map((row: any) => new Asiento(row.id, row.fecha));
        resolve(asientos);
      });
    });
  }

/**
   * Busca un asiento por su ID.
   * @param id - ID del asiento a buscar.
   * @returns Promise<Asiento>
   */
buscarAsientoPorId(id: number): Promise<Asiento> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM asiento WHERE id = ?';
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error('Error al buscar asiento por id:', err);
          return reject(new Error('No se pudo buscar el asiento.'));
        }
        if (results.length === 0) {
          return reject(new Error('Asiento no encontrado.'));
        }
        const row = results[0];
        const asiento = new Asiento(row.id, row.fecha);
        resolve(asiento);
      });
    });
  }


  listarTodosLosAsientosDetallados(): Promise<Asiento[]> {
    return new Promise((resolve, reject) => {
      const queryAsientos = 'SELECT * FROM asiento';
      const queryEntradas = `
        SELECT e.*, pc.id AS planCuentaId, pc.nroCuenta, pc.denominacion AS planCuentaDenominacion,
               sr.id AS subRubroId, sr.denominacion AS subRubroDenominacion, sr.nroSubRubro,
               r.id AS rubroId, r.denominacion AS rubroDenominacion, te.denominacion AS tipoEntradaDenominacion
        FROM entrada e
        LEFT JOIN planCuenta pc ON e.idCuenta = pc.id
        LEFT JOIN subRubro sr ON pc.idSubRubro = sr.id
        LEFT JOIN rubro r ON sr.idRubro = r.id
        LEFT JOIN tipoEntrada te ON e.idTipoEntrada = te.id
        WHERE e.idAsiento = ?
      `;
  
      mysqlConnection.query(queryAsientos, (err, asientosResult) => {
        if (err) {
          console.error('Error al listar los asientos:', err);
          return reject(new Error('No se pudo listar los asientos.'));
        }
  
        const asientosPromises = asientosResult.map((asientoRow: any) => {
          return new Promise<Asiento>((resolveAsiento, rejectAsiento) => {
            mysqlConnection.query(queryEntradas, [asientoRow.id], (err, entradasResult) => {
              if (err) {
                console.error('Error al listar entradas para el asiento:', err);
                return rejectAsiento(new Error('No se pudieron listar las entradas.'));
              }
  
              try {
                const entradas = entradasResult.map((entradaRow: any) => {
                  const rubro = new Rubro(entradaRow.rubroId, entradaRow.rubroDenominacion);
                  const subRubro = new SubRubro(
                    entradaRow.subRubroId,
                    entradaRow.subRubroDenominacion,
                    entradaRow.nroSubRubro,
                    rubro
                  );
                  const planCuenta = new PlanCuenta(
                    entradaRow.planCuentaId,
                    entradaRow.nroCuenta,
                    entradaRow.planCuentaDenominacion,
                    subRubro
                  );
                  const tipoEntrada = new TipoEntrada(entradaRow.idTipoEntrada, entradaRow.tipoEntradaDenominacion);
                  return new Entrada(
                    entradaRow.id,
                    new Asiento(asientoRow.id, asientoRow.fecha),
                    planCuenta,
                    entradaRow.descripcion,
                    entradaRow.monto,
                    tipoEntrada
                  );
                });
  
                const asiento = new Asiento(asientoRow.id, asientoRow.fecha);
                asiento.entradas = entradas;
                resolveAsiento(asiento);
              } catch (error) {
                console.error('Error al procesar las entradas del asiento:', error);
                rejectAsiento(new Error('No se pudo procesar las entradas del asiento.'));
              }
            });
          });
        });
  
        Promise.all(asientosPromises)
          .then((asientosDetallados) => resolve(asientosDetallados))
          .catch((error) => {
            console.error('Error al procesar los asientos detallados:', error);
            reject(new Error('No se pudo procesar los asientos detallados.'));
          });
      });
    });
  }

  listarAsientosPorFecha(fecha: string): Promise<Asiento[]> {
    return new Promise((resolve, reject) => {
      const queryAsientos = 'SELECT * FROM asiento WHERE fecha = ?';
      const queryEntradas = `
        SELECT e.*, pc.id AS planCuentaId, pc.nroCuenta, pc.denominacion AS planCuentaDenominacion,
               sr.id AS subRubroId, sr.denominacion AS subRubroDenominacion, sr.nroSubRubro,
               r.id AS rubroId, r.denominacion AS rubroDenominacion, te.denominacion AS tipoEntradaDenominacion
        FROM entrada e
        LEFT JOIN planCuenta pc ON e.idCuenta = pc.id
        LEFT JOIN subRubro sr ON pc.idSubRubro = sr.id
        LEFT JOIN rubro r ON sr.idRubro = r.id
        LEFT JOIN tipoEntrada te ON e.idTipoEntrada = te.id
        WHERE e.idAsiento = ?
      `;
  
      mysqlConnection.query(queryAsientos, [fecha], (err, asientosResult) => {
        if (err) {
          console.error('Error al listar los asientos:', err);
          return reject(new Error('No se pudo listar los asientos.'));
        }
  
        const asientosPromises = asientosResult.map((asientoRow: any) => {
          return new Promise<Asiento>((resolveAsiento, rejectAsiento) => {
            mysqlConnection.query(queryEntradas, [asientoRow.id], (err, entradasResult) => {
              if (err) {
                console.error('Error al listar entradas para el asiento:', err);
                return rejectAsiento(new Error('No se pudieron listar las entradas.'));
              }
  
              try {
                const entradas = entradasResult.map((entradaRow: any) => {
                  const rubro = new Rubro(entradaRow.rubroId, entradaRow.rubroDenominacion);
                  const subRubro = new SubRubro(
                    entradaRow.subRubroId,
                    entradaRow.subRubroDenominacion,
                    entradaRow.nroSubRubro,
                    rubro
                  );
                  const planCuenta = new PlanCuenta(
                    entradaRow.planCuentaId,
                    entradaRow.nroCuenta,
                    entradaRow.planCuentaDenominacion,
                    subRubro
                  );
                  const tipoEntrada = new TipoEntrada(entradaRow.idTipoEntrada, entradaRow.tipoEntradaDenominacion);
                  return new Entrada(
                    entradaRow.id,
                    new Asiento(asientoRow.id, asientoRow.fecha),
                    planCuenta,
                    entradaRow.descripcion,
                    entradaRow.monto,
                    tipoEntrada
                  );
                });
  
                const asiento = new Asiento(asientoRow.id, asientoRow.fecha);
                asiento.entradas = entradas;
                resolveAsiento(asiento);
              } catch (error) {
                console.error('Error al procesar las entradas del asiento:', error);
                rejectAsiento(new Error('No se pudo procesar las entradas del asiento.'));
              }
            });
          });
        });
  
        Promise.all(asientosPromises)
          .then((asientosDetallados) => resolve(asientosDetallados))
          .catch((error) => {
            console.error('Error al procesar los asientos detallados:', error);
            reject(new Error('No se pudo procesar los asientos detallados.'));
          });
      });
    });
  }

  

  guardarAsiento(asiento: Asiento): Promise<void> {
    return new Promise((resolve, reject) => {
      // Validar que la suma de las entradas de tipo DEBE sea igual a la suma de las entradas de tipo HABER
      const sumaDebe = asiento.entradas
        .filter(entrada => entrada.tipoPartida === 'DEBE')
        .reduce((sum, entrada) => sum + entrada.monto, 0);
      const sumaHaber = asiento.entradas
        .filter(entrada => entrada.tipoPartida === 'HABER')
        .reduce((sum, entrada) => sum + entrada.monto, 0);
  
      if (sumaDebe !== sumaHaber) {
        return reject(new Error('La suma de las entradas de tipo DEBE debe ser igual a la suma de las entradas de tipo HABER.'));
      }
  
      // Validar que el monto ingresado para cada entrada pase la validación ValidarSaldoCuenta
      for (const entrada of asiento.entradas) {
        if (!entrada.ValidarSaldoCuenta()) {
          return reject(new Error('El monto ingresado para la cuenta ${entrada.cuenta.id} no es válido.'));
        }
      }
  
      const queryAsiento = 'INSERT INTO asiento (fecha, descripcion) VALUES (?, ?)';
      mysqlConnection.query(queryAsiento, [asiento.fecha], (err, result) => {
        if (err) {
          console.error('Error al guardar el asiento:', err);
          return reject(new Error('No se pudo guardar el asiento.'));
        }
  
        const asientoId = result.insertId;
        const queryEntrada = 'INSERT INTO entrada (idAsiento, idCuenta, descripcion, monto, idTipoEntrada, tipoPartida) VALUES ?';
        const entradasValues = asiento.entradas.map((entrada: Entrada) => [
          asientoId,
          entrada.cuenta.id,
          entrada.descripcion,
          entrada.monto,
          entrada.tipoEntrada.id,
          entrada.tipoPartida
        ]);
  
        mysqlConnection.query(queryEntrada, [entradasValues], (err) => {
          if (err) {
            console.error('Error al guardar las entradas del asiento:', err);
            return reject(new Error('No se pudieron guardar las entradas del asiento.'));
          }
  
          resolve();
        });
      });
    });
  }
  }


export { AsientoController };