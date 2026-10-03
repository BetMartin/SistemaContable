// controllers/RubroController.ts
import { mysqlConnection } from "../services/db";
import { Rubro } from "../models/Rubro";
import { SubRubro } from "../models/SubRubro";
import { PlanCuenta } from "../models/PlanCuenta";
import { SubRubroController } from "./SubRubroController";
import { PlanCuentaController } from "./PlanCuentaController";

class RubroController {
  private subRubroController = new SubRubroController();
  private planCuentaController = new PlanCuentaController();
  /**
   * Lista todos los Rubros guardados en la base de datos.
   * @returns Promise<Rubro[]> Lista de objetos Rubro.
   */
  listarRubros(): Promise<Rubro[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, denominacion FROM rubro';
      mysqlConnection.query(query, (err, results) => {
        if (err) {
          console.error('Error al listar rubros:', err);
          return reject(new Error('No se pudo listar los rubros.'));
        }
        const rubros: Rubro[] = results.map((row: any) => new Rubro(row.id, row.denominacion));
        resolve(rubros);
      });
    });
  }

  listarRubrosDetallada(): Promise<Rubro[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const rubros = await this.listarRubros();

        for (const rubro of rubros) {
          const subRubros = await this.subRubroController.listarSubRubrosPorIdRubro(rubro.id);
          for (const subRubro of subRubros) {
            const planCuentas = await this.planCuentaController.listarPlanCuentasPorIdSubRubro(subRubro.id);
            subRubro.cuentas = planCuentas;
          }
          rubro.subRubros = subRubros;
        }

        resolve(rubros);
      } catch (error) {
        console.error('Error al listar rubros detallados:', error);
        reject(new Error('No se pudo listar los rubros detallados.'));
      }
    });
  }
}


export { RubroController };