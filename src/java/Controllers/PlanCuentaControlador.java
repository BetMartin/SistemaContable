package Controllers;

import DAO.PlanCuentaDAO;
import Modelo.PlanCuenta;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;


@WebServlet("/PlanCuentaControlador")
public class PlanCuentaControlador extends HttpServlet {
    private PlanCuentaDAO planCuentaDAO;

    @Override
    public void init() throws ServletException {
        planCuentaDAO = new PlanCuentaDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if (action == null) {
            action = "";
        }

        switch (action) {
            case "new":
                showNewForm(request, response);
                break;
            case "edit":
                showEditForm(request, response);
                break;
            case "delete":
                deletePlanCuenta(request, response);
                break;
            case "search":
                searchPlanCuenta(request, response);
                break;
            default:
                listPlanCuentas(request, response);
                break;
        }
    }

    private void listPlanCuentas(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<PlanCuenta> planCuentas = planCuentaDAO.getAllPlanCuentas();
        request.setAttribute("planCuentas", planCuentas);
        request.getRequestDispatcher("/PlanCuentaPpal.jsp").forward(request, response);
    }

    private void showNewForm(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("/PlanCuentaIngreso.jsp").forward(request, response);
    }

    private void showEditForm(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int nroCuenta = Integer.parseInt(request.getParameter("nroCuenta"));
        PlanCuenta existingPlanCuenta = planCuentaDAO.getPlanCuentaById(nroCuenta);
        request.setAttribute("planCuenta", existingPlanCuenta);
        request.getRequestDispatcher("/PlanCuentaIngreso.jsp").forward(request, response);
    }

    private void deletePlanCuenta(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int nroCuenta = Integer.parseInt(request.getParameter("nroCuenta"));
        planCuentaDAO.deletePlanCuenta(nroCuenta);
        response.sendRedirect("PlanCuentaControlador");
    }

    private void searchPlanCuenta(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String searchValue = request.getParameter("search");
        List<PlanCuenta> filteredCuentas = planCuentaDAO.searchPlanCuentas(searchValue);
        request.setAttribute("planCuentas", filteredCuentas);
        request.getRequestDispatcher("/PlanCuentaPpal.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if (action == null) {
            action = "";
        }

        switch (action) {
            case "save":
                savePlanCuenta(request, response);
                break;
            case "update":
                updatePlanCuenta(request, response);
                break;
            default:
                listPlanCuentas(request, response);
                break;
        }
    }

    private void savePlanCuenta(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String rubro= request.getParameter("rubro");
        String descripcion = request.getParameter("descripcion");
        PlanCuenta newPlanCuenta = new PlanCuenta(rubro, descripcion);
        planCuentaDAO.savePlanCuenta(newPlanCuenta);
        response.sendRedirect("PlanCuentaControlador");
    }

    private void updatePlanCuenta(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int nroCuenta = Integer.parseInt(request.getParameter("nroCuenta"));
        String rubro = request.getParameter("rubro");
        String descripcion = request.getParameter("descripcion");
        PlanCuenta updatedPlanCuenta = new PlanCuenta(nroCuenta, rubro, descripcion);
        planCuentaDAO.updatePlanCuenta(updatedPlanCuenta);
        response.sendRedirect("PlanCuentaControlador");
    }
}
