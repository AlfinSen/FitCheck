const express = require('express');
const app = express();
const PORT = 5001;

app.get('/', (req, res) => res.send('Test Server Running'));

app.listen(PORT, () => {
    console.log(`Test Server listening on port ${PORT}`);
});
