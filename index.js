const express = require("express");
const users = require("./DATA.json");
const url = require("url");
const fs = require("fs");

const app = express();
const PORT = 8000;

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
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

// JSON
app.route('/api/users')
.get((req, res) => {
    return res.json(users);
})
.post((req,res) => {
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status : "Success", id: users.length});
    });
});

app.route('/api/users/:id')
.get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id == id);
    return res.json(user); 
})
.patch((req, res) => {

    // // getId stores the Id from the given Parameters in the URL.
    // const getId = Number(req.params.id);

    // // body stores the body in which we've to make changes.
    // const body = req.body;

    // // Finding the user Id from the user array.
    // const userIndex = users.findIndex((user) => user.id === getId);

    // // If we found a user with its Id then gotUser stores that object.
    // const gotUser = users[userIndex];

    // // Here gotUser has the user Object and body has the changes we have to made.
    // const updatedUser = {...gotUser,...body};

    // // After Merging them, Update the users Array.
    // users[userIndex] = updatedUser;

    const id = Number(req.params.id);
    const userID = users.findIndex((user) => user.id == id);
    const body = req.body;

    const gotUser = users[userID];
    const updatedUser = {...gotUser,...body};

    users[userID] = updatedUser;

    // Lastly, write the changes into the json file.
    fs.writeFile('./DATA.json', JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", updatedUser});
    })
})
.delete((req,res) => {

    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id == id);
    
    const delUser = users.splice(userIndex,1)[0];

    fs.writeFile('./DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status: "Deleted Successfully",delUser});
    });
});


app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});
