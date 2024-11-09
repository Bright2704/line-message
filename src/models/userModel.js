const mongoose = require('mongoose');

// Schema สำหรับผู้ใช้
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    lineId: { type: String, required: true }, // LINE ID
    userId: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, // สร้าง userId
});

const User = mongoose.model('User', userSchema);

module.exports = User;
