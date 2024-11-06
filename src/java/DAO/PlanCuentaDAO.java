package DAO;

import Modelo.PlanCuenta;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import java.util.List;
import javax.persistence.NoResultException;

public class PlanCuentaDAO {
    private EntityManagerFactory emf = Persistence.createEntityManagerFactory("ContabilidadPU");

    public void savePlanCuenta(PlanCuenta planCuenta) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(planCuenta);
            em.getTransaction().commit();
            
            PlanCuenta savedPlanCuenta = null;
            savedPlanCuenta = em.createQuery("SELECT p FROM PlanCuenta p ORDER BY p.id DESC", PlanCuenta.class)
                            .setMaxResults(1)
                            .getSingleResult();
            int nroCuentaGenerado=savedPlanCuenta.generateNroCuenta();
            savedPlanCuenta.setNroCuenta(nroCuentaGenerado);
           // savedPlanCuenta.setNroCuenta(savedPlanCuenta.generateNroCuenta());
            
            em.getTransaction().begin();
            em.merge(savedPlanCuenta); // Utiliza merge para actualizar
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
    
    public PlanCuenta getPlanCuentaById(int id) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.find(PlanCuenta.class, id);
        } finally {
            em.close();
        }
    }
    public List<PlanCuenta> getAllPlanCuentas() {
        EntityManager em = emf.createEntityManager();
        try {
            // Modificar la consulta para ordenar por nroCuenta de mayor a menor
            TypedQuery<PlanCuenta> query = em.createQuery(
                "SELECT p FROM PlanCuenta p ORDER BY p.nroCuenta ASC", PlanCuenta.class);

            // Ejecutar la consulta y devolver los resultados
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void updatePlanCuenta(PlanCuenta planCuenta) {
        EntityManager em = emf.createEntityManager();
        try {
            // Iniciar la transacción
            em.getTransaction().begin();
            
        // Verificar si la cuenta está en uso en la tabla Entrada
            if (isPlanCuentaUsedInEntrada(planCuenta.getNroCuenta())) {
                throw new IllegalStateException("No se puede modificar la cuenta, está en uso en la tabla Entrada.");
            }

            // Actualizar la PlanCuenta usando merge
            em.merge(planCuenta);

            // Confirmar la transacción
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

    public void deletePlanCuenta(int nroCuenta) {
        EntityManager em = emf.createEntityManager();
        try {
            // Iniciar la transacción
            em.getTransaction().begin();

            // Verificar si la cuenta está en uso en la tabla Entrada
            if (isPlanCuentaUsedInEntrada(nroCuenta)) {
                throw new IllegalStateException("No se puede eliminar la cuenta, está en uso en la tabla Entrada.");
            }

            // Buscar el PlanCuenta por nroCuenta
            PlanCuenta planCuenta = em.createQuery("SELECT p FROM PlanCuenta p WHERE p.nroCuenta = :nroCuenta", PlanCuenta.class)
                                      .setParameter("nroCuenta", nroCuenta)
                                      .getSingleResult();

            // Eliminar el PlanCuenta encontrado
            if (planCuenta != null) {
                em.remove(planCuenta);
            }

            // Confirmar la transacción
            em.getTransaction().commit();
        } catch (NoResultException e) {
            System.out.println("No se encontró la cuenta con nroCuenta: " + nroCuenta);
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            em.close();
        }
    }


    public List<PlanCuenta> searchPlanCuentas(String searchValue) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<PlanCuenta> query;
            try {
                int nroCuenta = Integer.parseInt(searchValue);
                query = em.createQuery("SELECT p FROM PlanCuenta p WHERE p.nroCuenta = :searchValue OR p.descripcion LIKE :searchDescription", PlanCuenta.class);
                query.setParameter("searchValue", nroCuenta);
                query.setParameter("searchDescription", "%" + searchValue + "%");
            } catch (NumberFormatException e) {
                query = em.createQuery("SELECT p FROM PlanCuenta p WHERE p.descripcion LIKE :searchDescription", PlanCuenta.class);
                query.setParameter("searchDescription", "%" + searchValue + "%");
            }
            return query.getResultList();
        } finally {
            em.close();
        }
    }
    public boolean isPlanCuentaUsedInEntrada(int nroCuenta) {
        EntityManager em = emf.createEntityManager();
        try {
            // Iniciar la transacción
            em.getTransaction().begin();

            // Crear la consulta para contar las entradas que utilizan el nroCuenta
            TypedQuery<Long> query = em.createQuery(
                "SELECT COUNT(e) FROM Entrada e WHERE e.planCuenta.nroCuenta = :nroCuenta", Long.class);
            query.setParameter("nroCuenta", nroCuenta);

            // Obtener el resultado de la consulta
            long count = query.getSingleResult();

            // Si el count es mayor que 0, significa que está en uso
            return count > 0; 
        } catch (Exception e) {
            // Loggear o manejar la excepción
            e.printStackTrace();
            return false; // Si ocurre algún error, retornamos false
        } finally {
            // Cerrar la entidad al final
            em.close();
        }
    }

}
