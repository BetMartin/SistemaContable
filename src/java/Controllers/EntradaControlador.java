package Controllers;

import DAO.EntradaDAO;
import Modelo.Entrada;
import Modelo.PlanCuenta;
import Modelo.Asiento;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/EntradaControlador")
public class EntradaControlador extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Recibir datos del formulario
        int nroEntrada = Integer.parseInt(request.getParameter("nroEntrada"));
        double monto = Double.parseDouble(request.getParameter("monto"));
        int tipoRegistro = Integer.parseInt(request.getParameter("tipoRegistro"));
        String descripcion = request.getParameter("descripcion");

        // Asumimos que PlanCuenta y Asiento ya están creados y sus IDs son recibidos desde el formulario
        int planCuentaId = Integer.parseInt(request.getParameter("planCuentaId"));
        int asientoId = Integer.parseInt(request.getParameter("asientoId"));

        // Crear un nuevo objeto Entrada
        Entrada entrada = new Entrada();
        entrada.setNroEntrada(nroEntrada);
        entrada.setMonto(monto);
        entrada.setTipoRegistro(tipoRegistro);
        entrada.setDescripcion(descripcion);
        
        // Aquí necesitas obtener las entidades PlanCuenta y Asiento correspondientes
        PlanCuenta planCuenta = new PlanCuenta();
        long id_Plancuenta = (long) planCuentaId;
        planCuenta.setId(id_Plancuenta);
        Asiento asiento = new Asiento();
        asiento.setIdAsiento(asientoId);

        entrada.setPlanCuenta(planCuenta);
        entrada.setAsiento(asiento);

        // Guardar la entrada usando el DAO
        EntradaDAO entradaDAO = new EntradaDAO();
        entradaDAO.saveEntrada(entrada);

        // Redirigir a la página de confirmación
        request.setAttribute("mensaje", "Entrada guardada exitosamente!");
        RequestDispatcher dispatcher = request.getRequestDispatcher("confirmacion.jsp");
        dispatcher.forward(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Obtener todas las entradas y pasarlas a la vista
        EntradaDAO entradaDAO = new EntradaDAO();
        List<Entrada> entradas = entradaDAO.getAllEntradas();
        request.setAttribute("entradas", entradas);
        RequestDispatcher dispatcher = request.getRequestDispatcher("listaEntradas.jsp");
        dispatcher.forward(request, response);
    }
}
