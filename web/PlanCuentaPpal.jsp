<%@page import="Modelo.PlanCuenta"%>
<%@page import="java.util.List"%>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan de Cuentas</title>
    <link rel="stylesheet" href="PlanCuentaPpal.css">
    <script>
        let selectedRow;

        function seleccionarFila(row) {
            if (selectedRow) {
                selectedRow.classList.remove('selected');
            }
            selectedRow = row;
            row.classList.add('selected');
        }

        function abrirVentanaEmergente(action) {
            let nroCuenta = selectedRow ? selectedRow.cells[0].innerText : null;
            let url = 'PlanCuentaIngreso.jsp';
            var ancho = 400; // Ancho de la ventana emergente
            var alto = 500; // Alto de la ventana emergente
            var izquierda = (screen.width - ancho) / 2;
            var arriba = (screen.height - alto) / 2;

            window.open(url, 'popup', "width=" + ancho + ",height=" + alto + ",top=" + arriba + ",left=" + izquierda);
        }
        function eliminarFilaSeleccionada() {
            if (selectedRow) {
                const nroCuenta = selectedRow.cells[0].innerText;
                if (confirm("¿Estás seguro de eliminar la cuenta nro " + nroCuenta + "?")) {
                    window.location.href = 'PlanCuentaControlador?action=delete&nroCuenta=' + nroCuenta;
                }
            } else {
                alert("Por favor, selecciona una fila.");
            }
        }
    </script>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="index.jsp">
                <img src="imagenes/logoSistemaContable.png" alt="Logo">
            </a>
        </div>
    </header>
    <%-- Mostrar el mensaje de error si existe --%>
    <%
        if (request.getAttribute("errorMessage") != null) {
    %>
        <div class="error-message">
            <%= request.getAttribute("errorMessage") %>
        </div>
    <%
        }
    %>
    <h2>Plan de Cuenta</h2>
    <form action="PlanCuentaControlador" method="GET">
        <div class="search-bar">
            <input type="text" name="search" placeholder="Consultar...">
            <button type="submit" name="action" value="search" class="search-btn">
                <img src="imagenes/buscar.png" height="20px" alt="logoBuscar">
            </button>
             <button type="submit" name="action" value="list" class="search-btn">
                <img src="imagenes/recargar.png" height="20px" alt="logoBuscar">
            </button>
        </div>
    </form>

    <table style="padding: 10px;">
        <thead>
            <tr>
                <th>Nro</th>
                <th>Rubro</th>
                <th>Descripción</th>
            </tr>
        </thead>
        <tbody>
            <%
                List<PlanCuenta> planCuentas = (List<PlanCuenta>) request.getAttribute("planCuentas");
                if (planCuentas != null && !planCuentas.isEmpty()) {
                    for (PlanCuenta planCuenta : planCuentas) {
            %>
            <tr onclick="seleccionarFila(this)">
                <td><%= planCuenta.getNroCuenta() %></td>
                <td><%= planCuenta.getRubro() %></td>
                <td><%= planCuenta.getDescripcion() %></td>
            </tr>
            <%
                    }
                } else {
            %>
            <tr>
                <td colspan="3">No hay datos disponibles</td>
            </tr>
            <%
                }
            %>
        </tbody>
    </table>
    <form action="PlanCuentaControlador" method="GET">
        <div class="buttons" style="width:50%; margin-left:25% ">
            <button class="alta" onclick="abrirVentanaEmergente('save')">
                <img src="imagenes/alta.png" height="20px" alt="Alta"> Alta
            </button>
            <button class="baja" onclick="eliminarFilaSeleccionada()">
                <img src="imagenes/baja.png" height="20px" alt="baja"> Baja
            </button>
        </div>
    </form>
            <br><br><br><br><br>
    <footer>
        &copy; 2024 Betsabé Martin/Laura Pelayes
    </footer>
</body>
</html>
