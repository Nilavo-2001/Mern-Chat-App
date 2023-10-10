const expressAsyncHandler = require("express-async-handler")
const User = require("../models/User");
const { use } = require("../routes/user");
const generateToken = require("../utilities/tokenGenerator");
const bcrypt = require('bcrypt');
//const Chat = require("../models/Chat");
const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, confirmpassword, pic } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !confirmpassword) {
        throw new Error("Pls Enter all the fields");
        return res.status(400);
    }
    if (password != confirmpassword) {
        res.status(400);
        throw new Error("Password and confirm password are different");
    }

    const checkUser = await User.findOne({ email });

    if (checkUser) {
        res.status(400);
        throw new Error("User already exsists");
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        name, email, password: hash, pic
    })

    if (newUser) {
        return res.status(200).json({
            id: newUser._id,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id)
        })
    }
    else {
        res.status(400);
        throw new Error("Failed to create user")
    }

}
);
const loginUser = expressAsyncHandler(
    async (req, res) => {
        const { email, password } = req.body;
        const checkUser = await User.findOne({ email });
        if (checkUser && await bcrypt.compare(password, checkUser.password)) {
            return res.status(200).json({
                id: checkUser._id,
                name: checkUser.name,
                email: checkUser.email,
                pic: checkUser.pic,
                token: generateToken(checkUser._id)
            });
        }
        else {
            return res.status(401).send("Invalid email or password");
        }
    }
)

const searchUsers = expressAsyncHandler(async (req, res) => {
    const userInfo = req.query.search;
    const id = req.user._id;
    /* return all users whose name or email has userInfo as a substring , 
     except for the current user , also make sure to remove password
    */
    const users = await User.find({
        $and: [
            { name: { $regex: userInfo, $options: 'i' } },
            { _id: { $ne: id } }
        ]
    }).limit(10).select("-password");
    res.status(200).send(users);
})




module.exports = { registerUser, loginUser, searchUsers };