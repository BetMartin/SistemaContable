import mysql from 'mysql';

// Conexión a MySQL
export const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'contabilidad',
  port: 3306 
});

// Inicializa la conexión MySQL
mysqlConnection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});