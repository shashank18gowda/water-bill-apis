import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();
import initbillModel from "../../models/waterBill.js";

export default router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.COLLECTOR) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }
    // export default router.post("/", async (req, res) => {
    //   try {
    const {
      customer_id,
      used_quantity,
      slab_type,
      amount,
      pay_method,
      year,
      month,
    } = req.body;
    const billModel = await initbillModel();

    if (!customer_id || customer_id == undefined) {
      return send(
        res,
        setErrorResponseMsg(RESPONSE.IS_MANDATORY, "customer_id")
      );
    }

    if (!used_quantity || used_quantity == undefined) {
      return send(
        res,
        setErrorResponseMsg(RESPONSE.IS_MANDATORY, "used_quantity")
      );
    }

    if (!slab_type || slab_type == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "slab_type"));
    }

    if (!amount || amount == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "amount"));
    }
    if (!year || year == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "year"));
    }

    if (!month || month == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "month"));
    }

    // if (!pay_method || pay_method == undefined) {
    //   return send(
    //     res,
    //     setErrorResponseMsg(RESPONSE.IS_MANDATORY, "pay_method")
    //   );
    // }

    await billModel.create({
      ...req.body,
      customer_id: customer_id,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("generate bill ", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
