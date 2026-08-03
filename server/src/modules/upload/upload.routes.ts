import { Router } from "express";

import upload from "../../config/multer";

import { authenticate } from "../../middleware/auth.middleware";

import {

  uploadFileController,

} from "./upload.controller";

const router = Router();

router.post(

  "/",

  authenticate,

  upload.single("file"),

  uploadFileController

);

export default router;