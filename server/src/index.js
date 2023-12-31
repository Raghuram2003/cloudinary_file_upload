import express from "express";
import { config } from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs";
import { PrismaClient } from "@prisma/client";
config();

const app = express();
const prisma = new PrismaClient();
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
  const newFile = await prisma.file.create({
    data : {
      fileURL : response.url
    }
  })
  const allFiles = await prisma.file.findMany();
  console.dir(allFiles, { depth: null });
  unlink(req.file.path, (err) => {
    if (err) throw err;
    console.log("path/file.txt was deleted");
  });
  res.send(newFile);
});

app.get("/api/images",async (req,res)=>{
  const allFiles = await prisma.file.findMany();
  res.send(allFiles);
})

app.listen(PORT, () => {
  console.log(`server listening at port : ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing server, disconnecting from Prisma, and exiting...');
  await prisma.$disconnect().then(()=>console.log('prisma disconnected'))
  
  process.exit(0);

});

