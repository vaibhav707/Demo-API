const express = require("express");
const {getAllUsers, createUser, getUserbyID, updateUser, deleteUser} = require("../Controllers/user")

const router = express.Router();

// Routing 1 
router.route('/')
.get(getAllUsers)
.post(createUser);

// Routing 2
router.route('/:id')
.get(getUserbyID)
.patch(updateUser)
.delete(deleteUser);

module.exports = router;