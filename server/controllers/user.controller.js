const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports = {
    register: (req, res, next) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            domain: req.body.domain,
            salary: req.body.salary,
            password: req.body.password
        });
        user.save().then(result => {
            res.status(200).json({
                message: 'New user has been created'
            });
        }).catch(error => {
            next(error);
        });
    },

    login: (req, res, next) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        const JWTToken = jwt.sign({ email: user.email, _id: user._id }, process.env.SECRET_KEY, { expiresIn: '2h' });
                        return res.status(200).json({
                            message: 'Welcome to the App',
                            data: JWTToken
                        });
                    } else {
                        return res.status(401).json({
                            message: 'Unauthorized Access'
                        });
                    }
                } else {
                    return res.status(410).json({
                        message: `User doesn't exists`
                    });
                }
            })
            .catch(error => {
                next(error);
            });;
    }
} 