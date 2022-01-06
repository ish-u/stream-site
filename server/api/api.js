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
  console.log("NEW");
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

// unfollow a user
router.patch("/unfollow/:username", authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user.username;
    const userToUnfollow = req.params.username;
    const currentUserDocument = await User.findOne({ username: currentUser });
    const userToUnfollowDocument = await User.findOne({
      username: userToUnfollow,
    });
    if (currentUserDocument !== null && userToUnfollowDocument !== null) {
      var currentUserFollowing = currentUserDocument.following;
      var userToUnfollowFollowers = userToUnfollowDocument.followers;
      if (
        currentUserFollowing.includes(userToUnfollowDocument._id) &&
        userToUnfollowFollowers.includes(currentUserDocument._id)
      ) {
        // updating user following
        var index = currentUserFollowing.indexOf(userToUnfollowDocument._id);
        console.log(index);
        currentUserFollowing.splice(index, 1);
        currentUserDocument.following = currentUserFollowing;
        await currentUserDocument.save();
        // updating followed user followers
        var index = userToUnfollowFollowers.indexOf(currentUserDocument._id);
        console.log(index);
        userToUnfollowFollowers.splice(index, 1);
        userToUnfollowDocument.followers = userToUnfollowFollowers;
        await userToUnfollowDocument.save();
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

// get the followers
router.get("/followers/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user !== null) {
      console.log(user.followers);
      const followers = await User.find({ _id: { $in: user.followers } });
      console.log(followers);
      res.status(200);
      res.send(followers);
    } else {
      res.sendStatus(701);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(701);
  }
});

// get following
router.get("/following/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user !== null) {
      console.log(user.following);
      const following = await User.find(
        { _id: { $in: user.following } },
        { password: 0, _id: 0, streamKey: 0, email: 0 }
      );
      res.status(200);
      res.send(following);
    } else {
      res.sendStatus(701);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(701);
  }
});

// search
router.get("/search/:username", async (req, res) => {
  try {
    const users = await User.find({
      username: new RegExp(req.params.username),
    });
    if (users !== null) {
      res.status(200);
      res.send(users);
    } else {
      res.sendStatus(701);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(701);
  }
});

// change title
router.patch("/set-title/:title", authenticateToken, async (req, res) => {
  try {
    // finding the user document
    const user = await User.findOne({ username: req.user.username });
    if (user !== null && req.params.title !== null) {
      //setting the stream title
      user.streamTitle = req.params.title;
      await user.save((err, data) => {
        if (err) {
          res.sendStatus(701);
        } else {
          // sending the new title to the client
          res.status(200);
          res.send({
            title: data.streamTitle,
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(701);
  }
});

// reset stream key
router.patch("/reset-stream-key", authenticateToken, async (req, res) => {
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
          // sending the new stram key to the client
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
