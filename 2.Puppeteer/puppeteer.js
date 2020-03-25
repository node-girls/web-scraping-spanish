const puppeteer = require("puppeteer");

let url =
  "https://www.iberlibro.com/servlet/SearchResults?cm_sp=SearchF-_-TopNavISS-_-Results&ds=20&kn=cantares%20gallegos&sts=t";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let data = await page.evaluate(() => {
    let bookData = [];
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
      if (Object.keys(bookJson).length) { //Comprobar que el objeto no viene vacío
        bookData.push(bookJson);
      }
    });
    return bookData;
  });

  console.log(data);
})();


