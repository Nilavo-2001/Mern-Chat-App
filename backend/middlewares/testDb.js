const User = require("../models/User");

const testDb = async () => {
    let users = await User.find({});
    console.log(users);
}

module.exports = testDb;