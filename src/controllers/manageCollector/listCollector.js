import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE, STATE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
import initaccountMaster from "../../models/accountMaster.js";
const router = Router();
import bcrypt from "bcrypt";
export default router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.ADMIN) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }

    const accountMaster = await initaccountMaster();

    let data = await accountMaster.findAll({
      where: { is_active: STATE.ACTIVE, role: ROLE.COLLECTOR },
      attributes: ["user_id", "name", "phone"],
    });

    if (data.length == 0) {
      return send(res, setErrorResponseMsg(RESPONSE.NOT_FOUND, "collectors"));
    }

    return send(res, RESPONSE.SUCCESS, data);
  } catch (error) {
    console.log("list collector", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
