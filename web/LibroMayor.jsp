<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Libro Mayor</title>
    <link rel="stylesheet" href="LibroMayor.css">
</head>
<body>
    <header>
        <div class="header-content">
            <a href="index.jsp">
                <img src="imagenes/logoSistemaContable.png" alt="Logo3">
            </a>
        </div>
    </header>
    <div class="container">
        <h2>Libro Mayor</h2>
        <!-- Formulario de búsqueda -->
        <form action="procesarBusqueda.jsp" method="get" class="search-form">
            <div class="input-group">
                <label for="cuenta">Nro. Cuenta:</label>
                <input type="text" id="cuenta" name="cuenta">
            </div>
            <div class="input-group">
                <label for="mes">Periodo:</label>
                <input type="month" id="mes" name="mes">
            </div>
            <button type="submit" class="search-btn">
                <img src="imagenes/buscar.png" height="20px" alt="Buscar">
            </button>
        </form>
        <!-- Tabla de información -->
        <table>
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>DEBE</th>
                    <th>HABER</th>
                </tr>
            </thead>
            <tbody>
                <!-- Fila de ejemplo, datos dinámicos se cargan desde el servidor -->
                <tr>
                    <td>Compra de activos</td>
                    <td>3000</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Venta de productos</td>
                    <td></td>
                    <td>1500</td>
                </tr>
            </tbody>
        </table>
        <!-- Sección de saldo -->
        <div class="saldo-section">
            <label for="saldo">SALDO</label>
            <span id="saldo">0</span>
        </div>
    </div>
    <footer>
        &copy; 2024 Betsabé Martin
    </footer>
</body>
</html>
