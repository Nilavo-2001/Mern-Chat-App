
const getSender = (loggedUser, users) => {
    // console.log("get Sender: ", users);
    return (users[0]._id == loggedUser._id) ? (users[1].name) : (users[0].name);
}

const getSenderFull = (loggedUser, users) => {
    return (users[0]._id == loggedUser._id) ? (users[1]) : (users[0]);
}


export { getSender, getSenderFull }