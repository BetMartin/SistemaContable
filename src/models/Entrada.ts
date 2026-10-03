import { Asiento } from './Asiento';
import { PlanCuenta } from './PlanCuenta';
import { TipoEntrada } from './TipoEntrada';

export class Entrada {
    id: number;
    asiento: Asiento;
    cuenta: PlanCuenta;
    descripcion: string;
    monto: number;
    tipoEntrada: TipoEntrada;
    tipoPartida: string;
  
    constructor(
      id: number,
      asiento: Asiento,
      cuenta: PlanCuenta,
      descripcion: string,
      monto: number,
      tipoEntrada: TipoEntrada
    ) {
      this.id = id;
      this.asiento = asiento;
      this.cuenta = cuenta;
      this.descripcion = descripcion;
      this.monto = monto;
      this.tipoEntrada = tipoEntrada;
      this.tipoPartida = this.DefinirTipoPartida();
    }
  
    DefinirTipoPartida(): string {
      const rubroId = this.cuenta.subRubro.rubro.id;
  
      if (this.tipoEntrada.id === 1 && (rubroId === 1 || rubroId === 5)) {
        return "DEBE";
      } else if (this.tipoEntrada.id === 2 && (rubroId === 1 || rubroId === 5)) {
        return "HABER";
      } else if (this.tipoEntrada.id === 1 && [2, 3, 4].includes(rubroId)) {
        return "HABER";
      } else if (this.tipoEntrada.id === 2 && [2, 3, 4].includes(rubroId)) {
        return "DEBE";
      }
      return "";
    }
  
    ValidarSaldoCuenta(): boolean {
      if (this.tipoEntrada.id === 2 && this.monto > this.cuenta.saldo) {
        return false; // Falso si el tipoEntrada es de id 2 y el monto es mayor al saldo de la cuenta
      }
      return this.cuenta.saldo > 0; // Verdadero si el saldo de la cuenta es mayor a 0
    }
  }
  