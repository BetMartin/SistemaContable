import { Entrada } from './Entrada';

export class Asiento {
  id: number;
  fecha: Date;
  entradas: Entrada[] = [];

  constructor(id: number, fecha: Date) {
    this.id = id;
    this.fecha = fecha;
  }

  ValidarFecha(asientoBase: Asiento): boolean {
    return this.fecha > asientoBase.fecha;
  }

  CalcularSaldoAsiento(): number {
    const totalDebe = this.entradas
      .filter((entrada) => entrada.tipoPartida === "DEBE") // Filtrar entradas de tipo "DEBE"
      .reduce((suma, entrada) => suma + entrada.monto, 0); // Sumar los montos de tipo "DEBE"
  
    const totalHaber = this.entradas
      .filter((entrada) => entrada.tipoPartida === "HABER") // Filtrar entradas de tipo "HABER"
      .reduce((suma, entrada) => suma + entrada.monto, 0); // Sumar los montos de tipo "HABER"
  
    return totalDebe - totalHaber; // Restar el totalHaber del totalDebe
  }

  ValidarCantEntrada(): boolean {
    return this.entradas.length > 2;
  }
}