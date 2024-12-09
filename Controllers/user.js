const User = require("../Models/user")

async function getAllUsers(req, res) {
    const allUsers = await User.find({});
    return res.json(allUsers);
}

async function createUser(req, res) {
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
    return res.status(201).json({message : "success", id: res._id});
}

async function getUserbyID(req, res) {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({status : "Not Found", message : "No user exsist"});
    }
    return res.json(user); 
}

async function updateUser(req, res) {
    await User.findByIdAndUpdate(req.params.id, {firstName: "Changed"});
    return res.json({ status: "Success"});
}

async function deleteUser(req, res) {
    await User.findByIdAndDelete(req.params.id);
    return res.json({status: "Deleted Successfully"});
}


module.exports = {
    getAllUsers,
    createUser,
    getUserbyID,
    updateUser,
    deleteUser,
};