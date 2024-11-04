<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Libro Diario</title>
    <link rel="stylesheet" href="LibroDiarioPpal.css">
        <script>
        function abrirVentanaEmergente() {
            var ancho = 1200; // Ancho de la ventana emergente
            var alto = 400; // Alto de la ventana emergente
            var izquierda = (screen.width - ancho) / 2;
            var arriba = (screen.height - alto) / 2;
            window.open("LibroDiarioAsiento.jsp", "popup", "width=" + ancho + ",height=" + alto + ",top=" + arriba + ",left=" + izquierda);
        }
    </script>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="index.jsp">
                <img src="imagenes/logoSistemaContable.png" alt="Logo2">
            </a>
        </div>
    </header>
    <div class="container">
        <h2>Libro Diario</h2>
        <div class="search-bar"">
            <input type="date" id="fecha" name="fecha">
                <button class="search-btn">
                    <img src="imagenes/buscar.png" height="20px" alt="logoBuscar">
                    <i class="fa fa-search"></i>
                </button>
            <button type="submit" class="search-btn">
                <img src="imagenes/recargar.png" alt="Buscar">
            </button>
        </div>

        <!-- Table -->
        <table>
            <thead>
                <tr>
                    <th>Nro</th>
                    <th>Fecha</th>
                    <th>Cuenta</th>
                    <th>Descripción</th>
                    <th>Debe</th>
                    <th>Haber</th>
                </tr>
            </thead>
            <tbody>
                <!-- Sample Row for Now -->
                <tr>
                    <td>1</td>
                    <td>2024-10-21</td>
                    <td>1001</td>
                    <td>Compra de materiales</td>
                    <td>500</td>
                    <td></td>
                </tr>
                <!-- Dynamic rows populated from server will go here -->
            </tbody>
        </table>

        <!-- Buttons for "Alta" and "Consultar" -->
        <div class="actions">

            <button class="alta" onclick="abrirVentanaEmergente()">
                <img src="imagenes/alta.png" height="20px" alt="Alta"> Registrar Movimiento
            </button>
        </div>
    </div>
    <footer>
        &copy; 2024 Betsabé Martin
    </footer>
</body>
</html>