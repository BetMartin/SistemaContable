
package Controllers;


import DAO.AsientoDAO;
import Modelo.Asiento;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.RequestDispatcher;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/AsientoControlador")
public class AsientoControlador extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Recibir datos del formulario
        String fechaStr = request.getParameter("fecha"); // Se recibe como String
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); // Define el formato de la fecha
        Date fecha = null;

        try {
            fecha = sdf.parse(fechaStr); // Convierte el String a Date
        } catch (ParseException e) {
            e.printStackTrace(); // Manejo de excepciones
        }

        // Crear un nuevo objeto Asiento
        Asiento asiento = new Asiento();
        asiento.setFecha(fecha);


        // Guardar el asiento usando el DAO
        AsientoDAO asientoDAO = new AsientoDAO();
        asientoDAO.saveAsiento(asiento);

        // Redirigir a la página de confirmación
        request.setAttribute("mensaje", "Asiento guardado exitosamente!");
        RequestDispatcher dispatcher = request.getRequestDispatcher("confirmacion.jsp");
        dispatcher.forward(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Manejar las solicitudes GET si es necesario
        doPost(request, response);
    }
}
