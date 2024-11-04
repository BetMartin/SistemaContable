CREATE DATABASE `persona` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `persona` ;
create table persona (
    id bigint not null auto_increment,
    dni int not null UNIQUE,
    nombre varchar(45) not null,
    domicilio varchar(45) not null,
    primary key (id)
)
