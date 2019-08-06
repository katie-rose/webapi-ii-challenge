const router = require("express").Router();

const Posts = require("../data/db");

// GET posts
router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET /api/posts/:id

// GET /api/posts/:id/comments

// POST title + content for post
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

// POST comments
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then(post => {
      if (post.length) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// PUT /api/posts/:id

// DELETE /api/posts/:id
router.delete("/:id", (req, res) => {
  res.send("Deleting a post");
});

// export router
module.exports = router;
