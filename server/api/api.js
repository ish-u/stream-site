import jwt from "jsonwebtoken";
import express from "express";
import { v4 as uuid } from "uuid";
import User from "../model/user.js";

// Express Router
const router = express.Router();

// authentication middleware
const authenticateToken = (req, res, next) => {
  // getting the Access Token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      req.user = user;
      next();
    });
  }
};

// index route
router.get("/home", authenticateToken, (req, res) => {
  res.send(req.user);
});

// get signed user details
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne(
      { username: req.user.username },
      { password: 0, _id: 0 }
    );
    if (user !== null) {
      res.status(200);
      res.send(user);
    } else {
      res.sendStatus(701);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(701);
  }
});

// get a user details
router.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne(
      { username: req.params.username },
      { password: 0, _id: 0, streamKey: 0, email: 0 }
    );
    if (user !== null) {
      // finding a
      res.status(200);
      res.send(user);
    } else {
      res.sendStatus(701);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(701);
  }
});

// follow a user
router.patch("/follow/:username", authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user.username;
    const userToFollow = req.params.username;
    const currentUserDocument = await User.findOne({ username: currentUser });
    const userToFollowDocument = await User.findOne({
      username: userToFollow,
    });

    console.log(
      currentUser,
      currentUserDocument,
      userToFollow,
      userToFollowDocument
    );
    if (currentUserDocument !== null && userToFollowDocument !== null) {
      var currentUserFollowing = currentUserDocument.following;
      var userToFollowFollowers = userToFollowDocument.followers;
      if (
        !currentUserFollowing.includes(userToFollowDocument._id) &&
        !userToFollowFollowers.includes(currentUserDocument._id)
      ) {
        // updating user following
        console.log(currentUserFollowing, userToFollowFollowers);
        currentUserFollowing.push(userToFollowDocument._id);
        currentUserDocument.following = currentUserFollowing;
        await currentUserDocument.save();
        // updating followed user followers
        userToFollowFollowers.push(currentUserDocument._id);
        userToFollowDocument.followers = userToFollowFollowers;
        await userToFollowDocument.save();
        res.sendStatus(200);
      } else {
        res.sendStatus(701);
      }
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(701);
  }
});

// reset stream key
router.get("/reset-stream-key", authenticateToken, async (req, res) => {
  try {
    // finding the user document
    const user = await User.findOne({ username: req.user.username });
    if (user !== null) {
      // setting the new stram key and saving the document
      user.streamKey = uuid();
      await user.save((err, data) => {
        if (err) {
          res.sendStatus(701);
        } else {
          // saending the new stram key to the client
          res.status(200);
          res.send({
            streamKey: data.streamKey,
          });
        }
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(701);
  }
});

export default router;
