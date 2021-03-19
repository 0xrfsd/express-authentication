let mongoose = require('mongoose');
let express = require('express');
let cors = require('cors');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const JWT_SECRET = 'c7b756n634456nv5n934nn'

let User = require('./User');

const password = 'CbL8VdfGTCQuwhUC'
const database = 'auth'
const server = `mongodb+srv://dbTech:${password}@cluster0.94tuo.mongodb.net/${database}?retryWrites=true&w=majority`
const config = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(server, config).then(() => {
    console.log('Database connection succesfully!')
})

const db = mongoose.connection;

const app = express();

app.use(cors());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Used to parse URL-encoded bodies

const PORT = 3000

app.get('/test', (req, res) => {
    console.log('Test is working bitch!')
})

app.post('/register', async (req, res) => {

    const username = req.body.username;
    const prePassword = req.body.password;

    const userExists = await User.findOne({ username }).lean()

    if(username.length == 0) {
        return res.json({ status: 'error', error: 'Your username cannot be null' })
    }

    if(userExists) {
        return res.json({ status: 'error', error: 'This user is already been registered' })
    } 

    if(prePassword.length < 8) {
        return res.json({ status: 'error', error: 'Your password must contain at least 8 characters' })
    }

    const password = await bcrypt.hash(prePassword, 10)

    const user = new User({
        username: username,
        password: password,
    })
    await user.save()

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        JWT_SECRET
    )

    return res.json({ status: 'ok', data: token })
})

// Add validators to /register POST [ min: 8, capitalRequired, numberRequired, userUnique ]
// And handle these errors typing what's required :)

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'This username does not exists'})
    }

    if (await bcrypt.compare(password, user.password)) {
        // the username, password combination is successful

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            JWT_SECRET
        )

        return res.json({ status: 'ok', data: token })
    } else {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

})

// app.post('/change-password', async (req, res) => {
//     const { token, newpassword } = req.body
//     try {
//         const user = jwt.verify(token, JWT_SECRET)
//         const _id = user.id

//         const hashedPassword = await bcrypt.hash(newpassword)
//         await User.updateOne({ _id }, {
//             $set: { password: hashedPassword }
//         }) 

//     } catch (error) {
//         res.json({status: 'error', error: ';))'})
//     }

//     console.log('JWT Decoded: ' + user)
//     res.json({ status: 'ok' })
// })

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})

// Mongose Model is a wrapper on the Mongose Schema
// Mongoose Model provies an interface to the database for creating, querying, updating, deleting, etc..

// Mongoose Schema defines the structure of the document, default values, validators, etc...

// ...

// Defining the Schema ./email.js

// let emailSchema = new mongoose.Schema({ email: String })

// Exporting a model

// module.exports = mongoose.model('Email', emailSchema)

// Instance of the model

// let EmailModel = require('./email')

// let msg = new EmailModel({ email: 'ricardo@gmail.com '})

// Lets add some rules to the schema