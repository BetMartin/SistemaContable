import { SubRubro } from "./SubRubro";

class Rubro {
  id: number;
  denominacion: string;
  subRubros: SubRubro[];

  constructor(id: number, denominacion: string, subRubros: SubRubro[] = []) {
    this.id = id;
    this.denominacion = denominacion;
    this.subRubros = subRubros;
  }
}

export { Rubro };