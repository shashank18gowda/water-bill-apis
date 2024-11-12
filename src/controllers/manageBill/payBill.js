import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { PAY_STATUS, ROLE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();
import initbillModel from "../../models/waterBill.js";
import initpaymentModel from "../../models/paymentHistory.js";
import { where } from "sequelize";

// export default router.post("/", authenticate, async (req, res) => {
export default router.post("/", async (req, res) => {
  try {
    // if (req.user.role != ROLE.COLLECTOR) {
    //   return send(res, RESPONSE.ACCESS_DENIED);
    // }
    // export default router.post("/", async (req, res) => {
    //   try {
    let { bill_id, pay_method } = req.body;
    const billModel = await initbillModel();
    const paymentModel = await initpaymentModel();

    if (!bill_id || bill_id == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "bill_id"));
    }

    if (!pay_method || pay_method == undefined) {
      return send(
        res,
        setErrorResponseMsg(RESPONSE.IS_MANDATORY, "pay_method")
      );
    }

    if (!Array.isArray(bill_id)) {
      bill_id = [bill_id];
    }

    if (!Array.isArray(pay_method)) {
      pay_method = [pay_method];
    }

    if (bill_id.length == pay_method.length) {
      for (let i = 0; i < bill_id.length; i++) {
        let billData = await billModel.findOne({
          where: {
            bill_id: bill_id[i],
          },
        });

        await billModel.update(
          { pay_method: pay_method[i], pay_status: PAY_STATUS.COMPLETED },
          { where: { bill_id: bill_id[i] } }
        );

        await paymentModel.create({
          amount: billData.amount,
          pay_method: pay_method[i],
          paid_date: new Date(),
          bill_id: bill_id[i],
        });
      }
    } else {
      return send(res, RESPONSE.FIELDS_MISSING);
    }

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("pay bill ", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
