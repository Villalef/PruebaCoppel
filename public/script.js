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
    const sku = document.getElementById('sku').value;
    const nombre = document.getElementById('nombre').value;
    const marca = document.getElementById('marca').value;
    const cantidad = document.getElementById('cantidad').value;
  
    const method = editingSku ? 'PUT' : 'POST';
    const url = editingSku ? `${apiUrl}/${editingSku}` : apiUrl;
  
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: editingSku,
          nombre,
          marca,
          cantidad,
          nuevoSku: sku // Enviar el nuevo SKU si se modificó
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'El nuevo SKU ya existe') {
          alert('Error: El nuevo SKU ya existe. Intenta con otro.');
          return;
        } else {
          throw new Error('Error al guardar el artículo');
        }
      }
  
      editingSku = null;
      document.getElementById('articleForm').reset();
      loadArticles();
  
      // Si se estaba mostrando un artículo en la búsqueda, actualiza la tabla de búsqueda
      if (searchArticleData) {
        const response = await fetch(`${apiUrl}/${searchArticleData.sku}`);
        const updatedArticle = await response.json();
        renderSearchTable(updatedArticle || null);
      }
    } catch (error) {
      console.error('Error:', error);
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
