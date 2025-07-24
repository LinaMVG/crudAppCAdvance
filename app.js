class DataManager{
    constructor() {
        this.data = [];
        this.elementsList = document.getElementById("elementsList");
        this.form = document.getElementById("loginForm");
        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        this.loginButton = document.getElementById("loginButton");



        this.loginButton.addEventListener("click", (e) => this.handleLogin(e));
    }
    

    async handleLogin(event) {
    event.preventDefault();

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@demo.com", password: "123456" })
        }).then(r => r.json()).then(console.log);

    try {
        
        // const res = await fetch("http://localhost:3000/api/auth/login", {
        // method: "POST",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({
        //     email: this.email.value,
        //     password: this.password.value,
        // }),
        });

        if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);
        alert("Login exitoso");
        window.location.href = "index.html";
    } catch (err) {
        console.error("Error al loguear:", err);
        alert("Ocurrió un error al intentar iniciar sesión.");
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