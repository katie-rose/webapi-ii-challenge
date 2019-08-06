const router = require("express").Router();

// only runs with url begins with /api/posts
router.get("/", (req, res) => {
  res.status(200).json(posts);
});

// Create a post
router.post("/", (req, res) => {
  const post = req.body;
  if (post.title) {
    posts.push(post);
    res.status(201).json(posts);
  } else {
    res.status(400).json({ message: "This post was not found" });
  }
});

// Delete  post api/posts/:id
router.delete("/:id", (req, res) => {
  res.send("Deleting a post");
});

// export router
module.exports = router;
