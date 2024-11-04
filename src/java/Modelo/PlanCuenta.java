package Modelo;

import java.io.Serializable;
import javax.persistence.*;

@Entity
@Table(name = "planCuenta")
public class PlanCuenta implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    @Column(nullable = true)
    private int nroCuenta;

    @Column(nullable = false)
    private String rubro;

    @Column(nullable = false)
    private String descripcion;

    // Business logic for generating nroCuenta based on rubro and id
public int generateNroCuenta() {
    int nroCuentaGenerado;
    String prefix;
    
    // Determinar el prefijo basado en el rubro
    switch(rubro.toUpperCase()) {
        case "ACTIVO":
            prefix = "1";
            break;
        case "PASIVO":
            prefix = "2";
            break;
        case "PATRIMONIO NETO":
            prefix = "3";
            break;
        case "INGRESO":
            prefix = "4";
            break;
        case "EGRESO":
            prefix = "5";
            break;
        default:
            throw new IllegalArgumentException("Rubro inválido");
    }
    
    // Generar el número de cuenta
    nroCuentaGenerado = Integer.parseInt(prefix + String.format("%03d", this.id));
    
    return nroCuentaGenerado;
}

    //Constructor

    public PlanCuenta() {
    }

    public PlanCuenta(String rubro, String descripcion) {
        this.rubro = rubro;
        this.descripcion = descripcion;
    }

    public PlanCuenta(int nroCuenta, String rubro, String descripcion) {
        this.nroCuenta = nroCuenta;
        this.rubro = rubro;
        this.descripcion = descripcion;
    }
    
    
    // Getters, setters
    public int getNroCuenta() {
        return nroCuenta;
    }

    public void setNroCuenta(int nroCuenta) {
        this.nroCuenta = nroCuenta;
    }

    public String getRubro() {
        return rubro;
    }

    public void setRubro(String rubro) {
        this.rubro = rubro;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
