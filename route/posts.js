const router = require("express").Router();
const bcrypt = require("bcrypt");
const Post = require("../model/Post");
const User = require("../model/User");

//create post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  post.image = "/image/post/" + post._id + "." + req.body.format;

  try {
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.body.userId !== post.userId)
      return res.status(403).json("You can only update your post");

    await post.updateOne({ $set: req.body });
    res.status(201).json("The post has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.body.userId !== post.userId)
      return res.status(403).json("You can only delete your post");

    await post.deleteOne();
    res.status(200).json("The post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//like && dislike post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post disliked");
    } else {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post like");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like && dislike post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all user's posts
router.get("/profile/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    const userPosts = await Post.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//timeline
router.get("/all/timeline/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userAndFriendsPosts = await Post.find({
      userId: { $in: [user._id, ...user.followings] },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(userAndFriendsPosts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
