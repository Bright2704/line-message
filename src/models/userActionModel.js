const mongoose = require('mongoose');

// Schema สำหรับการเก็บข้อมูลการกระทำของผู้ใช้
const userActionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    actionStatus: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const UserAction = mongoose.model('UserAction', userActionSchema);

module.exports = UserAction;
