const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

class DataManager{
constructor() {
        // this.data = JSON.parse(localStorage.getItem("dataCrud")) || [];
        this.data = [];
        this.elementsList = document.getElementById("items-list");
        this.form = document.getElementById("form");
        this.filterCategory = document.getElementById("filter-category");
        this.filterStatus = document.getElementById("filter-status");

        this.form.addEventListener("submit", (e) => this.addData(e));
        this.elementsList.addEventListener("click", this.deleteData.bind(this));
        this.elementsList.addEventListener("click", this.editData.bind(this));
        this.elementsList.addEventListener("click", this.toggleCompleted.bind(this));
        document.getElementById("filter-button").addEventListener("click", () => this.renderData());
        document.getElementById("clear-filters").addEventListener("click", () => this.clearFilters());

        this.renderData();
    }


    // saveData() {
    //     localStorage.setItem("dataCrud", JSON.stringify(this.data));
    // }

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

    async deleteData(e) {
        if (e.target.classList.contains("eliminar")) {
        const id = e.target.dataset.id;
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        this.renderData();
        }
    }

    async editData(e) {
        if (e.target.classList.contains("editar")) {
        const id = e.target.dataset.id;
        const task = this.data.find((t) => t._id === id);
        document.getElementById("name").value = task.name;
        document.getElementById("description").value = task.description;
        document.getElementById("category").value = task.category;
        document.getElementById("dueDate").value = task.dueDate?.slice(0, 10);
        this.editId = id;
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        this.renderData();
        }
    }

    async renderData() {
        this.elementsList.innerHTML = "";

        const res = await fetch(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const categoryFilter = this.filterCategory.value;
        const statusFilter = this.filterStatus.value;

        // this.data = data;
        this.data = data.filter((task) => {
            const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "completed" && task.completed) ||
                (statusFilter === "pending" && !task.completed);
            return matchesCategory && matchesStatus;
        });

        if (this.data.length === 0) {
            this.elementsList.innerHTML = "<p>No hay elementos guardados.</p>";
            return;
        }

        this.data.forEach((item) => {
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
                    <button class="toggle-complete" data-id="${item._id}">
                        ${item.completed ? "Desmarcar" : "Completar"}
                    </button>
                    <button class="editar" data-id="${item._id}">Editar</button>
                    <button class="eliminar" data-id="${item._id}">Eliminar</button>
                </div>
            `;
            this.elementsList.appendChild(div);
            });
    }

    async toggleCompleted(e) {
        if (e.target.classList.contains("toggle-complete")) {
        const id = e.target.dataset.id;
        const task = this.data.find((t) => t._id === id);
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ completed: !task.completed }),
        });
        this.renderData();
        }
    }

    clearFilters() {
        this.filterCategory.value = "all";
        this.filterStatus.value = "all";
        this.renderData();
    }
}

new DataManager();