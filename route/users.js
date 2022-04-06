const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");

//update user
router.put("/:id", async (req, res) => {
  if (req.params.id !== req.body.userId && !req.body.isAdmin) {
    res.status(403).json("You can update only your account");
    return;
  }

  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.status(200).json("Account has been upadated");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.params.id !== req.body.userId && !req.body.isAdmin) {
    return res.status(403).json("You can delete only your account");
  }

  try {
    await User.findByIdAndDelete(req.body.userId);
    res.status(200).json("Account has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user
router.get("/", async (req, res) => {
  const username = req.query.username;
  const userId = req.query.userId;

  try {
    const user = username
      ? await User.findOne({ username })
      : await User.findById(userId);

    if (!user) return res.status(403).json("User not found");

    const { password, updatedAt, ...filterFieldUser } = user._doc;
    res.status(200).json(filterFieldUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//follow a user
router.put("/follow/:id", async (req, res) => {
  if (req.body.userId === req.params.id)
    return res.status(403).json("You can't follow yourself");

  try {
    const currentUser = await User.findById(req.body.userId);
    const otherUser = await User.findById(req.params.id);

    if (currentUser.followings.includes(otherUser._id))
      return res.status(403).json("You alredy followed this user");

    await currentUser.updateOne({ $push: { followings: otherUser._id } });
    await otherUser.updateOne({ $push: { followers: currentUser._id } });

    res.status(200).json("User followed");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//unfollow a user
router.put("/unfollow/:id", async (req, res) => {
  if (req.body.userId === req.params.id)
    return res.status(403).json("You can't unfollow yourself");

  try {
    const currentUser = await User.findById(req.body.userId);
    const otherUser = await User.findById(req.params.id);

    if (!currentUser.followings.includes(otherUser._id))
      return res.status(403).json("You didn't follow this user");

    await currentUser.updateOne({ $pull: { followings: otherUser._id } });
    await otherUser.updateOne({ $pull: { followers: currentUser._id } });

    res.status(200).json("User unfollowed");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get friends
router.get("/friends/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const friendsId = [...new Set([...user.followers, ...user.followings])];
    const userFriends = await User.find(
      {
        _id: { $in: friendsId },
      },
      { username: 1, profilePic: 1 }
    );

    res.status(200).json(userFriends);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
