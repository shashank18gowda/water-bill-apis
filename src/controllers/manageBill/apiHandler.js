import { Router } from "express";

const router = Router();

import generateBill from "./generateBill.js";
import payBill from "./payBill.js";
import paymentHistory from "./paymentHistory.js";

router.use("/generate", generateBill);
router.use("/pay", payBill);
router.use("/payhistory", paymentHistory);



export default router;
