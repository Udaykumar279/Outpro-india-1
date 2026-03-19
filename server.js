require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 3000;
console.log("MONGO_URI:" , process.env.MONGO_URI);


//  Middleware
app.use(cors({
  origin: "https://outpro-india-2.vercel.app" 
}));
app.use(express.json());    


//  Database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB is connected"))
.catch(err => console.log(err));


//  Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  message: String,
  phone: String
});

const User = mongoose.model("User", userSchema);


//  API
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // validation
    if (!name || !email || !phone || !message) {
      return res.json({ message: "Fill all the fields" });
    }

    // check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // create user
    const newUser = new User({             
      name,
      email,
      phone,
      message
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


//  Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
