package DAO;

import Modelo.Asiento;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import java.util.List;

public class AsientoDAO {
    private EntityManagerFactory emf = Persistence.createEntityManagerFactory("ContabilidadPU");

    public void saveAsiento(Asiento asiento) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(asiento);
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

    public Asiento getAsientoById(int idAsiento) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.find(Asiento.class, idAsiento);
        } finally {
            em.close();
        }
    }

    public List<Asiento> getAllAsientos() {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Asiento> query = em.createQuery("SELECT a FROM Asiento a", Asiento.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void updateAsiento(Asiento asiento) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(asiento);
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

    public void deleteAsiento(int idAsiento) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Asiento asiento = em.find(Asiento.class, idAsiento);
            if (asiento != null) {
                em.remove(asiento);
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
