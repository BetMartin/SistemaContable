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
            
            if (action === 'edit' && nroCuenta) {
                url += '?nroCuenta=' + nroCuenta + '&action=edit';
            }

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

    <main>
        <section class="plan-de-cuenta">
            <h2>Plan de Cuenta</h2>
            <form action="PlanCuentaControlador" method="GET">
                <div class="search-bar">
                    <input type="text" placeholder="Consultar...">
                    <button type="submit" name="action" value="search" class="search-btn">
                        <img src="imagenes/buscar.png" height="20px" alt="logoBuscar">
                    </button>
                     <button type="submit" name="action" value="list" class="search-btn">
                        <img src="imagenes/recargar.png" height="20px" alt="logoBuscar">
                    </button>
                </div>
            </form>
            <table id="planCuentasTable">
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
                    <tr>
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

            <div class="buttons">
                <button class="alta" onclick="abrirVentanaEmergente('new')">
                    <img src="imagenes/alta.png" height="20px" alt="Alta"> Alta
                </button>
                <button class="baja" onclick="eliminarFilaSeleccionada()">
                    <img src="imagenes/baja.png" height="20px" alt="baja"> Baja
                </button>
                <button class="modificar" onclick="abrirVentanaEmergente('edit')">
                    <img src="imagenes/modificar.png" height="20px" alt="modificar"> Modificar
                </button>
            </div>
        </section>
    </main>
    <footer>
        &copy; 2024 Betsabé Martin
    </footer>
</body>
</html>
