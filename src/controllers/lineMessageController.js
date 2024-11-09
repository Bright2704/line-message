const axios = require('axios');
const { CHANNEL_ACCESS_TOKEN } = process.env;

// ฟังก์ชันส่งข้อความ LINE
const sendLineMessage = (userId, message) => {
    console.log(`Sending message to ${userId}: ${message}`);

    const url = 'https://api.line.me/v2/bot/message/push';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
    };
    const body = {
        to: userId,
        messages: [{
            type: 'text',
            text: message
        }]
    };

    return axios.post(url, body, { headers })
        .then(response => {
            console.log('Message sent:', response.data);
        })
        .catch(error => {
            console.error('Error sending message:', error);
            throw error;
        });
};

module.exports = {
    sendLineMessage,
};
