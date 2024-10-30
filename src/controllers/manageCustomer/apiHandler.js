import { Router } from "express";

const router = Router();

import addCustomer from "./addCustomer.js";
import listcustomer from "./listcustomer.js";

router.use("/add", addCustomer);
router.use("/list", listcustomer);

export default router;
