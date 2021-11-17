const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()


var corsOptions = {
    origin: "http://localhost:8088"
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


// Import DB Models
const db = require("./app/models")
db.seqelize.sync({ force: true }).then(() => {
    console.log("Drop and Re-Sync DB")
})

// Import Routes
require("./app/routes")(app)


app.get("/", (req, res) => {
    res.json({ message: "Welcome to Todo App" })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})