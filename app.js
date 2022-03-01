// imports
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
// route handlers
const postsRouter = require("./routes/post.route");
const oauthRouter = require("./routes/oauth.route");

const { setUserInfo } = require("./middleware/auth");

// uri of the database
const PORT = process.env.PORT;
const dbURI = process.env.DBURI.toString();

mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoIndex: true,
	})
	.then((result) => {
		app.listen(PORT);
		console.log(`listening on http://localhost:${PORT} \nConnected to DB`);
	})
	.catch((err) => console.log(err));

// setting the view engine as ejs
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// access request cookies from req.cookies
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

// auth middleware
app.get("*", setUserInfo);

app.get("/", (req, res) => {
	res.redirect("/posts");
});

// route handlers for posts and auth
app.use("/posts", postsRouter);
app.use("/auth", oauthRouter);
app.use(errorHandler);

app.use((req, res) => {
	res.status(404).send("Find a route which exists noob");
});
