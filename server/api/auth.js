import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import gravatar from "gravatar";
import { v4 as uuidv4 } from "uuid";
import User from "../model/user.js";

// Express Router
const router = express.Router();

// sign in route
router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // checking if the user exists or not
  try {
    const user = await User.findOne({ username: username });
    if (user !== null) {
      // checking if the password is valid
      const valid = await bcrypt.compare(password, user.password);
      // sending the access token to the user
      if (valid) {
        res.send({
          token: jwt.sign(
            { username: user.username },
            process.env.ACCESS_TOKEN_SECRET
          ),
        });
      } else {
        res.sendStatus(701);
      }
    } else {
      res.sendStatus(701);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(701);
  }
});

// sign up route
router.post("/signup", async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    // checking if the user already exists
    var data = await User.findOne({ username: username });
    if (data === null) {
      // creating encyrpted password
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      // Creating a new User Document
      const user = new User({
        name: name,
        username: username,
        password: encryptedPassword,
        email: email,
        profile:
          "https:" +
          gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "identicon",
          }),
        streamKey: uuidv4(),
      });

      // logging the phone
      console.log(user);

      // saving the new User Document
      await user.save((err, data) => {
        console.log(data);
        if (err) {
          res.sendStatus(701);
        } else {
          res.sendStatus(200);
        }
      });
    } else {
      res.sendStatus(701);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(701);
  }
});

// route to veify the stream key
router.post("/verfiy", async (req, res) => {
  try {
    // streamkey
    const streamkey = req.body.key;
    const user = await User.findOne({ username: req.body.name });
    if (user !== null && user.streamKey === streamkey) {
      res.sendStatus(200);
      return;
    }
    // rejecting the ability to stream if incorrect stream key is given
    res.sendStatus(403);
  } catch (e) {
    console.log(e);
    res.sendStatus(701);
  }
});

// exporting the router
export default router;