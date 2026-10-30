const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Aplicacion desplegada con Dokploy',
    institucion: 'Universidad del Quindio',
    curso: 'Administracion de Infraestructura de TI',
    plataforma: 'Dokploy PaaS',
    version: '1.0.0',
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
