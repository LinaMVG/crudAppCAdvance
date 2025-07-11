class DataManager{
    constructor() {
        this.data = JSON.parse(localStorage.getItem("dataCrud")) || [];
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

    addData(e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const description = document.getElementById("description").value.trim();

        if (!name || !description) return;

        const newTask = {name, description};

        this.data.push(newTask);
        this.saveData();
        this.renderData();
        this.form.reset();
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

    renderData() {
        this.elementsList.innerHTML = "";

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
                </div>
                <div class="item-actions">
                    <button class="editar" data-index="${index}">Editar</button>
                    <button class="eliminar" data-index="${index}">Eliminar</button>
                </div>
            `;
            this.elementsList.appendChild(div);
            });
    }

}

new DataManager();