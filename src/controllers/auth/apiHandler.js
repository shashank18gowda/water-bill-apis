import { Router } from "express";

const router = Router();

import login from "./login.js";





router.use("/login", login);


export default router;
