const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Array of URLs to scrape
const pageUrls = [
    { url: 'https://thingspeak.com/apps/matlab_visualizations/577547', name: 'windrose' },
    { url: 'https://thingspeak.com/apps/matlab_visualizations/580156', name: 'umidade' },
    { url: 'https://thingspeak.com/apps/matlab_visualizations/580223', name: 'chuva' },
    { url: 'https://thingspeak.com/apps/matlab_visualizations/577545', name: 'vento' },
    { url: 'https://thingspeak.com/apps/matlab_visualizations/580073', name: 'temperatura_e_vento' }
];

// Delay function using setTimeout
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scrapeImageUrl = async (pageUrl) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(pageUrl);
        await delay(3000);  // Delay by 5 seconds
        await page.waitForSelector('.plot_image', { timeout: 60000 });
        
        const imageUrl = await page.evaluate(() => {
            const img = document.querySelector('.plot_image');
            return img ? img.src : null;
        });

        if (!imageUrl) {
            console.log(`Image with class "plot_image" not found on ${pageUrl}`);
            return null;
        }

        return imageUrl;

    } catch (error) {
        console.error(`Error scraping ${pageUrl}:`, error);
        return null;
    } finally {
        await browser.close();
    }
};

const scrapeAllImages = async () => {
    const results = {};

    for (const { url, name } of pageUrls) {
        try {
            const imageUrl = await scrapeImageUrl(url);
            results[name] = imageUrl;
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
            results[name] = null;
        }
    }

    // Save all image URLs to a single JSON file
    const filePath = path.join(__dirname, 'public', 'image_urls.json');
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
    console.log('All image URLs have been saved to image_urls.json.');
};

scrapeAllImages();
