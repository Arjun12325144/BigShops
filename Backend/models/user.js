const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // used from password hashing

const userSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],

        },
        password: {
            type:String,
            required:true,
            minLength:6,
        },
        role:{
            type:String,
            enum:["customer","admin"],
            default:"customer",
        }
    },
    {timestamps: true} //This option automatically adds createdAt and updatedAt fields to your documents.
);

//password hash middleware
userSchema.pre("save", async function(next){  //pre('save'): Runs before saving a document
    if( !this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// match user entered password to hashed password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
};

module.exports = mongoose.model("User", userSchema);
