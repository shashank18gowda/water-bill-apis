import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();
import initcustomerModel from "../../models/customers.js";
import { Op } from "sequelize";

export default router.put("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.COLLECTOR) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }
    // export default router.post("/", async (req, res) => {
    //   try {
    const { name, phone, address, house_no } = req.body;
    const customerModel = await initcustomerModel();
    let updates = {};

    const customer_id = req.query.customer_id;

    if (!customer_id || customer_id == undefined) {
      return send(
        res,
        setErrorResponseMsg(RESPONSE.IS_MANDATORY, "customer_id")
      );
    }

    if (name && name !== undefined) updates.name = name;

    if (address || address !== undefined) updates.address = address;
    if (house_no || house_no !== undefined) updates.house_no = house_no;

    if (phone || phone !== undefined) {
      const pPattern = String(phone).match(/^\+\d{10,15}$/);
      if (
        !pPattern ||
        pPattern.length <= 0 ||
        String(phone).indexOf(" ") >= 0
      ) {
        return send(
          res,
          setErrorResponseMsg(RESPONSE.INVALID_DATA, "Phone no.")
        );
      }

      const isPhoneExist = await customerModel.findOne({
        where: { phone: phone, customer_id: { [Op.ne]: customer_id } },
      });

      if (isPhoneExist) {
        return send(
          res,
          setErrorResponseMsg(RESPONSE.ALREADY_EXIST, "Phone no.")
        );
      } else {
        updates.phone = phone;
      }
    }

    // console.log(updates);

    await customerModel.update(updates, {
      where: {
        customer_id: customer_id,
      },
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("edit customer", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
