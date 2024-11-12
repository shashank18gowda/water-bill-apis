import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { PAY_STATUS, ROLE, STATE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
import initcustomerModel from "../../models/customers.js";
import initaccountMaster from "../../models/accountMaster.js";
import initbillModel from "../../models/waterBill.js";
const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.COLLECTOR) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }

    let billQuery = { is_active: STATE.ACTIVE };
    const customer_id = req.query.customer_id;

    req.query.pay_status != undefined
      ? (billQuery.pay_status = Number(req.query.pay_status))
      : (billQuery.pay_status = PAY_STATUS.PENDING);

    const customerModel = await initcustomerModel();
    const billModel = await initbillModel();
    let query = { is_active: STATE.ACTIVE, user_id: req.user.id };
    let includeArry = [];

    if (customer_id) {
      query.customer_id = customer_id;
      includeArry = {
        model: billModel,
        as: "billInfo",
        where: billQuery,
        required: false,
        attributes: [
          "bill_id",
          "used_quantity",
          "slab_type",
          "amount",
          "month",
          "year",
          "pay_method",
          "pay_status",
        ],
      };
    }

    let data = await customerModel.findAll({
      include: includeArry,
      where: query,
      attributes: ["customer_id", "name", "phone", "address", "house_no"],
    });

    if (data.length == 0) {
      return send(res, setErrorResponseMsg(RESPONSE.NOT_FOUND, "customers"));
    }

    return send(res, RESPONSE.SUCCESS, data);
  } catch (error) {
    console.log("list customer", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
