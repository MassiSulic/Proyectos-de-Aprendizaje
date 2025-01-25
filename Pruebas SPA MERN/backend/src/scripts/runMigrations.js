const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const runMigrations = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true, // Permite múltiples consultas en una sola llamada
  });

  const migrationsDir = path.join(__dirname, '../migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).sort(); // Ordena los archivos por nombre

  for (const file of migrationFiles) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      await connection.query(sql);
      console.log(`Migración ejecutada: ${file}`);
    } catch (error) {
      console.error(`Error al ejecutar la migración ${file}:`, error);
      throw error; // Detiene la ejecución si hay un error
    }
  }

  await connection.end();
};

runMigrations().catch(console.error);