//Generacion de capturas de pantalla y archivos.pdf
const puppeteer = require('puppeteer');

(async() => {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('http://dotgalicia.com/agenda/');
        await page.screenshot({ path: 'screenshots/dotgalicia-agenda.png', fullPage: true });
        await page.pdf({ path: 'screenshots/dotgalicia-agenda.pdf', printBackground: true });
        await browser.close();
        console.log('Successfully Written to File');

    } catch (error) {
        console.log(error);
    }
})();

//La propiedad "headless" nos levanta el navegador con la parte visual. Por defecto es 'true'.
//Se incluye la propiedad fullPage en el objeto <Options> para recoger la página entera.
//Se incluye la propiedad printBackground en el objeto <Options> para que nos pinte las imágenes también.cd 2.