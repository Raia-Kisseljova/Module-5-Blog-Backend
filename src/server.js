import express from "express";
import cors from "cors";
import { join } from "path";
import process from "process";
import blogPostsRouter from "../services/blogPosts/blogPosts.js";
const server = express();
const { PORT } = process.env;

const publicFolderPath = join(process.cwd(), "public");

server.use("/public", express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use("/blogPosts", blogPostsRouter);

server.listen(3001, console.log("server is running"));
