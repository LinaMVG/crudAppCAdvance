// const API_URL = process.env.URL_BACK;
// const API_URL = "http://localhost:3000";
const API_URL = "http://185.194.216.149:3000";

const form = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerButton = document.getElementById("registerButton");
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
        registerButton.disabled = true;
        buttonText.innerHTML = '<span class="loading-spinner"></span>Registrando...';
    } else {
        registerButton.disabled = false;
        buttonText.textContent = "Crear Cuenta"; // FIXED: Texto consistente con el HTML
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar fortaleza de contraseña
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength >= 3; // Requiere al menos 3 criterios
}

// Función para realizar el registro
async function performRegister(email, password, confirmPassword) {
    try {
        console.log('Enviando datos al servidor:', { email, password: '***', confirmPassword: '***' }); // Debug
        
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }),
        });

        console.log('Response status:', response.status); // Debug
        
        // Verificar si la respuesta es JSON válida
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("El servidor no devolvió una respuesta JSON válida");
        }

        const data = await response.json();
        console.log('Response data:', data); // Debug

        if (response.ok) {
            // Registro exitoso
            showSuccess("¡Registro exitoso! Redirigiendo al login...");

            // Opcional: Guardar token si el servidor lo envía
            if (data.token) {
                localStorage.setItem("authToken", data.token);
            }
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = "index.html"; // FIXED: Redirigir al login
            }, 2000);
        } else {
            // Error en el registro
            showError(data.message || data.error || "Ocurrió un error al registrar. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error al registrar:", error);
        
        // Mensajes de error más específicos
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError("No se pudo conectar con el servidor. Verifica que esté ejecutándose en localhost:3000");
        } else if (error.message.includes('JSON')) {
            showError("Error en la respuesta del servidor. Verifica la configuración del backend.");
        } else {
            showError("Ocurrió un error al intentar registrarse. Por favor, inténtalo más tarde.");
        }
    }
}

// FIXED: Evento de envío del formulario simplificado
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenir el envío normal del formulario
    event.stopPropagation(); // Evitar propagación del evento
    
    hideMessages();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Validaciones del frontend más robustas
    if (!email || !password || !confirmPassword) {
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

    // FIXED: Validación de fortaleza de contraseña
    if (!checkPasswordStrength(password)) {
        showError("La contraseña debe contener al menos 8 caracteres, mayúsculas, minúsculas y números.");
        return;
    }

    if (password !== confirmPassword) {
        showError("Las contraseñas no coinciden.");
        return;
    }

    // Mostrar estado de carga
    setLoading(true);

    try {
        // Realizar registro
        await performRegister(email, password, confirmPassword);
    } finally {
        // Siempre ocultar estado de carga
        setLoading(false);
    }
});

// FIXED: Remover el event listener duplicado del botón
// El botón de submit ya se maneja con el evento 'submit' del formulario

// Validación en tiempo real para mejorar UX
emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
        this.classList.add('error');
        this.classList.remove('success');
    } else if (email) {
        this.classList.remove('error');
        this.classList.add('success');
    }
});

passwordInput.addEventListener('input', function() {
    const password = this.value;
    if (password.length > 0) {
        if (checkPasswordStrength(password)) {
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            this.classList.add('error');
            this.classList.remove('success');
        }
    }
});

confirmPasswordInput.addEventListener('input', function() {
    const password = passwordInput.value;
    const confirmPassword = this.value;
    
    if (confirmPassword.length > 0) {
        if (password === confirmPassword) {
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            this.classList.add('error');
            this.classList.remove('success');
        }
    }
});

// Debug: Verificar que todos los elementos existen
document.addEventListener('DOMContentLoaded', function() {
    console.log('Elementos del DOM:');
    console.log('Form:', form);
    console.log('Email input:', emailInput);
    console.log('Password input:', passwordInput);
    console.log('Confirm password input:', confirmPasswordInput);
    console.log('Button:', registerButton);
    console.log('API URL:', API_URL);
});