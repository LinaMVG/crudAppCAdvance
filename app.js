class DataManager{
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
                window.location.href = "dashboard.html";
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







//     saveData() {
//         localStorage.setItem("dataCrud", JSON.stringify(this.data));
//     }

//     addData(e) {
//         e.preventDefault();
//         const name = document.getElementById("name").value.trim();
//         const description = document.getElementById("description").value.trim();

//         if (!name || !description) return;

//         const newTask = {name, description};

//         this.data.push(newTask);
//         this.saveData();
//         this.renderData();
//         this.form.reset();
//     }

//     deleteData(e) {
//         if (e.target.classList.contains("eliminar")) {
//             const index = e.target.dataset.index;
//             this.data.splice(index, 1);
//             this.saveData();
//             this.renderData();
//         }
//     }

//     editData(e) {
//         if (e.target.classList.contains("editar")) {
//             const index = e.target.dataset.index;
//             this.form.name.value = this.data[index].name;
//             this.form.description.value = this.data[index].description;
//             this.data.splice(index, 1);
//             this.saveData();
//             this.renderData();
//         }
//     }

//     renderData() {
//         this.elementsList.innerHTML = "";

//         if (this.data.length === 0) {
//             this.elementsList.innerHTML = "<p>No hay elementos guardados.</p>";
//             return;
//         }

//         this.data.forEach((item, index) => {
//             const div = document.createElement("div");
//             div.classList.add("item");
//             div.innerHTML = `
//                 <div class="item-content">
//                     <div class="item-title">${item.name}</div>
//                     <div class="item-description">${item.description}</div>
//                 </div>
//                 <div class="item-actions">
//                     <button class="editar" data-index="${index}">Editar</button>
//                     <button class="eliminar" data-index="${index}">Eliminar</button>
//                 </div>
//             `;
//             this.elementsList.appendChild(div);
//             });
//     }

// }

new DataManager();