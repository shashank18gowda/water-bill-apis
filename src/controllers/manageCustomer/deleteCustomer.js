import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE, STATE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();
import initcustomerModel from "../../models/customers.js";
import { Op } from "sequelize";

export default router.delete("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.COLLECTOR) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }

    const customerModel = await initcustomerModel();
    const customer_id = req.query.customer_id;

    if (!customer_id || customer_id == undefined) {
      return send(
        res,
        setErrorResponseMsg(RESPONSE.IS_MANDATORY, "customer_id")
      );
    }

    const isCustomerExist = await customerModel.findOne({
      where: { customer_id: customer_id, is_active: STATE.ACTIVE },
    });

    if (!isCustomerExist) {
      return send(res, setErrorResponseMsg(RESPONSE.NOT_FOUND, "Customer"));
    }

    await customerModel.update(
      {
        is_active: STATE.INACTIVE,
      },
      {
        where: {
          customer_id: customer_id,
          is_active: STATE.ACTIVE,
        },
      }
    );

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("delete customer", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
