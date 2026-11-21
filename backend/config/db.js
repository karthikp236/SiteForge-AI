import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect("mongodb+srv://karthikeyap236_db_user:FK12TTdaUaaSqNdM@cluster0.zrgk0jx.mongodb.net/AI")
    .then(() => {
        console.log("DB Connected")
    });
};