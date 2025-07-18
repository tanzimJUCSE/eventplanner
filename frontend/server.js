const express = require('express');

const path = require('path');

const app = express();

const port = process.env.PORT || 8080;

// Serve static files from the current directory (for flat deployment str

app.use(express.static(__dirname));

// For any other route, serve index.html (for React Router)

app.get('*', (req, res) => {

res.sendFile(path.join(__dirname, 'index.html'));

});

app.listen(port, () => {

  console.log(`Server running on port ${port}`);

  });