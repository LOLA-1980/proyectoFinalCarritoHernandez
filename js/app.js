//Todos los elementos del DOM que voy a necesitar para crear las tarjetas de productos
const contTarjetas = document.getElementById('tarjetas');

//---------FETCH-----------
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

const fetchData = async () => {
    try {
        const res = await fetch('productos.json')
        const data = await res.json()
        guardarProductos(data);
        mostrarInfoMascota(data);
    } catch (error) {
        console.log(error)
    }
}

function guardarProductos(data) { //enviamos un array de objeto
    localStorage.setItem("productos", JSON.stringify(data));
}

function cargarProductos() {
    return JSON.parse(localStorage.getItem("productos"));
}

function guardarProductosCarrito(producto) { //enviamos un objeto
    const productos_carrito = cargarProductosCarrito();
    let pos = productos_carrito.findIndex(item => item.id === producto.id);

    if (pos > -1) {
        productos_carrito[pos].cantidad += 1;
    } else {
        producto.cantidad = 1;
        productos_carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(productos_carrito));
    renderCarrito();
}

function cargarProductosCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

//Creo HTML dinámico para mostrar la información de los productos para mascotas a partir del array fake DB
function mostrarInfoMascota(data) {
    contTarjetas.innerHTML = ''
    data.forEach(element => {
        let html = `<div class="col d-flex justify-content-center mb-4">
        <div class="card shadow mb-1 rounded" style="width: 20rem;">
            <h5 class="card-title pt-2 text-center text-primary">${element.titulo}</h5>
            <img src="${element.img}" class="card-img-top" alt="${element.alt}">
            <div class="card-body">
                <p class="card-text text-white-50 description">${element.descripcion}</p>
                <h5 class="text-primary">Precio: <span class="precio">${element.precio}</span></h5>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary button" onclick="addToCarritoItem(${element.id})">Añadir a Carrito</button>
                </div>
            </div>
        </div>
        </div>`;
        contTarjetas.innerHTML += html;
    });

}


//-------CARRITO DE COMPRAS-------------
const Clickbutton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []

/* Clickbutton.forEach(btn => {
    btn.addEventListener('click', addToCarritoItem)
}) */


function addToCarritoItem(id) {
    const productos = cargarProductos();
    let producto = productos.find(item => item.id === id);
    guardarProductosCarrito(producto);
}




function renderCarrito() {
    let carrito = cargarProductosCarrito();
    console.log(carrito);
    const tabla_carrito = document.getElementById("tabla_carrito");
    carrito.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('ItemCarrito');
        const content = `
        <th scope="row">${item.id}</th>
        <td class="tabla__productos">
            <img src=${item.img} alt="" width="120">
        </td>
        <td>
            <p class="title">${item.titulo}</p>
        </td>
        <td class="tabla__price">
            <p>${item.precio}</p>
        </td>
        <td class="tabla__cantidad">
            <input class="input__elemento" type="number" min="1" value=${item.cantidad}>
            <button class="delete btn btn-danger">x</button>
        </td>`;
        tr.innerHTML = content;
        tabla_carrito.append(tr);
    })

    document.getElementById("total_carrito").innerHTML = "$" + precioTotal();
}

function precioTotal() {
    let carritos = cargarProductosCarrito();
    let suma_total = 0;

    carritos.forEach(item => {
        suma_total += item.cantidad * item.precio;
    });

    return suma_total;
}
