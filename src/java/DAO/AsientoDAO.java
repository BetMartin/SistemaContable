package DAO;

import Modelo.Asiento;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import java.util.List;

public class AsientoDAO {
    
    public void saveAsiento(Asiento asiento) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.save(asiento);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }

    public Asiento getAsientoById(int idAsiento) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.get(Asiento.class, idAsiento);
        }
    }

    public List<Asiento> getAllAsientos() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<Asiento> query = session.createQuery("from Asiento", Asiento.class);
            return query.list();
        }
    }

    public void updateAsiento(Asiento asiento) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.update(asiento);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }

    public void deleteAsiento(int idAsiento) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            Asiento asiento = session.get(Asiento.class, idAsiento);
            if (asiento != null) {
                session.delete(asiento);
            }
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }
}