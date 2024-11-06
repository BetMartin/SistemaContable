package DAO;

import Modelo.Entrada;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import java.util.List;

public class EntradaDAO {
    private EntityManagerFactory emf = Persistence.createEntityManagerFactory("ContabilidadPU");

    public void saveEntrada(Entrada entrada) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(entrada);
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            em.close();
        }
    }

    public Entrada getEntradaById(int nroEntrada) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.find(Entrada.class, nroEntrada);
        } finally {
            em.close();
        }
    }

    public List<Entrada> getAllEntradas() {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Entrada> query = em.createQuery("SELECT e FROM Entrada e", Entrada.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void updateEntrada(Entrada entrada) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(entrada);
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            em.close();
        }
    }

    public void deleteEntrada(int nroEntrada) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Entrada entrada = em.find(Entrada.class, nroEntrada);
            if (entrada != null) {
                em.remove(entrada);
            }
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            em.close();
        }
    }
}
