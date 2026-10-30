//Monitoreo MultiService

const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Actualizacion automatica con Dokploy',
    institucion: 'Universidad del Quindio',
    curso: 'Administracion de Infraestructura de TI',
    plataforma: 'Dokploy PaaS',
    version: '2.0.0',
    fecha: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    estado: 'saludable',
    uptime: process.uptime(),
    version: process.version
  });
});

app.get('/info', (req, res) => {
  res.json({
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: {
      total: Math.round(os.totalmem() / 1048576) + ' MB',
      free: Math.round(os.freemem() / 1048576) + ' MB'
    }
  });
});

const mysql = require('mysql2/promise');

app.get('/db-check', async (req, res) => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    const [rows] = await connection.query(
      'SELECT DATABASE() AS database_name'
    );

    res.json({
      estado: 'conectado',
      motor: 'MySQL',
      base_datos: rows[0].database_name
    });
  } catch (error) {
    console.error('Error de conexion MySQL:', error.message);
    res.status(503).json({
      estado: 'error de conexion'
    });
  } finally {
    if (connection) await connection.end();
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
