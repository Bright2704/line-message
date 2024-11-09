
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// เรียกใช้ controller
const { registerUser } = require('./src/controllers/userController');
const { sendLineMessage } = require('./src/controllers/lineMessageController');
const { storeUserAction } = require('./src/controllers/userActionController');
const mongoose = require('mongoose');
const UserAction = require('./src/models/userActionModel');

const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB successfully!');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use(bodyParser.json());

// เสิร์ฟไฟล์ registry.html เมื่อเข้าถึง /register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registry.html'));
});

let selectedUserId = null; // ตัวแปรสำหรับเก็บ User ID ที่เลือก

// เส้นทางสำหรับการสมัครสมาชิก
app.post('/register', registerUser);

// เส้นทางสำหรับการคลิก
app.get('/click/:number', (req, res) => {
    const number = req.params.number;
    const responseMessage = `Process_Success 😊`;

    if (!selectedUserId) { // ตรวจสอบว่ามีการเลือก User ID แล้วหรือไม่
        return res.status(400).send('Please select a User ID first.'); // หากยังไม่เลือก ให้ส่งสถานะ 400
    }

    sendLineMessage(selectedUserId, responseMessage)
        .then(() => {
            res.send(`Process ${number} completed!`);
            storeUserAction(selectedUserId, 'Success');
        })
        .catch(error => {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending message');
        });
});

// เสิร์ฟไฟล์ index.html เมื่อเข้าถึง /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// เส้นทางสำหรับดึง User IDs
app.get('/user-ids', (req, res) => {
    UserAction.find({}, 'userId')
        .then(userActions => {
            const userIds = userActions.map(action => action.userId);
            res.json(userIds);
        })
        .catch(err => {
            console.error('Error fetching user IDs:', err);
            res.status(500).send('Error fetching user IDs');
        });
});

// เส้นทางสำหรับการเลือก User ID
app.post('/select-user/:userId', (req, res) => {
    selectedUserId = req.params.userId;
    res.send(`User selected: ${selectedUserId}`);
});

app.post('/send-message/:userId', (req, res) => {
    const userId = req.params.userId;
    const message = req.body.message; // รับข้อความจาก body ของคำขอ

    if (!selectedUserId) {
        return res.status(400).send('Please select a User ID first.');
    }

    sendLineMessage(userId, message) // ส่งข้อความไปยัง user
        .then(() => {
            res.send('Message sent successfully');
        })
        .catch(error => {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending message');
        });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
