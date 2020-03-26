const puppeteer = require("puppeteer");
const fs = require("fs");

// Funcion que crea un número aleatorio 
const MIN_WAIT = 2000;
const MAX_WAIT = 5000;
const randomWait = () => {
    return Math.floor(Math.random() * (MAX_WAIT - MIN_WAIT + 1) + MIN_WAIT);
}

// Url de búsqueda
let url =
  "https://www.iberlibro.com/servlet/SearchResults?cm_sp=SearchF-_-TopNavISS-_-Results&ds=20&kn=cantares%20gallegos&sts=t";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ 
    width: 1920, 
    height: 1080
  });
  await page.goto(url);
  const numPages = await getNumPages(page);

  let bookData;
  let data;
  let counter = 0;

  for (let i = 1; i <= numPages; i++) {
    bookData === undefined ? (bookData = []) : (bookData = [...data]);
    data = await page.evaluate(bookData => {
      let books = document.querySelectorAll(
        "#main > div.cf.search-container > div.result-set.col-xs-9 > div.result-set > div.cf"
      );
      books.forEach(book => {
        let bookJson = {};
        try {
          bookJson.carateristicas = book.querySelector(
            ".bsa.bsa-badge.mt-sm"
          ).innerText;
          bookJson.cantidad = parseInt(
            book.querySelector("#quantity").innerText.slice(21)
          );
          bookJson.vendedor = book
            .querySelector(".bookseller-info.m-md-t")
            .innerText.slice(10, -27);
          bookJson.precio = parseFloat(
            book
              .querySelector(".srp-item-price")
              .innerText.slice(4)
              .replace(",", ".")
          );
        } catch (exception) {
          console.log(exception);
        }
        if (Object.keys(bookJson).length) {
          //Comprobar que el objeto no viene vacío
          bookData.push(bookJson);
        }
      });
      return bookData;
    }, bookData);

    if (i < numPages) {
      await page.click("#topbar-page-next");
      //Una vez que hacemos click y pasamos otra página la url cambia,y debemos volcer a definir page  para poder evaluarla:
      let calculateNewUrl = () => {
        counter = counter + 20;
        return `https://www.iberlibro.com/servlet/SearchResults?bsi=${counter}&ds=20&kn=cantares%20gallegos&sortby=20`;
      };
      await page.waitFor(randomWait());
      await page.goto(calculateNewUrl());
    }
  }
  fs.writeFile("data/libros.json", JSON.stringify(data), err => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
})();

const getNumPages = async page => {
  //Función para determinar el número de libros disponibles en nuestra búsqueda
  let cantidadLibros = await page.evaluate(() => {
    return parseInt(
      document.querySelector("#topbar-search-result-count").innerText
    );
  });
  //Función para determinar el número de libros disponibles en una página
  let cantidadLibrosPorPagina = await page.evaluate(() => {
    return [
      ...document.querySelectorAll(
        "#main > div.cf.search-container > div.result-set.col-xs-9 > div.result-set > div.cf"
      )
    ].length;
  });
  //Número de páginas de navegador que debemos iterar:
  return Math.ceil(cantidadLibros / cantidadLibrosPorPagina);
};
