const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier");
require("dotenv").config();

const router =express.Router();
// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer setup using memory storage


const storage = multer.memoryStorage();
const upload = multer({ storage })
router.post("/",upload.single("image"),async (req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message: "No file uploaded"});
        }

        //function to handle the stream upload to cloudinary
        const streamUpload = (fileBuffer)=>{
            return new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream((error,result)=>{
                    if(result){
                        resolve(result)
                    }
                    else{
                        reject(error);
                    }
                });
                // use streamifier to convert file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        // call the streamuplaod function
        const result = await streamUpload(req.file.buffer);

        //respond with the uploaded image url
        res.json({imageUrl: result.secure_url});



    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
})

module.exports = router;