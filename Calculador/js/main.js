
apiUrl='https://6729702f6d5fa4901b6d2615.mockapi.io/producto';

let productos = [];
let productoEditandoId = null;

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


async function checkAuthentication() {
  const isLoggedIn = await isAuthenticated(); 
  if (!isLoggedIn) {
      alert("Debes iniciar sesión para realizar esta acción");
      return false;
  }
  return true;
}


async function agregarProducto() {
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) return; // Si no está autenticado, no permite agregar producto

  const nombre = document.getElementById('nombre').value;
  const precio = parseFloat(document.getElementById('precio').value);
  let imgUrl = document.getElementById('imgUrl').value;
  const type = document.querySelector('.selectedType').value;
  if (imgUrl == '') {
      imgUrl = 'Images/imagen_articulo_por_defecto.jpg';
  }
  const nuevoProducto = {
      name: nombre,
      precio: precio,
      img: imgUrl,
      tipo: type
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
      productos.push(productoAgregado); 
      mostrar(); 
      document.getElementById('nombre').value = '';
      document.getElementById('precio').value = '';
      document.getElementById('imgUrl').value = '';
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
      modal.hide();
  } catch (error) {
      console.error('Hubo un problema al agregar el producto:', error);
  }
}

async function eliminarProducto(id) {
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) return; 

  try {
      const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el producto');

      
      await obtenerProductos();
     
      mostrar();
  } catch (error) {
      console.error('Hubo un problema al eliminar el producto:', error);
  }
}


  
  async function mostrar() {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = ''; 

    
    const isLoggedIn = await isAuthenticated();

    if (productos.length > 0) {
        let cardsHtml = '';

        for (const producto of productos) {
            cardsHtml += `
                <div class="card" style="width: 15rem;">
                    <img src="${producto.img}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${producto.name}</h5>
                        <p class="card-text">$${producto.precio}</p>
                        <p class="card-text">Categoria: ${producto.tipo}</p>
                        ${isLoggedIn ? `
                            <button class="btn btn-warning" onclick="cargarProductoEnFormulario('${producto.id}', '${producto.name}', '${producto.precio}', '${producto.img}', '${producto.tipo}')">Editar</button>
                            <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        ` : ''}
                    </div>
                </div>`;
        }

        contenedor.innerHTML = cardsHtml; 
    } else {
        contenedor.innerHTML = '<p>No se encontraron productos.</p>'; 
    }
}

function cargarProductoEnFormulario(id, nombre, precio, img, tipo) {
    
    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;
    document.getElementById('imgUrl').value = img;
    document.querySelector('.selectedType').value = tipo;

    productoEditandoId = id;
    
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

async function actualizarProducto() {
    

    if (!productoEditandoId) {
        console.error('No hay un producto para editar');
        return;
    }

    const botonConfirmar = document.getElementById('agregarArticulo'); 
    botonConfirmar.disabled = true; // Deshabilitar el botón para evitar múltiples clics

    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const imgUrl = document.getElementById('imgUrl').value;
    const tipo = document.querySelector('.selectedType').value;

    const productoActualizado = {
        name: nombre,
        precio: precio,
        img: imgUrl,
        tipo: tipo
    };

    try {
        const response = await fetch(`${apiUrl}/${productoEditandoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoActualizado)
        });

        if (!response.ok) throw new Error('Error al actualizar el producto');
        const data = await response.json();

        // Actualizar el producto en la lista local
        productos = productos.map(prod => prod.id === productoEditandoId ? data : prod);

        
        productoEditandoId = null;  // Limpiar el ID después de la actualización

        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
        modal.hide();
        await obtenerProductos();
        mostrar();
    } catch (error) {
        console.error('Hubo un problema al actualizar el producto:', error);
    }
    botonConfirmar.disabled = false;
}


async function main() {
  await obtenerProductos();
  mostrar();
  loadSelectorItems();
}

  
  
  

  document.getElementById('agregarArticulo').addEventListener('click', () => {
    if (productoEditandoId) {
        actualizarProducto(); 
        productoEditandoId = null; 
    } else {
        agregarProducto(); 
    }
});


document.getElementById('addItem').addEventListener('click', () => {
    let contenedor = document.getElementById('budgetItems');

    const nuevaFila = document.createElement('div');
    nuevaFila.classList.add('itemContainer');
    
    nuevaFila.innerHTML = `
                    <div class="inputContainer">
                        <label for="itemSelector">Seleccionar Articulo</label>
                        <select class="form-select itemSelector" aria-label="Default select example">
                            <option selected value="0">Selecciona un articulo</option>
                        </select>
                    </div>
                    <div class="inputContainer">
                        <label for="cantItem">Cantidad de articulos</label>
                        <input type="number" id="cantItem" class="form-control" required>
                    </div>
                    <div class="inputContainer">
                        <label for="cantItem" class="priceLabel">Precio del articulo</label>
                        <div class="priceContainer">
                            <p class="priceItem">$0</p>
                        </div>
                    </div>
        <button type="button" class="btn btn-danger deltbn eliminarBtn">X</button>
    `;
    
    contenedor.appendChild(nuevaFila);

    nuevaFila.querySelector('.eliminarBtn').addEventListener('click', () => {
        
        contenedor.removeChild(nuevaFila);
        
    });
    loadSelectorItems()
});



function loadSelectorItems() {
    
    selectedType= document.getElementById('tipoSeleccionado');
    console.log(selectedType.value)
    const itemSelectors = document.querySelectorAll('.itemSelector');
    itemSelectors.forEach(selector => {
        productos.forEach(producto => {
            if(producto.tipo == selectedType.value){
                const option = document.createElement('option');
                option.value = producto.id;
                option.textContent = producto.name;
                selector.appendChild(option);
            }
        });
    });

}


//Funcion para escuchar el selector de tipo
document.addEventListener('change', (event) => {
    let items = document.querySelectorAll('.itemSelector');
    if (event.target.id === 'tipoSeleccionado') {
        for (item of items){
            item.innerHTML = '<option selected value="0">Selecciona un articulo</option>';
        }
        loadSelectorItems();
    }
});

document.addEventListener('change', (event) => {
    if (event.target.classList.contains('itemSelector')) {
        const selectedId = event.target.value;
        const selectedProduct = productos.find(prod => prod.id === selectedId);
        const priceContainer = event.target.closest('.itemContainer').querySelector('.priceItem');
        priceContainer.textContent = selectedProduct ? `$${selectedProduct.precio}` : '$0';
    }
});

