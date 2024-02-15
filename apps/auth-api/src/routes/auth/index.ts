import { Router } from "express";
import github from "./github/index.js";

const router = Router();

router.use("/login/github", github);

export default router;
