const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const e = require("express");

dotenv.config();

const app = express();

app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    },
})

const upload = multer({
    storage: storage
});

app.get("/", (req, res) => {
    res.send("Welcome to our Video Transcription API");
});

app.post("/transcribe", upload.single("file") ,async (req, res) => {
    
    try {
        
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-1"
        });

        res.send(transcription);

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            res.status(500).send(error.response.data);
        } else {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }
});
const PORT = process.env.PORT || 1330;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
