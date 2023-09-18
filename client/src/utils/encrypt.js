var CryptoJS = require("crypto-js");



const encStr = (str) => {
    var ciphertext = CryptoJS.AES.encrypt(str, 'secret key 123').toString();
    return ciphertext;
}

const decStr = (str) => {
    var bytes = CryptoJS.AES.decrypt(str, 'secret key 123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

const encObj = (data) => {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
    return ciphertext;
}
const decObj = (str) => {
    var bytes = CryptoJS.AES.decrypt(str, 'secret key 123');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}

export { encStr, decStr, encObj, decObj };

