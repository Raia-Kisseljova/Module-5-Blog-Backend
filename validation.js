import { body } from "express-validator";

export const postValidation = [
  body("title")
    .exists()
    .withMessage("Please give a title to your post")
    .isEmpty("Give a title to your post")
    .withMessage("Please give a title to your post"),

  body("content")
    .exists()
    .withMessage("You can not submit empty post")
    .isEmpty("You can not submit empty post")
    .withMessage("You can not submit empty post"),
];
