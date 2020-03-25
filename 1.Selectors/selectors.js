// Construir array

let container = document.querySelector(
  "#main > div.cf.search-container > div.result-set.col-xs-9 > div.result-set"
);

let resultados = [...container.querySelectorAll(".cf.result")];
let resultadosFiltrados = resultados.map(el => [
  ...el.querySelectorAll(
    "div.srp-item-price, div.bsa, div.bookseller-info, p#quantity"
  )
]);
let contenido = [
  ...resultadosFiltrados.map(el => el.map(subel => subel.innerText))
];

let data = contenido
  .filter(el => el.length > 0)
  .map(el => {
    Object.assign({}, el);
    if (el.length < 5) {
      return {
        Características: [el[0]], // Características del libro
        Cantidad: parseInt(el[1].slice(21)), //Quedarnos únicamente con la cantidad de libros disponibles en formato numérico
        Vendedor: el[2].slice(10, -27), //Quedarnos únicamente con el nombre y ciudad de la librería
        Precio_EUR: parseFloat(el[3].slice(4).replace(",", ".")) //Quedarnos únicamente con el precio del libro en formato numérico
      };
    }
    if (el.length === 5) {
      return {
        Características: [el[0], el[1]], // Hay libros que tienen dos caraterísticas por lo que el array es de distita longitud
        Cantidad: parseInt(el[2].slice(21)), //Quedarnos únicamente con la cantidad de libros disponibles en formato numérico
        Vendedor: el[3].slice(10, -27), //Quedarnos únicamente con el nombre y ciudad de la librería
        Precio_EUR: parseFloat(el[4].slice(4).replace(",", ".")) //Quedarnos únicamente con el precio del libro en formato numérico
      };
    }
  });

let precios = data.map(el => el.Precio_EUR);
let minimoPrecio = Math.min(...precios);

let vendedorMasBarato = data.find(el => el.Precio_EUR === minimoPrecio);

console.log(vendedorMasBarato.Vendedor);
