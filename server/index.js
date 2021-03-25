require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Models
const User = require('./models/user');



const port = process.env.PORT;
const mongoUri = process.env.URI;
const server = express();

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose.set('useNewUrlParser', true);

// Connecting to mongodb
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Could not connect to Mongo.'));
db.once('open', () => {
    console.log('Connection to Mongo Established!');
})

server.get('/', (req, res) => {
    res.status(200).send('server is fine dont worry')
})


server.post('/create-user', (req, res) => {
    
    const incomingData = req.body;
    const newUser = new User(incomingData);
    
    newUser.save((err, user) => {
        if(err) {
            res.status(500).send({
                err: err,
                message: 'user wasnt created'
            })
        }
        res.status(200).send({
            message:'User was created',
            document: user
        })
    })

} ) 

server.listen(port, () => {
    console.log(`Listening on Port ${port}`);
})

// Insert many User_profiles Entries
// is is for your benefit if you ever need to have test data on your mongodb
server.post('/add-user', (req, res) => {
    const incomingData = req.body.users;

    User.insertMany(incomingData, (err, user) => {
        if (err) {
            res.status(500).send({
                status: 500,
                msg: 'Could not add user'
            });
        }

        res.status(200).send({
            status: 200,
            msg: 'All User.',
            document: user
        })
    });
});

server.get('/get-all-user', (req, res) => {
    User.find({}, (err, user) => {
        if (err) {
            res.status(500).send({
                status: 500,
                msg: 'No user'
            });
        }
        res.status(200).send({
            status: 200,
            msg: 'All User found',
            document: user
        });
    })
});
