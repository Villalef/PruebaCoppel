const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path'); // Para manejar rutas de archivos

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'articulos_db'
});

// Ruta para obtener todos los artículos
app.get('/api/articulos', (req, res) => {
  db.query('SELECT * FROM articulos', (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

// Ruta para crear un artículo
app.post('/api/articulos', (req, res) => {
  const { sku, nombre, marca, cantidad } = req.body;

  // Verificar si el SKU ya existe
  db.query('SELECT * FROM articulos WHERE sku = ?', [sku], (err, results) => {
    if (err) return res.status(500).send(err.message);

    if (results.length > 0) {
      return res.status(400).json({ error: 'El SKU ya existe' });
    }

    // Insertar el artículo si el SKU no existe
    const sql = `INSERT INTO articulos (sku, nombre, marca, cantidad) VALUES (?, ?, ?, ?)`;
    db.query(sql, [sku, nombre, marca, cantidad], (err, result) => {
      if (err) return res.status(500).send(err.message);
      res.status(201).send('Artículo creado');
    });
  });
});

// Ruta para obtener un artículo por SKU
app.get('/api/articulos/:sku', (req, res) => {
  const { sku } = req.params;
  db.query('SELECT * FROM articulos WHERE sku = ?', [sku], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results[0] || {});
  });
});

// Ruta para actualizar un artículo
app.put('/api/articulos/:sku', (req, res) => {
  const { sku } = req.params; // SKU actual
  const { nombre, marca, cantidad, nuevoSku } = req.body; // Datos del formulario

  // Verificar si el nuevo SKU ya existe (si es diferente al actual)
  if (nuevoSku && nuevoSku !== sku) {
    db.query('SELECT * FROM articulos WHERE sku = ?', [nuevoSku], (err, results) => {
      if (err) return res.status(500).send(err.message);

      if (results.length > 0) {
        return res.status(400).json({ error: 'El nuevo SKU ya existe' });
      }

      // Actualizar el SKU y otros datos
      actualizarArticulo(sku, nombre, marca, cantidad, nuevoSku, res);
    });
  } else {
    // Solo actualizar los demás datos (sin cambiar el SKU)
    actualizarArticulo(sku, nombre, marca, cantidad, sku, res);
  }
});

// Función auxiliar para actualizar un artículo
function actualizarArticulo(skuActual, nombre, marca, cantidad, nuevoSku, res) {
  const sql = `
    UPDATE articulos 
    SET sku = ?, nombre = ?, marca = ?, cantidad = ? 
    WHERE sku = ?
  `;
  db.query(sql, [nuevoSku, nombre, marca, cantidad, skuActual], (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.send('Artículo actualizado');
  });
}

// Ruta para eliminar un artículo
app.delete('/api/articulos/:sku', (req, res) => {
  const { sku } = req.params;
  db.query('DELETE FROM articulos WHERE sku = ?', [sku], (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.send('Artículo eliminado');
  });
});

// Iniciar servidor en el puerto 8080
app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});

