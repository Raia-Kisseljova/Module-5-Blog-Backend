import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { saveCoverCloudinary } from "../fs-tools/fs-tools.js";
import multer from "multer";

import { Router } from "express";
import fse from "fs-extra";
import uniqid from "uniqid";
import { PORT, PUBLIC_URL } from "../config.js";
import { postValidation } from "../../validation.js"; //Validation for post
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
// });
// const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

// cloudinary.config({
//   cloud_name: CLOUDINARY_NAME,
//   api_key: CLOUDINARY_KEY,
//   api_secret: CLOUDINARY_SECRET,
// });

// const parseFile = multer({ storage });

const blogPostsRouter = Router();

export const blogsPath = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "data",
  "posts.json"
);

// GET /blogPosts => returns the list of blogposts
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await fse.readJSON(blogsPath);
    res.send(blogs);
  } catch (err) {
    next(err);
  }
});

// GET /blogPosts /123 => returns a single blogpost
blogPostsRouter.get("/:id", async (req, res, next) => {
  try {
    const blogs = await fse.readJSON(blogsPath);
    const blogById = blogs.find((blog) => blog.id == req.params.id);
    if (blogById !== undefined) {
      res.send(blogById);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

// POST /blogPosts => create a new blogpost
blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const blogs = await fse.readJSON(blogsPath);
    const newBlog = { ...req.body, id: uniqid(), createdAt: new Date() };
    blogs.push(newBlog);
    await fse.writeJSON(blogsPath, blogs);
    res.send({ id: newBlog.id });
  } catch (err) {
    next(err);
  }
});

// PUT /blogPosts /123 => edit the blogpost with the given id
blogPostsRouter.put("/:id", async (req, res, next) => {
  try {
    const blogs = await fse.readJSON(blogsPath);
    const oldBlog = blogs.find((blog) => blog.id === req.params.id);
    if (oldBlog === undefined) {
      res.status(404).send();
      return;
    }
    const newBlog = {
      ...req.body,
      id: oldBlog.id,
      createdAt: oldBlog.createdAt,
    };
    const newBlogs = blogs.filter((blog) => blog.id !== req.params.id);
    newBlogs.push(newBlog);
    await fse.writeJSON(blogsPath, newBlogs);
    res.send(newBlog);
  } catch (err) {
    next(err);
  }
});

// DELETE /blogPosts /123 => delete the blogpost with the given id
blogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
    const blogs = await fse.readJSON(blogsPath);
    const filteredBlogs = blogs.filter((blog) => blog.id !== req.params.id);
    await fse.writeJSON(blogsPath, filteredBlogs);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

const blogPicsPublicURL = `${PUBLIC_URL}/img/blog-images`;

const folderForBlogImg = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../",
  blogPicsPublicURL
);

export const saveBlogPic = (filename, contentBuffer) =>
  fse.writeFile(join(folderForBlogImg, filename), contentBuffer);

blogPostsRouter.post(
  "/:id/uploadCover",
  multer({ storage: saveCoverCloudinary }).single("blogPic"),
  async (req, res, next) => {
    try {
      const paramsId = req.params.id;
      const blogPosts = await fse.readJSON(blogsPath);
      const blogPost = blogPosts.find((p) => p.id === paramsId);
      if (blogPost) {
        const imageUrl = req.file.path;
        console.log("url", imageUrl);
        const updatedBlogPost = { ...blogPost, imageURL: imageUrl };
        console.log(updatedBlogPost);

        const remainingBlogPosts = blogPosts.filter((p) => p.id !== paramsId);

        remainingBlogPosts.push(updatedBlogPost);
        console.log("second", remainingBlogPosts);
        await fse.writeJSON(blogsPath, remainingBlogPosts);
        res.send(updatedBlogPost);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostsRouter;
