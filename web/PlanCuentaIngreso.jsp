<%@page import="Modelo.PlanCuenta"%>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan de Cuenta</title>
    <link rel="stylesheet" href="PlanCuentaIngreso.css">
    <script>
        function cerrarVentana() {
            window.close();
        }
        function prepararEnvioFormulario(actionType) {
            // Colocamos el tipo de acción (guardar o actualizar) en el campo oculto.
            document.getElementById('action').value = actionType;
            document.getElementById('planCuentaForm').submit();
        }
    </script>       
</head>
<body>
    <header>
        <div class="header-content">
            <h1>Plan de Cuenta</h1>
        </div>
    </header>
    <main>
        <form id="planCuentaForm" class="plan-de-cuenta-form" action="PlanCuentaControlador" method="POST">
            <!-- Campo oculto para determinar la acción (Guardar o Modificar) -->
            <input type="hidden" id="action" name="action" value="<%= request.getAttribute("action") != null ? request.getAttribute("action") : "save" %>">

            <!-- Descripción -->
            <div class="form-group">
                <label for="descripcion">Descripción:</label>
                <input type="text" id="descripcion" name="descripcion" value="<%= request.getAttribute("planCuenta") != null ? ((PlanCuenta)request.getAttribute("planCuenta")).getDescripcion() : "" %>" required>
            </div>

            <!-- Rubro -->
            <div class="form-group">
                <label>Rubro:</label>
                <div class="radio-group">
                    <label><input type="radio" name="rubro" value="PATRIMONIO NETO" <%= request.getAttribute("planCuenta") != null && ((PlanCuenta)request.getAttribute("planCuenta")).getRubro().equals("patrimonio-neto") ? "checked" : "" %>> Patrimonio Neto</label>
                    <label><input type="radio" name="rubro" value="ACTIVO" <%= request.getAttribute("planCuenta") != null && ((PlanCuenta)request.getAttribute("planCuenta")).getRubro().equals("activo") ? "checked" : "" %>> Activo</label>
                    <label><input type="radio" name="rubro" value="PASIVO" <%= request.getAttribute("planCuenta") != null && ((PlanCuenta)request.getAttribute("planCuenta")).getRubro().equals("pasivo") ? "checked" : "" %>> Pasivo</label>
                    <label><input type="radio" name="rubro" value="INGRESO" <%= request.getAttribute("planCuenta") != null && ((PlanCuenta)request.getAttribute("planCuenta")).getRubro().equals("ingreso") ? "checked" : "" %>> Ingreso</label>
                    <label><input type="radio" name="rubro" value="EGRESO" <%= request.getAttribute("planCuenta") != null && ((PlanCuenta)request.getAttribute("planCuenta")).getRubro().equals("egreso") ? "checked" : "" %>> Egreso</label>
                </div>
            </div>

            <!-- Botones -->
            <div class="buttons">
                <button type="button" class="submit" onclick="prepararEnvioFormulario('<%= request.getAttribute("planCuenta") != null ? "update" : "save" %>')" onsubmit="cerrarVentana()">
                    <img src="imagenes/alta.png" height="20px" alt="Guardar"> <%= request.getAttribute("planCuenta") != null ? "Modificar" : "Dar de Alta" %>
                </button>
                <button type="reset" class="cancel" onclick="cerrarVentana()">
                    <img src="imagenes/cancelar.png" height="20px" alt="Cancelar"> Cancelar
                </button>
            </div>
        </form>
    </main>
</body>
</html>
