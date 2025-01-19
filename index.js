const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
const cartRoute = require("./routes/cart.js");
const productRoute = require("./routes/product.js");
const paymentRoute = require("./routes/stripe.js");
const authRoutes = require("./routes/auth.js");

const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
));

app.use("/api/carts", cartRoute);
app.use("/api/checkout", paymentRoute);
app.use("/api/products", productRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
