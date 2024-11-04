<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asiento</title>
    <link rel="stylesheet" href="LibroDiarioAsiento.css">
     <script>
        function mostrarLibroDiarioEntrada() {
            // Mostrar el div oculto
            var libroDiarioEntradaDiv = document.getElementById("LibroDiarioEntrada");
            libroDiarioEntradaDiv.style.display = "block";
        }
    </script>
    <script>
        function alternarImagen(valor) {
            document.getElementById('sube').checked = (valor === 'sube');
            document.getElementById('baja').checked = (valor === 'baja');
            document.getElementById('imgSube').style.display = (valor === 'sube') ? 'block' : 'none';
            document.getElementById('imgBaja').style.display = (valor === 'baja') ? 'block' : 'none';
        }
    </script>
    <script>
        function cerrarVentana() {
            window.close();
        }
    </script>
        
     <script>
        function ocultarLibroDiarioEntrada() {
            // Mostrar el div oculto
            var libroDiarioEntradaDiv = document.getElementById("LibroDiarioEntrada");
            libroDiarioEntradaDiv.style.display = "none";
        }
    </script>
</head>
<body>
    <header>
        <div class="header-content">
            <h1>Asiento</h1>
        </div>
    </header>
    <div class="container">
        <main class="main-section">
            <form class="asiento-form">
                <div class="form-group">
                    <label for="fecha">Fecha:</label>
                    <input type="date" id="fecha" name="fecha">
                </div>
                <!-- Table -->
               <table>
                   <thead>
                       <tr>
                           <th>Cuenta</th>
                           <th>Descripción</th>
                           <th>Debe</th>
                           <th>Haber</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                       <!-- Sample Row for Now -->
                           <td>1001</td>
                           <td>Compra de materiales</td>
                           <td>500</td>
                           <td></td>
                       </tr>
                       <!-- Dynamic rows populated from server will go here -->
                   </tbody>
                   <tfoot>
                       <tr>
                           <td colspan="4" style="text-align: right;">
                               <button type="button" onclick="mostrarLibroDiarioEntrada()">
                                   <img src="imagenes/add.png" height="10px" alt="Alta">
                               </button>
                               <button type="button">
                                   <img src="imagenes/baja.png" height="10px" alt="eliminar">
                               </button>
                               <button type="button">
                                   <img src="imagenes/modificar.png" height="10px" alt="eliminar">
                               </button><br>
   
                               <div id="LibroDiarioEntrada" style="display: none;">
                                  <div class="form-group">
                                      <label for="nro-cuenta">Nro. Cuenta:</label>
                                      <input type="text" id="nro-cuenta" name="nro-cuenta">
                                  </div>
                                  <div class="form-group">
                                      <label for="descripcion">Descripción:</label>
                                      <input type="text" id="descripcion" name="descripcion">
                                  </div>
                                  <div class="form-group">
                                      <label for="monto">Monto:</label>
                                      <input type="text" id="monto" name="monto">

                                      <div class="toggle-container">
                                          <input type="radio" id="sube" name="toggle" value="sube" checked>
                                          <input type="radio" id="baja" name="toggle" value="baja">
                                          <img id="imgSube" src="imagenes/sube.png" height="35px" alt="Sube" onclick="alternarImagen('baja')" style="display: block;">
                                          <img id="imgBaja" src="imagenes/disminuye.png" height="35px" alt="Baja" onclick="alternarImagen('sube')" style="display: none;">
                                      </div>
                                   </div>
                                      <div class="buttons">
                                          <button type="submit" class="submit" style="background-color:#336b89">Agregar
                                              <img src="imagenes/add.png" height="10px" alt="Alta">
                                          </button>
                                          <button type="reset" class="cancel" style="background-color:#336b89" onclick="ocultarLibroDiarioEntrada()">Cancelar
                                              <img src="imagenes/cancelar.png" height="20px" alt="Cancelar">
                                          </button>
                                      </div>
                              </div>
                           </td>
                       </tr>
                   </tfoot>
               </table>
                <div class="buttons">
                    <button type="submit" class="submit">
                        <img src="imagenes/alta.png" height="20px" alt="Alta"> Dar de Alta
                    </button><br>
                    <button type="reset" class="cancel" onclick="cerrarVentana()">
                        <img src="imagenes/cancelar.png" height="20px" alt="Cancelar" > Cancelar
                    </button>
                </div>

            </form>
        </main>
    </div>
    
</body>
</html>
