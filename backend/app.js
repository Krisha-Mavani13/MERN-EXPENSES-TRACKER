const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter.js");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const app = express();

//connect to mongodb
mongoose
  .connect("mongodb://localhost:27017/mern-expenses")
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

//cors config
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

//Middlewares
app.use(express.json());

//Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);

//ERROR
app.use(errorHandler);

//start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on this port ${PORT}`));
