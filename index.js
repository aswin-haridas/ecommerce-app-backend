const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()
const cartRoute = require("./routes/cart.js")
const paymentRoute = require("./routes/stripe.js")

const PORT = process.env.PORT || 3000

dotenv.config();

app.use(express.json({ limit: '10mb' }))
app.use(cors())

app.use('/api/carts', cartRoute);
app.use('/api/checkout', paymentRoute)

mongoose
    .connect(process.env.MONGO_URL)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})