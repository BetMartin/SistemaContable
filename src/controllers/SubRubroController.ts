// controllers/SubRubroController.ts
import { mysqlConnection } from "../services/db";
import { SubRubro } from "../models/SubRubro";

class SubRubroController {
  /**
   * Lista todos los SubRubros guardados en la base de datos.
   * @returns Promise<SubRubro[]> Lista de objetos SubRubro.
   */
  listarSubRubros(): Promise<SubRubro[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, denominacion, nroSubRubro, idRubro FROM subRubro';
      mysqlConnection.query(query, (err, results) => {
        if (err) {
          console.error('Error al listar subrubros:', err);
          return reject(new Error('No se pudo listar los subrubros.'));
        }
        const subRubros: SubRubro[] = results.map((row: any) => new SubRubro(row.id, row.denominacion, row.nroSubRubro, row.idRubro));
        resolve(subRubros);
      });
    });
  }

  /**
   * Lista los SubRubros por idRubro.
   * @param idRubro - ID del Rubro.
   * @returns Promise<SubRubro[]> Lista de objetos SubRubro.
   */
  listarSubRubrosPorIdRubro(idRubro: number): Promise<SubRubro[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, denominacion, nroSubRubro, idRubro FROM subRubro WHERE idRubro = ?';
      mysqlConnection.query(query, [idRubro], (err, results) => {
        if (err) {
          console.error('Error al listar subrubros por idRubro:', err);
          return reject(new Error('No se pudo listar los subrubros por idRubro.'));
        }
        const subRubros: SubRubro[] = results.map((row: any) => new SubRubro(row.id, row.denominacion, row.nroSubRubro, row.idRubro));
        resolve(subRubros);
      });
    });
  }

/**
   * Obtiene un SubRubro por su ID.
   * @param id - ID del SubRubro.
   * @returns Promise<SubRubro> Objeto SubRubro.
   */
  obtenerSubRubroPorId(id: number): Promise<SubRubro> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM subRubro WHERE id = ?';
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error('Error al obtener subRubro por id:', err);
          return reject(new Error('No se pudo obtener el subRubro.'));
        }
        if (results.length === 0) {
          return reject(new Error('SubRubro no encontrado.'));
        }
        const row = results[0];
        const subRubro = new SubRubro(row.id, row.denominacion, row.nroSubRubro, row.idRubro);
        resolve(subRubro);
      });
    });
  }
}
export { SubRubroController };