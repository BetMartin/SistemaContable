import { mysqlConnection } from "../services/db";
import { Entrada } from "../models/Entrada";
import { PlanCuentaController } from "./PlanCuentaController";
import { AsientoController } from "./AsientoController";
import { PlanCuenta } from "../models/PlanCuenta";
import { Asiento } from "../models/Asiento";
import { TipoEntrada } from "../models/TipoEntrada";
import { Rubro } from "../models/Rubro";
import { SubRubro } from "../models/SubRubro";

class EntradaController {
  // Otros métodos...

/**
   * Busca todas las entradas por idCuenta.
   * @param idCuenta - ID de la cuenta.
   * @returns Promise<Entrada[]> Lista de objetos Entrada.
   */
buscarEntradasPorIdCuenta(idCuenta: number): Promise<Entrada[]> {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM entrada WHERE idCuenta = ?';
    mysqlConnection.query(query, [idCuenta], async (err, results) => {
      if (err) {
        console.error('Error al buscar entradas por idCuenta:', err);
        return reject(new Error('No se pudo buscar las entradas.'));
      }

      try {
        const planCuentaController = new PlanCuentaController();
        const asientocontroller = new AsientoController();

        const entradas: Entrada[] = await Promise.all(results.map(async (row: any) => {
          const planCuenta = await planCuentaController.buscarPlanCuentaPorId(row.idCuenta);
          const asiento = await asientocontroller.buscarAsientoPorId(row.idAsiento);
          return new Entrada(row.id, asiento, planCuenta, row.descripcion, row.monto, row.tipoEntrada);
        }));

        resolve(entradas);
      } catch (error) {
        console.error('Error al procesar las entradas:', error);
        reject(new Error('No se pudo procesar las entradas.'));
      }
    });
  });
}

    /**
   * Busca todas las entradas por idAsiento.
   * @param idAsiento - ID del asiento.
   * @returns Promise<Entrada[]> Lista de objetos Entrada.
   */
    buscarEntradasPorIdAsiento(idAsiento: number): Promise<Entrada[]> {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM entrada WHERE idAsiento = ?';
        mysqlConnection.query(query, [idAsiento], async (err, results) => {
          if (err) {
            console.error('Error al buscar entradas por idAsiento:', err);
            return reject(new Error('No se pudo buscar las entradas.'));
          }
  
          try {
            const asientoController = new AsientoController();
            const asiento = await asientoController.buscarAsientoPorId(idAsiento);
            const planCuentaController = new PlanCuentaController();
            const entradas: Entrada[] = await Promise.all(results.map(async (row: any) => {
              const planCuenta = await planCuentaController.buscarPlanCuentaPorId(row.idCuenta);
              if (!planCuenta) {
                throw new Error(`PlanCuenta con id ${row.idCuenta} no encontrado`);
              }
              return new Entrada(row.id, asiento, planCuenta,row.descripcion, row.monto, row.tipoEntrada);
            }));
  
            resolve(entradas);
          } catch (error) {
            console.error('Error al procesar las entradas:', error);
            reject(new Error('No se pudo procesar las entradas.'));
          }
        });
      });
    }
    /**
   * Busca todas las entradas por idCuenta y fecha (mes y año).
   * @param idCuenta - ID de la cuenta.
   * @param fecha - Fecha en formato "yyyy-mm".
   * @returns Promise<Entrada[]> Lista de objetos Entrada.
   */
    async buscarEntradasPorIdCuentaYFecha(idCuenta: number, fecha: string): Promise<Entrada[]> {
      try {
        const entradas = await this.buscarEntradasPorIdCuenta(idCuenta);
        const [year, month] = fecha.split('-').map(Number);
  
        const entradasFiltradas = entradas.filter(entrada => {
          const entradaFecha = new Date(entrada.asiento.fecha);
          return entradaFecha.getFullYear() === year && (entradaFecha.getMonth() + 1) === month;
        });
  
        return entradasFiltradas;
      } catch (error) {
        console.error('Error al buscar entradas por idCuenta y fecha:', error);
        throw new Error('No se pudo buscar las entradas por idCuenta y fecha.');
      }
    }
  }  


export { EntradaController };