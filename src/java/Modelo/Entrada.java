package Modelo;
import java.io.Serializable;
import javax.persistence.*;

@Entity
@Table(name = "entrada")
public class Entrada implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nroEntrada")
    private int nroEntrada;

    @Column(name = "monto")
    private double monto;

    @Column(name = "tipoRegistro")
    private int tipoRegistro;

    @ManyToOne
    @JoinColumn(name = "plan_cuenta_nroCuenta", foreignKey = @ForeignKey(name = "FK_plan_cuenta", foreignKeyDefinition = "FOREIGN KEY (plan_cuenta_nroCuenta) REFERENCES plan_cuenta(nroCuenta) ON DELETE RESTRICT"))
    private PlanCuenta planCuenta;

    @ManyToOne
    @JoinColumn(name = "asiento_idAsiento")
    private Asiento asiento;

    @Column(name = "descripcion", length = 45)
    private String descripcion;

    // Getters and setters
    public int getNroEntrada() {
        return nroEntrada;
    }

    public void setNroEntrada(int nroEntrada) {
        this.nroEntrada = nroEntrada;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public int getTipoRegistro() {
        return tipoRegistro;
    }

    public void setTipoRegistro(int tipoRegistro) {
        this.tipoRegistro = tipoRegistro;
    }

    public PlanCuenta getPlanCuenta() {
        return planCuenta;
    }

    public void setPlanCuenta(PlanCuenta planCuenta) {
        this.planCuenta = planCuenta;
    }

    public Asiento getAsiento() {
        return asiento;
    }

    public void setAsiento(Asiento asiento) {
        this.asiento = asiento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}