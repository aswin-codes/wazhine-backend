const express = require("express")
const cors = require('cors')
const authRouter = require('./Router/authRouter')
const laundriesRouter = require('./Router/laundries')
const reviewRouter = require('./Router/review')
const server = express();


//Middle Ware
server.use(express.json())
server.use(cors())

//test endpoint
server.get('/api/test',(req,res) => {
    res.json({
        "msg" : "Hello"
    })
})

server.use('/auth',authRouter);
server.use('/laundries',laundriesRouter)
server.use('/reviews',reviewRouter)

server.listen(3000,() => {
    console.log("Server is listing on port 3000")
})