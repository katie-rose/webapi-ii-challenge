const router = require("express").Router();

const Posts = require("../data/db");

router.get("/", (req, res) => {
  res.status(200).json(posts);
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(() => {
        res.status(500).json({
          message: "There was an error while creating the post."
        });
      });
  }
});

// Delete  post api/posts/:id
router.delete("/:id", (req, res) => {
  res.send("Deleting a post");
});

// export router
module.exports = router;
