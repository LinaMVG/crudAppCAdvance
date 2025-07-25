const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

<<<<<<< HEAD
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
=======
if (!token) {
    window.location.href = "login.html";
>>>>>>> ec12dea487c03b5ff046b1f9a4df957a3f10b8f2
}

class DataManager{
constructor() {
        // this.data = JSON.parse(localStorage.getItem("dataCrud")) || [];
        this.data = [];
        this.elementsList = document.getElementById("items-list");
        this.form = document.getElementById("form");

        this.form.addEventListener("submit", (e) => this.addData(e));
        this.elementsList.addEventListener("click", this.deleteData.bind(this));
        this.elementsList.addEventListener("click", this.editData.bind(this));

        this.renderData();
    }


    saveData() {
        localStorage.setItem("dataCrud", JSON.stringify(this.data));
    }

    async addData(e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const description = document.getElementById("description").value.trim();
        const category = document.getElementById("category")?.value || "General";
        const dueDate = document.getElementById("dueDate")?.value || null;

        if (!name || !description) return;

        // const newTask = {name, description};
        const newTask = {
            name,
            description,
            category,
            dueDate,
            completed: false,
        };

        try {
            const res = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newTask),
            });

            if (!res.ok) throw new Error("Error al agregar tarea");

            this.form.reset();
            this.renderData();
            } catch (err) {
            console.error(err);
            alert("Ocurrió un error al guardar la tarea");
            }

        // this.data.push(newTask);
        // this.saveData();
        // this.renderData();
        // this.form.reset();
    }

    deleteData(e) {
        if (e.target.classList.contains("eliminar")) {
            const index = e.target.dataset.index;
            this.data.splice(index, 1);
            this.saveData();
            this.renderData();
        }
    }

    editData(e) {
        if (e.target.classList.contains("editar")) {
            const index = e.target.dataset.index;
            this.form.name.value = this.data[index].name;
            this.form.description.value = this.data[index].description;
            this.data.splice(index, 1);
            this.saveData();
            this.renderData();
        }
    }

    async renderData() {
        this.elementsList.innerHTML = "";

        const res = await fetch(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        this.data = data;

        if (this.data.length === 0) {
            this.elementsList.innerHTML = "<p>No hay elementos guardados.</p>";
            return;
        }

        this.data.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("item");
            div.innerHTML = `
                <div class="item-content">
                    <div class="item-title">${item.name}</div>
                    <div class="item-description">${item.description}</div>
                    <div>Vence: ${item.dueDate?.slice(0, 10) || "-"}</div>
                    <div>Estado: ${item.completed ? "✔ Completada" : "⏳ Pendiente"}</div>
                </div>
                <div class="item-actions">
                    <button class="editar" data-id="${item._id}">Editar</button>
                    <button class="eliminar" data-id="${item._id}">Eliminar</button>
                </div>
            `;
            this.elementsList.appendChild(div);
            });
    }

}

new DataManager();