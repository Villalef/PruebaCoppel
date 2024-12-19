const apiUrl = '/api/articulos'; // No hace falta localhost, ya que es servido desde el mismo servidor

let editingSku = null; // Variable para rastrear si estamos editando un artículo
let searchArticleData = null; // Variable para rastrear el artículo mostrado en la búsqueda

// Función para cargar artículos
const loadArticles = async () => {
  const response = await fetch(apiUrl);
  const articles = await response.json();
  renderTable(articles);
};

// Función para renderizar la tabla principal
const renderTable = (articles) => {
  const table = document.getElementById('articleTable');
  table.innerHTML = articles.map(article => `
    <tr>
      <td>${article.sku}</td>
      <td>${article.nombre}</td>
      <td>${article.marca}</td>
      <td>${article.cantidad}</td>
      <td>
        <button onclick="deleteArticle('${article.sku}', false)">Eliminar</button>
        <button onclick="editArticle('${article.sku}', false)">Editar</button>
      </td>
    </tr>
  `).join('');
};

// Función para renderizar la tabla de búsqueda
const renderSearchTable = (article) => {
  const searchTable = document.getElementById('searchTable');
  if (article) {
    searchTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${article.sku}</td>
            <td>${article.nombre}</td>
            <td>${article.marca}</td>
            <td>${article.cantidad}</td>
            <td>
              <button onclick="deleteArticle('${article.sku}', true)">Eliminar</button>
              <button onclick="editArticle('${article.sku}', true)">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  } else {
    searchTable.innerHTML = '<p>No se encontró ningún artículo o el SKU está vacío.</p>';
  }
};

// Enviar formulario para crear o actualizar un artículo
document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const sku = document.getElementById('sku').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();

    const method = editingSku ? 'PUT' : 'POST';
    const url = editingSku ? `${apiUrl}/${editingSku}` : apiUrl;

    const bodyData = editingSku
        ? { nombre, marca, cantidad, nuevoSku: sku } // Incluye el nuevo SKU si es actualización
        : { sku, nombre, marca, cantidad }; // Incluye SKU solo para creación

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error === 'El nuevo SKU ya existe' || errorData.error === 'El SKU ya existe') {
                alert('Error: El SKU ya existe. Intenta con otro.');
                return;
            } else {
                throw new Error('Error al guardar el artículo');
            }
        }

        // Restablecer el estado de edición y limpiar el formulario
        editingSku = null;
        document.getElementById('articleForm').reset();

        // Recargar tablas
        await loadArticles();

        // Si hay un artículo en la tabla de búsqueda, recargarlo
        if (searchArticleData) {
            const response = await fetch(`${apiUrl}/${sku}`);
            const updatedArticle = await response.json();
            searchArticleData = updatedArticle; // Actualizamos el artículo en los datos de búsqueda
            renderSearchTable(searchArticleData); // Actualizamos la tabla de búsqueda
        }
    } catch (error) {
        console.error('Error al guardar el artículo:', error);
        alert('Ocurrió un error al guardar el artículo.');
    }
});



// Eliminar un artículo
const deleteArticle = async (sku, fromSearch) => {
  await fetch(`${apiUrl}/${sku}`, { method: 'DELETE' });
  loadArticles();

  // Si se eliminó desde la tabla de búsqueda, también actualiza esa tabla
  if (fromSearch && searchArticleData && searchArticleData.sku === sku) {
    searchArticleData = null;
    renderSearchTable(null); // Limpia la tabla de búsqueda
  }
};

// Editar un artículo
const editArticle = async (sku, fromSearch) => {
  const response = await fetch(`${apiUrl}/${sku}`);
  const article = await response.json();

  document.getElementById('sku').value = article.sku;
  document.getElementById('nombre').value = article.nombre;
  document.getElementById('marca').value = article.marca;
  document.getElementById('cantidad').value = article.cantidad;

  editingSku = article.sku;

  // Marca el artículo en la búsqueda si proviene de ahí
  if (fromSearch) {
    searchArticleData = article;
  }
};

// Buscar artículo por SKU
const searchArticle = async () => {
  const sku = document.getElementById('searchSku').value.trim();

  if (!sku) {
    searchArticleData = null;
    renderSearchTable(null);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${sku}`);
    const article = await response.json();

    if (Object.keys(article).length > 0) {
      searchArticleData = article;
      renderSearchTable(article);
    } else {
      searchArticleData = null;
      renderSearchTable(null);
    }
  } catch (error) {
    console.error('Error al buscar el artículo:', error);
    searchArticleData = null;
    renderSearchTable(null);
  }
};

// Cargar artículos al iniciar
loadArticles();