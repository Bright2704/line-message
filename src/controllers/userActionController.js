const UserAction = require('../models/userActionModel');

// ฟังก์ชันสำหรับเก็บข้อมูลการกระทำของผู้ใช้
const storeUserAction = (userId, status) => {
    const userAction = new UserAction({ userId, actionStatus: status });
    return userAction.save()
        .then(res => {
            console.log('User action stored:', res);
        })
        .catch(err => {
            console.error('Error storing user action:', err);
        });
};

module.exports = {
    storeUserAction,
};
