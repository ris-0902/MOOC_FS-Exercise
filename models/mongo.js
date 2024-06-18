const mongoose = require('mongoose')


const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(res => {
        console.log(`connected to MONGODB`);
    })
    .catch(err => {
        console.log(`error connecting to MONGODB`, err.message);
    })

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: [numberValidator, `Number should have length of 8 or more and formed of two parts that are separated by -, 
            the first part has two or three numbers and the second part also consists of numbers`]
    }
})
function numberValidator(str) {
    let check = false;
    if (str.length < 8) return false
    for (let i = 0; i < str.length; i++) {
        let x = str[i]
        if (x >= '0' && x <= '9') continue;
        else {
            if (x=='-' && !check && (i==2||i==3)) {
                check = true; 
                continue
            }
            return false
        }
    }
    return check
}

phoneSchema.set('toJSON', {
    transform: (doc, resObj) => {
        resObj.id = resObj._id.toString()
        delete resObj._id
        delete resObj.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)