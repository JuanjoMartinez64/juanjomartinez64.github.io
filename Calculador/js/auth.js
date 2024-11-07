let auth0 = null;

async function initAuth0() {
    auth0 = await createAuth0Client({
        domain: 'dev-u882ixltt6c6nehq.us.auth0.com',
        client_id: 'QgQrwgXrFMl7toaHdNJBZMUvwpnH67bU',
        redirect_uri: window.location.href
    });

    // Verificar si estamos en el flujo de redirección de Auth0
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            // Maneja la redirección y obtiene el token de autorización
            await auth0.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.pathname); // Limpiar la URL después de la redirección
        } catch (error) {
            console.error("Error en handleRedirectCallback:", error);
        }
    }
    
    // Verificar si el usuario ya está autenticado
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        const user = await auth0.getUser();
        document.getElementById("userInfo").innerHTML = `Bienvenido, ${user.name}`;
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
        document.getElementById("agregarArticulo").style.display = "block"; // Muestra el botón de agregar artículo si está logueado
    } else {
        document.getElementById("login").style.display = "block";
        document.getElementById("logout").style.display = "none";
        document.getElementById("agregarArticulo").style.display = "none";
    }
}

// Función para iniciar sesión
async function login() {
    await auth0.loginWithRedirect({
        redirectUri: window.location.href
    });
}

// Función para cerrar sesión
async function logout() {
    const returnToUrl = encodeURIComponent(window.location.origin); // Codificar correctamente la URL
    await auth0.logout({
        returnTo: returnToUrl // Usar la URL codificada
    });
}

// Función para verificar si el usuario está autenticado
async function isAuthenticated() {
    return await auth0.isAuthenticated();
}

// Función para obtener el perfil del usuario
async function getUser() {
    return await auth0.getUser();
}

// Inicializar Auth0 cuando la página se carga
window.onload = async () => {
    await initAuth0();
    
    const isLoggedIn = await isAuthenticated();
    if (isLoggedIn) {
        const user = await getUser();
        document.getElementById("userInfo").innerHTML = `Bienvenido, ${user.name}`;
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
        document.getElementById("agregarArticulo").style.display = "block";  // Muestra el botón de agregar artículo si está logueado
    } else {
        document.getElementById("logout").style.display = "none";
        document.getElementById("login").style.display = "block";
        document.getElementById("agregarArticulo").style.display = "none";
    }
    
    main(); // Llamada a la función principal para cargar productos
}; 