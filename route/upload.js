const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/image/post");
  },

  filename: (req, file, cb) => {
    cb(null, req.body.postIdAndImageFormat);
  },
});

const upload = multer({ storage });

router.post("/post", upload.single("file"), async (req, res) => {
  try {
    res.status(200).json("file uploaded");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
