class AuthManager {
    constructor() {
        this.data = [];
        this.elementsList = document.getElementById("elementsList");
        this.form = document.getElementById("loginForm");
        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        this.loginButton = document.getElementById("loginButton");
        this.errorMessage = document.getElementById("errorMessage");
        this.successMessage = document.getElementById("successMessage");

        this.loginButton.addEventListener("click", (e) => this.handleLogin(e));
    }
    
    async handleLogin(event) {
        event.preventDefault();

        if (this.errorMessage) {
            this.errorMessage.textContent = "";
            this.errorMessage.style.display = "none";
        }
        if (this.successMessage) {
            this.successMessage.textContent = "";
            this.successMessage.style.display = "none";
        }

        try {        
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: this.email.value,
                    password: this.password.value,
                }),
            });

            if (!res.ok) {
                if (this.errorMessage) {
                    this.errorMessage.textContent = "Credenciales incorrectas";
                    this.errorMessage.style.display = "block";
                }
                if (this.successMessage) this.successMessage.style.display = "none";
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            if (this.successMessage) {
                this.successMessage.textContent = "Login exitoso, redirigiendo...";
                this.successMessage.style.display = "block";
            }
            if (this.errorMessage) this.errorMessage.style.display = "none";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        } catch (err) {
            console.error("Error al loguear:", err);
            if (this.errorMessage) {
                this.errorMessage.textContent = "Ocurrió un error al intentar iniciar sesión.";
                this.errorMessage.style.display = "block";
            }
            if (this.successMessage) this.successMessage.style.display = "none";
            }
    }
}

new AuthManager();