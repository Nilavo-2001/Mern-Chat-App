
const getSender = (loggedUser, users) => {
    // console.log("get Sender: ", users);
    return (users[0]._id == loggedUser._id) ? (users[1].name) : (users[0].name);
}

const getSenderFull = (loggedUser, users) => {
    return (users[0]._id == loggedUser._id) ? (users[1]) : (users[0]);
}

const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 8);
};




export { getSender, getSenderFull, generateRandomString }