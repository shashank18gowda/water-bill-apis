import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();
import initcustomerModel from "../../models/customers.js";

export default router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.COLLECTOR) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }
    // export default router.post("/", async (req, res) => {
    //   try {
    const { name, phone, address, house_no } = req.body;
    const customerModel = await initcustomerModel();

    if (!name || name == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "Name"));
    }

    if (!phone || phone == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "phone"));
    }
    if (!address || address == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "address"));
    }

    if (!house_no || house_no == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "house_no"));
    }

    const pPattern = String(phone).match(/^\+\d{10,15}$/);
    if (!pPattern || pPattern.length <= 0 || String(phone).indexOf(" ") >= 0) {
      return send(res, setErrorResponseMsg(RESPONSE.INVALID_DATA, "Phone no."));
    }
    const isPhoneExist = await customerModel.findAll({
      where: { phone: phone },
    });

    if (isPhoneExist.length > 0) {
      return send(res, setErrorResponseMsg(RESPONSE.ALREADY_EXIST, "phone"));
    }

    await customerModel.create({
      ...req.body,
      user_id: req.user.id,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("add customer", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
