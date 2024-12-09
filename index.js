const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

// Connection

mongoose
.connect("mongodb://127.0.0.1:27017/demo-api")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Error", err));

// Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    carModel: {
        type: String,
    }
}, {timestamps : true}
);

// Model
const User = mongoose.model('user', userSchema);

// Middleware : Plugin
app.use(express.urlencoded({extended : false}));

// Middleware 1
app.use((req, res, next) => {
    fs.appendFile('log.txt', `\n${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`, () => {
        next();
    });
});

app.get('/', (req, res) => {
    return res.end("Homepage");
});

// HTML doc
app.get('/users', async(req, res) => {
    const allUsers = await User.find({});
    const html = `
    <ul>
        ${allUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

// Routing 1 
app.route('/api/users')
.get(async(req, res) => {
    const allUsers = await User.find({});
    return res.json(allUsers);
})
.post(async(req,res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.car_model){
        return res.status(400).json({status : "Bad Request", message : "All entries required"});
    }
    await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        carModel: body.car_model,
    });
    return res.status(201).json({message : "success"});
});

// Routing 2
app.route('/api/users/:id')
.get(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({status : "Not Found", message : "No user exsist"});
    }
    return res.json(user); 
})
.patch(async(req, res) => {
    await User.findByIdAndUpdate(req.params.id, {firstName: "Changed"});
    return res.json({ status: "Success"});
})
.delete(async(req,res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({status: "Deleted Successfully"});
});


app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});
