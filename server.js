const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/run-scraping-script', (req, res) => {
    exec('node scrape.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error running the script');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Script error');
        }
        console.log(`stdout: ${stdout}`);

        // Send a response indicating success
        res.json({ status: 'success', message: 'Script executed successfully' });
    });
});

// Endpoint to fetch the image URL
app.get('/get-image-url', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'image_urls.json');
    res.sendFile(filePath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});