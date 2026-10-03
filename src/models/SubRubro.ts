import { Rubro } from "./Rubro";
import { PlanCuenta } from "./PlanCuenta";

export class SubRubro {
  public cuentas: PlanCuenta[] = [];

  constructor(
    public id: number,
    public denominacion: string,
    public nroSubRubro: number,
    public rubro: Rubro // Rubro asociado a este subrubro
  ) {}
}