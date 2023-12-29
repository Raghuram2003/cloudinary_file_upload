import express from "express";
import { config } from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs";
config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.post("/api/file", upload.single("file"), async (req, res) => {
  console.log(req.body, req.file);
  const response = await cloudinary.uploader.upload(req.file.path);
  // Assuming that 'path/file.txt' is a regular file.
  unlink(req.file.path, (err) => {
    if (err) throw err;
        console.log("path/file.txt was deleted");
    });
  res.send(response.url);
});

app.listen(PORT, () => {
  console.log(`server listening at port : ${PORT}`);
});
