package DAO;

import Modelo.Entrada;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import java.util.List;

public class EntradaDAO {
    
    public void saveEntrada(Entrada entrada) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.save(entrada);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }

    public Entrada getEntradaById(int nroEntrada) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.get(Entrada.class, nroEntrada);
        }
    }

    public List<Entrada> getAllEntradas() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<Entrada> query = session.createQuery("from Entrada", Entrada.class);
            return query.list();
        }
    }

    public void updateEntrada(Entrada entrada) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.update(entrada);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }

    public void deleteEntrada(int nroEntrada) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            Entrada entrada = session.get(Entrada.class, nroEntrada);
            if (entrada != null) {
                session.delete(entrada);
            }
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }
}