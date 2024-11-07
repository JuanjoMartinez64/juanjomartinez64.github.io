// auth.js

let auth0 = null;

async function initAuth0() {
    auth0 = await createAuth0Client({
       domain: 'dev-u882ixltt6c6nehq.us.auth0.com',
       client_id: 'QgQrwgXrFMl7toaHdNJBZMUvwpnH67bU',
       redirect_uri: window.location.href,
    });

     // Después de la inicialización de Auth0
   await handleRedirectCallback();
   const isAuthenticated = await auth0.isAuthenticated();
// Función para iniciar sesión

async function handleRedirectCallback() {
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
       await auth0.handleRedirectCallback();
       window.history.replaceState({}, document.title, "/");
    }
 }


async function login() {
  await auth0.loginWithRedirect();
}

// Función para cerrar sesión
async function logout() {
  auth0.logout({
    returnTo: window.location.origin,
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

// Inicializar Auth0
initAuth0();