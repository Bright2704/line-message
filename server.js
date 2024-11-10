const express = require('express')
const axios = require('axios');
const app = express()
app.use(express.json())
app.use(express.static('login'))
const connectDB = require('./src/config/database')

require('dotenv').config();

const PORT = '3000'
connectDB();

const LINE_BOT_API = 'https://api.line.me/v2/bot'
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
const User = require('./src/models/userModel')


const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});


app.get('/login', (req, res) => {
    const liffUrl = "https://liff.line.me/2006545984-bnyRkq1E";
    res.redirect(liffUrl);
});

app.post('/save-user-profile', async (req, res) => {
    const { userId, displayName, pictureUrl, statusMessage } = req.body;

    if (!userId || !displayName) {
        return res.status(400).send({ status: 'error', message: 'Missing required fields.' });
    }

    try {
        let user = await User.findOne({ lineId: userId });

        if (!user) {
            user = new User({
                username: displayName,
                lineId: userId,
                profilePicture: pictureUrl,
                statusMessage: statusMessage
            });
            await user.save(); 
        }
        res.send({ status: 'success', message: 'User profile saved successfully' });
    } catch (error) {
        console.error('Error saving user profile:', error);
        res.status(500).send({ status: 'error', message: 'Error saving user profile' });
    }
});



app.post('/send-message', async (req, res) => {
    try {
      const { userId, message } = req.body;
      const body = {
        to: userId,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
        }

    const response = await axios.post(
        `${LINE_BOT_API}/message/push`,
         body, 
         { headers }
    )
    console.log('response:', response.data)
    res.send({
        status: 'success',
        message: response.data })
    } catch (error) {
        console.error('Error sending message:', error)
        res.status(500).send('Error sending message')
    }
})

app.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find();  

        res.send({ status: 'success', users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ status: 'error', message: 'Error fetching users' });
    }
});

module.exports = app;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
