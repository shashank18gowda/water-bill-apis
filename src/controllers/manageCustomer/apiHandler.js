import { Router } from "express";

const router = Router();

import addCustomer from "./addCustomer.js";
import listcustomer from "./listcustomer.js";
import editCustomer from "./editCustomer.js";
import deleteCustomer from "./deleteCustomer.js";

router.use("/add", addCustomer);
router.use("/list", listcustomer);
router.use("/edit", editCustomer);
router.use("/delete", deleteCustomer);

export default router;
