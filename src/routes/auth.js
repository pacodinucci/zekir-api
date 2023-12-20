import { Router } from "express";
import { signup } from "../auth/signup.js";
import { signin } from "../auth/signin.js";


const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
