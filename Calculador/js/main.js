//Main.js
apiUrl='https://6729702f6d5fa4901b6d2615.mockapi.io/producto';
// Array donde se guardarán los productos
let productos = [];
let productoEditandoId = null;
// Función para obtener los productos y guardarlos en el array
async function obtenerProductos() {
    return fetch(apiUrl)
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error('Error al obtener los productos');
      }
      return respuesta.json();
    })
    .then(data => {
      productos = data;
    })
    
    .catch(error => {
      console.error('Hubo un problema al obtener los productos:', error);
    });
    
}

// Función para agregar un nuevo producto a la API
async function checkAuthentication() {
  const isLoggedIn = await isAuthenticated(); // Verificar si el usuario está autenticado
  if (!isLoggedIn) {
      alert("Debes iniciar sesión para realizar esta acción");
      return false;
  }
  return true;
}

// Función para agregar un nuevo producto a la API
async function agregarProducto() {
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) return; // Si no está autenticado, no permite agregar producto

  const nombre = document.getElementById('nombre').value;
  const precio = parseFloat(document.getElementById('precio').value);
  let imgUrl = document.getElementById('imgUrl').value;
  if (imgUrl == '') {
      imgUrl = 'Images/imagen_articulo_por_defecto.jpg';
  }
  const nuevoProducto = {
      name: nombre,
      precio: precio,
      img: imgUrl
  };

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoProducto)
      });

      if (!response.ok) {
          throw new Error('Error al agregar el producto');
      }

      const productoAgregado = await response.json();
      productos.push(productoAgregado); // Agrega el nuevo producto al array de productos
      mostrar(); // Muestra la lista actualizada
      document.getElementById('nombre').value = '';
      document.getElementById('precio').value = '';
      document.getElementById('imgUrl').value = '';
      // Cerrar el modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
      modal.hide();
  } catch (error) {
      console.error('Hubo un problema al agregar el producto:', error);
  }
}

async function eliminarProducto(id) {
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) return; // Si no está autenticado, no permite eliminar

  try {
      const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el producto');

      // Recargar los productos desde la API para asegurarse de que la lista esté actualizada
      await obtenerProductos();
      // Mostrar los productos actualizados
      mostrar();
  } catch (error) {
      console.error('Hubo un problema al eliminar el producto:', error);
  }
}

// Llamamos a la función para obtener los productos
async function main() {
    await obtenerProductos();
    
    // Ahora que los productos están cargados, podemos llamar a mostrar()
    mostrar();
  }
  
  async function mostrar() {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = ''; // Limpia el contenedor

    // Verificar si el usuario está autenticado
    const isLoggedIn = await isAuthenticated();

    if (productos.length > 0) {
        let cardsHtml = '';

        for (const producto of productos) {
            cardsHtml += `
                <div class="card mx-auto" style="max-width: 15rem;">
                    <img src="${producto.img}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${producto.name}</h5>
                        <p class="card-text">$${producto.precio}</p>
                        ${isLoggedIn ? `
                            <button class="btn btn-warning" onclick="cargarProductoEnFormulario('${producto.id}', '${producto.name}', '${producto.precio}', '${producto.img}')">Editar</button>
                            <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        ` : ''}
                    </div>
                </div>`;
        }

        contenedor.innerHTML = cardsHtml; // Añadir el HTML generado
    } else {
        contenedor.innerHTML = '<p>No se encontraron productos.</p>'; // Mensaje si no hay productos
    }
}

function cargarProductoEnFormulario(id, nombre, precio, img) {
    // Cargar los datos en el formulario
    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;
    document.getElementById('imgUrl').value = img;
    
    // Guardar el ID del producto que estamos editando
    productoEditandoId = id;

    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

async function actualizarProducto() {
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) return; // Si no está autenticado, no permite actualizar

  const nombre = document.getElementById('nombre').value;
  const precio = parseFloat(document.getElementById('precio').value);
  const imgUrl = document.getElementById('imgUrl').value;

  const productoActualizado = {
      name: nombre,
      precio: precio,
      img: imgUrl
  };

  try {
      const response = await fetch(`${apiUrl}/${productoEditandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoActualizado)
      });

      if (!response.ok) throw new Error('Error al actualizar el producto');
      const data = await response.json();

      // Actualizamos el producto en el array local y refrescamos la lista
      productos = productos.map(prod => prod.id === productoEditandoId ? data : prod);
      productoEditandoId = null; // Resetear ID después de la edición
      // Muestra la lista actualizada

      // Cerrar el modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
      modal.hide();
      await obtenerProductos();
      mostrar();
  } catch (error) {
      console.error('Hubo un problema al actualizar el producto:', error);
  }
}

// Llamada principal para obtener y mostrar productos
async function main() {
  await obtenerProductos();
  mostrar();
}

  
  // Llamamos a la función principal
  

  document.getElementById('agregarArticulo').addEventListener('click', () => {
    if (productoEditandoId) {
        actualizarProducto(); // Llama a la función para actualizar el producto
        productoEditandoId = null; // Resetea el ID después de la edición
    } else {
        agregarProducto(); // Llama a la función para agregar un producto nuevo
    }
});

main();

