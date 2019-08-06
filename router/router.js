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
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
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

// POST /:id/comments
router.post("/:id/comments", (req, res) => {
  const commentInfo = req.body;
  const postId = req.params;
  if (commentInfo.text && commentInfo.post_id === postId.id) {
    Posts.findById(postId)
      .then(post => {
        if (post) {
          Posts.insertComment(commentInfo)
            .then(id => {
              res.status(201).json(id);
            })
            .catch(err => {
              res.status(500).json({
                error: "There was an error saving the comment to the database."
              });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error saving the comment to the database."
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
});

// PUT /api/posts/:id

// DELETE /api/posts/:id
router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then(count => {
      if (count && count > 0) {
        res.status(200).json({
          message: "The post was deleted."
        });
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

// export router
module.exports = router;
