package DAO;

import Modelo.PlanCuenta;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;
import java.util.List;

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
            
//            String prefix;
//            switch (savedPlanCuenta.getRubro().toUpperCase()) {
//                case "ACTIVO":
//                    prefix = "1";
//                    break;
//                case "PASIVO":
//                    prefix = "2";
//                    break;
//                case "PATRIMONIO_NETO":
//                    prefix = "3";
//                    break;
//                case "INGRESO":
//                    prefix = "4";
//                    break;
//                case "EGRESO":
//                    prefix = "5";
//                    break;
//                default:
//                    throw new IllegalArgumentException("Rubro inválido");
//             };
//            long idGenerado = savedPlanCuenta.getId();
            //int nroCuentaGenerado= Integer.parseInt(prefix + String.format("%03d", idGenerado));
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
            TypedQuery<PlanCuenta> query = em.createQuery("SELECT p FROM PlanCuenta p", PlanCuenta.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void updatePlanCuenta(PlanCuenta planCuenta) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(planCuenta);
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
            em.getTransaction().begin();
            PlanCuenta planCuenta = em.find(PlanCuenta.class, nroCuenta);
            if (planCuenta != null) {
                em.remove(planCuenta);
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
}
