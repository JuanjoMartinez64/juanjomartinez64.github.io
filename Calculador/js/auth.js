// auth.js

let auth0 = null;

async function initAuth0() {
  auth0 = await createAuth0Client({
    domain: 'dev-goklswrk5pmpso6j.us.auth0.com', // Reemplaza con tu dominio de Auth0
    client_id: '67ixoWRhbjqisNwD30tIJU7JYBGHajEv', // Reemplaza con tu Client ID
    redirect_uri: window.location.href, // URL donde se redirige después del login
  });
}

// Función para iniciar sesión
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