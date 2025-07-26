// const API_URL = "http://localhost:3000"; // Cambia esto por tu URL de backend
const API_URL = "http://185.194.216.149:3000";

// Elementos del DOM
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const buttonText = document.getElementById("buttonText");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// Función para mostrar mensaje de error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  successMessage.style.display = "none";
}

// Función para mostrar mensaje de éxito
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
  errorMessage.style.display = "none";
}

// Función para ocultar mensajes
function hideMessages() {
  errorMessage.style.display = "none";
  successMessage.style.display = "none";
}

// Función para mostrar estado de carga
function setLoading(isLoading) {
  if (isLoading) {
    loginButton.disabled = true;
    buttonText.innerHTML = '<span class="loading"></span>Ingresando...';
  } else {
    loginButton.disabled = false;
    buttonText.textContent = "Ingresar";
  }
}

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para realizar el login
async function performLogin(email, password) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Login exitoso
      showSuccess("¡Login exitoso! Redirigiendo...");

      // Guardar token en localStorage (o sessionStorage)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Guardar información del usuario
      if (data.user) {
        localStorage.setItem("userInfo", JSON.stringify(data.user));
      }

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        window.location.href = "dashboard.html"; // Cambia por tu página principal
      }, 1500);
    } else {
      // Error en el login
      showError(
        data.message || "Error al iniciar sesión. Verifica tus credenciales."
      );
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    showError("Error de conexión. Verifica que el servidor esté funcionando.");
  }
}

// Event listener para el formulario
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessages();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validaciones del frontend
  if (!email || !password) {
    showError("Por favor, completa todos los campos.");
    return;
  }

  if (!isValidEmail(email)) {
    showError("Por favor, ingresa un email válido.");
    return;
  }

  if (password.length < 6) {
    showError("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  // Mostrar estado de carga
  setLoading(true);

  // Realizar login
  await performLogin(email, password);

  // Quitar estado de carga
  setLoading(false);
});

// Verificar si ya hay un token válido al cargar la página
window.addEventListener("load", () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    // Opcional: verificar si el token es válido
    // Si es válido, redirigir al dashboard
    // window.location.href = 'dashboard.html';
  }
});

// Limpiar mensajes cuando el usuario empiece a escribir
emailInput.addEventListener("input", hideMessages);
passwordInput.addEventListener("input", hideMessages);
