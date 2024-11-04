package Modelo;

import javax.persistence.*;
import java.util.Set;
import java.util.Date;

@Entity
@Table(name = "asiento")
public class Asiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idAsiento")
    private int idAsiento;

    @Column(name = "Fecha")
    private Date fecha;

    @OneToMany(mappedBy = "asiento", cascade = CascadeType.ALL)
    private Set<Entrada> entradas;

    // Getters and setters
    public int getIdAsiento() {
        return idAsiento;
    }

    public void setIdAsiento(int idAsiento) {
        this.idAsiento = idAsiento;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Set<Entrada> getEntradas() {
        return entradas;
    }

    public void setEntradas(Set<Entrada> entradas) {
        this.entradas = entradas;
    }
}