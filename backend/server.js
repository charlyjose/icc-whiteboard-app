const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const BE_PORT = require("./app/config/env.json").backend.port
const FE_IP = require("./app/config/env.json").frontend.ip
const FE_PORT = require("./app/config/env.json").frontend.port

const app = express()

var corsOptions = {
    origin: `${FE_IP}:${FE_PORT}`
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))


const db = require("./app/models")
const Role = db.role

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    })


function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            })

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            })

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            })
        }
    })
}

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/drawing.routes')(app)
require('./app/routes/whiteboard.routes')(app)
require('./app/routes/syncDrawing.routes')(app)

app.get("/", (req, res) => {
    res.json({ message: "Welcome to WHITEBOARD Application" })
})

const PORT = process.env.PORT || BE_PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})