-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS contabilidad;
USE contabilidad;

-- Crear tabla rubro
CREATE TABLE rubro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denominacion VARCHAR(20) NOT NULL
);

-- Crear tabla subRubro
CREATE TABLE subRubro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denominacion VARCHAR(20) NOT NULL,
    nroSubRubro INT,
    idRubro INT NOT NULL,
    FOREIGN KEY (idRubro) REFERENCES rubro(id)
);

-- Crear tabla planCuenta
CREATE TABLE planCuenta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nroCuenta VARCHAR(20) NOT NULL,
    denominacion VARCHAR(20) NOT NULL,
    idSubrubro INT NOT NULL,
    FOREIGN KEY (idSubrubro) REFERENCES subRubro(id)
);

-- Crear tabla asiento
CREATE TABLE asiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL
);

-- Crear tabla tipoEntrada
CREATE TABLE tipoEntrada (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denominacion VARCHAR(20) NOT NULL
);

-- Crear tabla entrada
CREATE TABLE entrada (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idAsiento INT NOT NULL,
    descripcion VARCHAR(20) NOT NULL,
    idCuenta INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    idTipoEntrada INT NOT NULL,
    FOREIGN KEY (idAsiento) REFERENCES asiento(id),
    FOREIGN KEY (idCuenta) REFERENCES planCuenta(id),
    FOREIGN KEY (idTipoEntrada) REFERENCES tipoEntrada(id)
);

INSERT INTO `rubro` VALUES (1,'ACTIVO'),(2,'PASIVO'),(3,'PATRIMONIO NETO'),(4,'INGRESO'),(5,'EGRESO');
INSERT INTO `subrubro` VALUES (1,'CAJA Y BANCO',1),(2,'INVERSIONES',1),(3,'CREDITOS POR VENTA',1),(4,'OTROS CREDITOS',1),(5,'BIENES DE CAMBIO',1),(6,'BIENES DE USO',1),(7,'ACTIVOS INTANGIBLES',1),(8,'OTROS ACTIVOS',1),(9,'DEUDAS COMERCIALES',2),(10,'PRESTAMOS',2),(11,'REMUNERACIONES Y CAR',2),(12,'CARGAS FISCALES',2),(13,'COBROS ANTICIPADOS',2),(14,'OTROS PASIVOS',2),(15,'PREVISIONES',2),(16,'APORTE DE LOS PROPIE',3),(17,'GANANCIAS RESERVADAS',3),(18,'RESULTADOS NO ASIGNA',3),(19,'VENTA D BIENES Y SER',4),(20,'GANANCIAS FINANCIERA',4),(21,'OTROS RESULTADOS POS',4),(22,'GANANCIAS EXTRAORDIN',4),(23,'COSTO DE VENTA',5),(24,'GASTOS ADMINISTRATIV',5),(25,'GASTOS DE COMERCIALI',5),(26,'PERDIDAS FINANCIERAS',5),(27,'OTROS RESULTADOS NEG',5),(28,'PERDIDAS EXTRAORDINA',5);
INSERT INTO `contabilidad`.`tipoentrada` (`id`, `denominacion`) VALUES ('1', 'sube'), ('2', 'baja');
