import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String, 
        required: true
    }, 

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    age: {
        type: Number,
    },

    password: {
        type: String,
        required: true
    },

    cart: {
       type: mongoose.Schema.Types.ObjectId, 
       ref: "carts"
    },

    role:{
        type: String,
        default: "user",
        enum: ["user", "admin"]
    }
})

const userModel = mongoose.model("users", userSchema)

export default userModel