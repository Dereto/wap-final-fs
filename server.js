const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Define storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = path.basename(file.originalname, ext); // Extract filename without extension

        // Check if a file with the same name (excluding extension) exists
        fs.access(`uploads/${filename}.png`, fs.constants.F_OK, (errPNG) => {
            if (!errPNG) {
                // If a PNG file with the same name exists, delete it
                fs.unlinkSync(`uploads/${filename}.png`);
            }
            fs.access(`uploads/${filename}.jpg`, fs.constants.F_OK, (errJPG) => {
                if (!errJPG) {
                    // If a JPG file with the same name exists, delete it
                    fs.unlinkSync(`uploads/${filename}.jpg`);
                }
                cb(null, `${filename}${ext}`); // Use the original filename without any changes
            });
        });
    }
});


// Initialize Multer with storage settings
const upload = multer({ storage: storage });

// File upload route
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    res.send('File uploaded successfully.');
});

// Serve static files based on UUID
app.use('/:uuid', (req, res, next) => {
    const uuid = req.params.uuid;
    const imagePathPNG = path.join(__dirname, `uploads/${uuid}.png`);
    const imagePathJPG = path.join(__dirname, `uploads/${uuid}.jpg`);

    // Check if either PNG or JPG file exists
    fs.access(imagePathPNG, fs.constants.F_OK, (errPNG) => {
        if (!errPNG) {
            return res.sendFile(imagePathPNG);
        } else {
            fs.access(imagePathJPG, fs.constants.F_OK, (errJPG) => {
                if (!errJPG) {
                    return res.sendFile(imagePathJPG);
                } else {
                    // Neither PNG nor JPG file found
                    next();
                }
            });
        }
    });
});

// Handle requests for non-existent files
app.use((req, res) => {
    res.status(404).send('File not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
