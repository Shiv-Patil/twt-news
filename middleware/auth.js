const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// what is the use of this then - to protect routes where only " logged in " users are allowed
const protectRoute = (req, res, next) => {
	const token = req.cookies.jwt;

	// making sure token exists in the cookies
	if (token) {
		// verify the token signature
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			// wrong jwt token ( token has been tampered with or has expired )
			if (err) {
				console.log("INVALID token, redirecting to login page");
				res.redirect("/auth");
			}
			// best case scenario ( everything is perfect )
			else {
				console.log("FOUND token, continue");
				next();
			}
		});
	}
	// if token does not exist in cookies, then go to home page, coz home page should be accessible without logging in too
	else {
		console.log("NO token found, redirectig to homepage");
		res.redirect("/posts");
	}
};

const setUserInfo = async (req, res, next) => {
	const token = req.cookies.jwt;

	// making sure token exists in the cookies
	if (token) {
		// verify the token signature
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			// wrong jwt token ( token has been tampered with or has expired )
			// set user to null
			if (err) {
				console.log("INVALID token found - anonymous user");
				res.locals.user = { name: "anonymous" };
				next();
			}
			// best case scenario ( everything is perfect )
			else {
				// find user in db, populate user info in res.locals.user
				const user = await User.findById(decodedToken.id);
				res.locals.user = user;
				console.log("FOUND token, setting user to user found in db");
				next();
			}
		});
	}
	// if token does not exist in cookies, then set user to null, and go to next middleware
	else {
		console.log("INVALID user found - anonymous user");
		res.locals.user = { name: "anonymous" };
		next();
	}
};

module.exports = { protectRoute, setUserInfo };
