const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Define storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Appending original filename
    }
});

// Initialize Multer with storage settings
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    res.send('File uploaded successfully.');
});

app.use(express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
