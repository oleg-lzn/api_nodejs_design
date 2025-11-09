import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  res.status(201).json({ message: "user Signed up" });
});

router.post("/login", (req, res) => {
  res.status(200).json({ message: "user Signed in" });
});

export default router;

// Sign Up

// get the password and email from and the confirmation from the client
// validate the data
// Go to the database and check, that there is no user with the same email
// hash the password
// go to the database and create a new user there, using the data + hashed password
// Create a token for the user
// Return the token for the user or put it to the cookies in case it's a web.
// Sign in

// Sign in

// get the password and the email from the form
// validate the data
// go to the database and find this user, return his hashed password
// Check the password in the databse with the password that the user provided using bcrypt compare
// Create the user's token for the upcoming requests
// Set the token to the cookie, using res.cookie ({ httpOnly: true, secure: true })
