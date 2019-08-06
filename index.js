const express = require("express");
const server = express();
server.use(express.json());

const postsRouter = require("./router/router");
server.use("/api/posts", postsRouter);

server.listen(8000, () => console.log("api running"));
