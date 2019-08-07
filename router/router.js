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
    .then(post => {
      if (post) {
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

// GET /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
        Posts.findCommentById(req.params.id)
          .then(comments => {
            if (comments.length > 0) {
              res.status(200).json(comments);
            } else {
              res.status(404).json({
                message: "The post with the specified ID does not exist"
              });
            }
          })
          .catch(err => {
            res.status(500).json({
              error: "The comments information could not be retrieved."
            });
          });
});

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
  const { id } = req.params;
  if (commentInfo.text && commentInfo.post_id) {
    Posts.findById(id)
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
router.put("/:id", (req, res) => {
  const changes = req.body;
  const id = req.params.id;
  Posts.findById(id)
    .then(post => {
      if (post.length > 0) {
        if (changes.title && changes.contents) {
          Posts.update(id, changes)
            .then(updated => {
              Posts.findById(id)
                .then(updatedPost => {
                  res.status(200).json(updatedPost);
                })
                .catch(err => {
                  res.status(500).json({ message: "Error modifying data" });
                });
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: "The post information could not be modified." });
            });
        } else {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post"
          });
        }
      } else {
        res
          .status(404)
          .json({ message: "The post with that ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

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

module.exports = router;
