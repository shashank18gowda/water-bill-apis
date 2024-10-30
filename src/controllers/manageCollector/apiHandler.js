import { Router } from "express";

const router = Router();

import addCollector from "./addCollector.js";
import listCollector from "./listCollector.js";


router.use("/add", addCollector);
router.use("/list", listCollector);


export default router;
