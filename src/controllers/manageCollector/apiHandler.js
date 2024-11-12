import { Router } from "express";

const router = Router();

import addCollector from "./addCollector.js";
import listCollector from "./listCollector.js";
import editCollector from "./editCollector.js";
import deleteCollector from "./deleteCollector.js";


router.use("/add", addCollector);
router.use("/list", listCollector);
router.use("/edit", editCollector);
router.use("/delete", deleteCollector);




export default router;
