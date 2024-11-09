const User = require('../models/userModel');

// API สำหรับสมัครสมาชิก
const registerUser = (req, res) => {
    const { username, password, lineId } = req.body;

    if (!username || !password || !lineId) {
        return res.status(400).send('All fields are required.');
    }

    const newUser = new User({ username, password, lineId });

    newUser.save()
        .then(user => {
            res.status(201).send({ message: 'User registered successfully', userId: user.userId });
        })
        .catch(error => {
            console.error('Error registering user:', error);
            res.status(500).send('Error registering user');
        });
};

module.exports = {
    registerUser,
};
