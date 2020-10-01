//Start of project


const express = require('express');
const db = require('./database');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.json({ message: 'This is my homework assignment'})
})

server.get('/api/users', (req, res) => {
    const users = db.getUsers();
    res.status(200).json(users);
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);

    if (user) {
        res.json(user);
    } else if(!user) {
        res.status(404).json({
            message: "The user does not exist"
        });
    } else {
        res.status(500).json({
            message: "There was an error retrieving the user"
        })
    }
})

server.post('/api/users', (req, res) => {
    const {name, bio} = req.body;
    if (name && bio) {
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio
        });
        res.status(201).json(newUser).end();
    } else if (!name || !bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user."
        });
    } 
    else {
        res.status(500).json({
            message: "There was an error while saving the user to the database."
        });
    }
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);

    if (user) {
        db.deleteUser(id);
        res.status(204).end();
    } else if (!user) {
        res.status(404).json({
            message: "The user does not exist"
        })
    } else {
        res.status(500).json({
            message: "There was an error deleting the user"
        })
    }
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);
    const {name, bio} = req.body;

    if (user) {
        const updatedUser = db.updateUser(id, {
            name: req.body.name,
            bio: req.body.bio
        })
        res.status(200).json(updatedUser);
    } else if (!user) {
        res.status(404).json({
            message: "User not found."
        })
    } else if (!name || !bio) {
        res.status(400).json({
            message: "Please provide a name and bio for the user."
        })
    } else {
        res.status(500).json({
            message: "There was an error updating the user information"
        })
    }
})


server.listen(8080, () => {
    console.log('server started')
});