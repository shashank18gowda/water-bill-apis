import { Router } from "express";

const router = Router();

import generateBill from "./generateBill.js";

router.use("/generate", generateBill);

export default router;
