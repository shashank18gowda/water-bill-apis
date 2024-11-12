import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE, STATE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
import initcustomerModel from "../../models/customers.js";
import initaccountMaster from "../../models/accountMaster.js";
import initbillModel from "../../models/waterBill.js";
import initpaymentModel from "../../models/paymentHistory.js";
const router = Router();

export default router.get("/", async (req, res) => {
  try {
    const customer_id = req.query.customer_id;

    const customerModel = await initcustomerModel();
    const billModel = await initbillModel();
    const paymentHistory = await initpaymentModel();

    // let data = await customerModel.findAll({
    //   include: [{ model: billModel, as: "billInfo" }],

    //   where: { customer_id: customer_id, is_active: STATE.ACTIVE },
    // });

    if (!customer_id || customer_id == undefined) {
      return send(
        res,
        setErrorResponseMsg(RESPONSE.IS_MANDATORY, "customer_id")
      );
    }

    let data = await paymentHistory.findAll({
      include: [
        {
          model: billModel,
          as: "billInfo",
          where: { customer_id: customer_id, is_active: STATE.ACTIVE },
          attributes: [
            "bill_id",
            "used_quantity",
            "slab_type",
            "amount",
            "month",
            "year",
            // "pay_method",
            "pay_status",
          ],
        },
      ],

      where: { is_active: STATE.ACTIVE },
      attributes: ["payment_id", "amount", "pay_method", "paid_date"],
    });

    if (data.length == 0) {
      return send(res, setErrorResponseMsg(RESPONSE.NOT_FOUND, "customers"));
    }

    return send(res, RESPONSE.SUCCESS, data);
  } catch (error) {
    console.log("list history", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
