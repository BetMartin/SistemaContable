import { SubRubro } from "./SubRubro";
import { Entrada } from "./Entrada";

export class PlanCuenta {
  id:number;
  nroCuenta:string;
  denominacion:string;
  subRubro:SubRubro;
  entradas:Entrada[];
  saldo:number;
  cuentaActiva:boolean;

  constructor(
    id: number, // ID de la cuenta
    nroCuenta: string, // Número de cuenta en formato string
    denominacion: string, // Nombre o denominación de la cuenta
    subRubro: SubRubro, // SubRubro al que pertenece
    entradas: Entrada[] = [] // Lista de entradas asociadas a esta cuenta
  ) {
    this.id = id;
    this.nroCuenta = nroCuenta;
    this.denominacion = denominacion;
    this.subRubro = subRubro;
    this.entradas = entradas;
    this.saldo = this.ObtenerSaldoCuenta();
    this.cuentaActiva = this.CuentaActiva();
  }

  ObtenerNroCuenta(): string {
    const cantidadCuentas = this.subRubro.cuentas.length; // Calcular la cantidad de PlanCuentas en el subRubro
    const nuevoNumeroCuenta = cantidadCuentas + 1; // Sumarle 1 al total de cuentas
    return `${this.subRubro.rubro.id}.${this.subRubro.nroSubRubro}.${nuevoNumeroCuenta}`;
  }

  CuentaActiva(): boolean {
    return this.entradas.length > 0;
  }

  ObtenerSaldoCuenta(): number {
    const totalDebe = this.entradas
      .filter((entrada) => entrada.tipoPartida === "DEBE") // Filtrar entradas de tipo "DEBE"
      .reduce((suma, entrada) => suma + entrada.monto, 0); // Sumar montos de tipo "DEBE"
  
    const totalHaber = this.entradas
      .filter((entrada) => entrada.tipoPartida === "HABER") // Filtrar entradas de tipo "HABER"
      .reduce((suma, entrada) => suma + entrada.monto, 0); // Sumar montos de tipo "HABER"
  
    return totalDebe - totalHaber; // Restar totalHaber de totalDebe
  }
}