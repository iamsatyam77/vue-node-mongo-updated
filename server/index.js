require('./config/config');
require('./config/db');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();

const user = require('./routes/user.routes');
const employees = require('./routes/employee.routes');

//Midlleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

//Routes
app.use('/api/user', user);
app.use('/api/employees', validateUser, employees);

if (process.env.NODE_ENV === 'production') {
    // Vue dist folder
    app.use(express.static(path.join(__dirname + '/dist')));

    // Send all other requests to client
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname + '/dist/index.html'));
    });
}

// error handler
app.use((err, req, res, next) => {
    console.log(err.code)
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).message({message: valErrors});
    } else if (err.code == 11000) {
        res.status(409).json({message: 'User email already exists'});
    } else {
        console.log(err);
        res.status(500).json({message: "Something looks wrong :( !!!"});
    }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));