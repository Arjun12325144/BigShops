const mongoose  = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfuly");
    }
    catch(err){
        console.log("failed", err);
        process.exit(1)
    }
}
module.exports = connectDB;