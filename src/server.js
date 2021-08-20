import express from "express";
import cors from "cors";
import { join } from "path";
import process from "process";
import blogPostsRouter from "../services/blogPosts/blogPosts.js";

const server = express();
const { PORT } = process.env;

// const whiteList = [];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whiteList.some((allowedUrl) => allowedUrl === origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Origin not allowed"));
//     }
//   },
// };

const publicFolderPath = join(process.cwd(), "public");

server.use("/public", express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use("/blogPosts", blogPostsRouter);

server.listen(PORT, console.log("server is running"));
