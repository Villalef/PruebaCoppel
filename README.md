# Prueba Técnica
**Proyecto CRUD de Artículos**
___
Este proyecto implementa un sistema CRUD básico para gestionar artículos. Incluye funcionalidades para crear, leer, actualizar y eliminar artículos, utilizando un backend desarrollado en Node.js con Express, una base de datos MySQL administrada mediante phpMyAdmin, y un frontend sencillo con HTML, CSS y JavaScript.
___

**Características**

**Backend:**

   * API REST con endpoints para las operaciones CRUD.
   * Validación para evitar SKUs duplicados.
   * Servidor desarrollado con Node.js y Express.



**Base de Datos:**

   * Una tabla llamada articulos que almacena los datos de los artículos.

**Frontend:**

   * Formulario para crear o actualizar artículos.

   * Tabla para listar todos los artículos con opciones para editar o eliminar.

   * Campo de búsqueda por SKU con resultados en tiempo real.

**Estilo:**

   * Diseño funcional utilizando CSS básico.

___

**Requisitos Previos**

 1 -  Tener instalados:

   * Node.js (v14 o superior)

 2 - Un servidor MySQL accesible mediante phpMyAdmin.

   * Acceso a phpMyAdmin para administrar la base de datos.

___

**Configuración del Proyecto**

1. Descarga el Proyecto en .zip

2. Configurar la Base de Datos

* Accede a phpMyAdmin y crea una base de datos llamada articulos_db.

**Ejecuta el siguiente script SQL en phpMyAdmin para crear la tabla articulos:**

	CREATE DATABASE IF NOT EXISTS articulos_db;
	USE articulos_db;
	
	CREATE TABLE articulos (
	  id INT AUTO_INCREMENT PRIMARY KEY,
	  sku VARCHAR(6) UNIQUE NOT NULL,
	  nombre VARCHAR(50) NOT NULL,
	  marca VARCHAR(30) NOT NULL,
	  cantidad INT NOT NULL,
	  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

3.  Configurar el Backend

**Instala las dependencias:**

	npm install express mysql cors


**Configure directamente en el archivo server.js los datos de conexión a la base de datos. Es necesiario asegurarse de que incluya la siguiente información:**

	const db = mysql.createConnection({
	  host: 'localhost',
	  user: 'tu_usuario',
	  password: 'tu_contraseña',
	  database: 'articulos_db'
	});

**Inicia el servidor**
	
 	node server.js

  * El servidor estará disponible en http://localhost:3000/

**Entra a la aplicación desde tu navegador**

	http://localhost:3000/index.html

 
___
**Estructura del Proyecto**

	├── public/
	│   ├── index.html       # Interfaz principal
	│   ├── styles.css       # Estilos de la aplicación
	│   ├── script.js        # Lógica del frontend
	├── server.js        # Backend con Node.js y Express
	├── package.json     # Dependencias y configuración del proyecto
	└── README.md        # Documentación del proyecto

 ___

 **Endpoints del Backend**

* Crear Artículo: POST /api/articulos

* Consultar Todos los Artículos: GET /api/articulos

* Consultar Artículo por SKU: GET /api/articulos/:sku

* Actualizar Artículo: PUT /api/articulos/:sku

* Eliminar Artículo: DELETE /api/articulos/:sku
___

**Uso de la Aplicación**

1. Crear/Actualizar Artículos:

	* Completa el formulario y haz clic en el botón "Guardar".

2. Consultar Todos los Artículos:

	* Visualiza todos los artículos en la tabla principal.

3. Buscar por SKU:

	* Introduce un SKU en el campo de búsqueda y haz clic en "Buscar".

4. Editar/Eliminar:

	* Usa los botones correspondientes en la tabla para editar o eliminar artículos.
___
**Tecnologías Usadas**

* Frontend: HTML5, CSS3, JavaScript.

* Backend: Node.js, Express.

* Base de Datos: MySQL administrado mediante phpMyAdmin.
___
**Autor**

* Desarrollado por: Alberto Villarreal
* Contacto: villalbert83@gmail.com
___
