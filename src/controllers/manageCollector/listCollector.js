import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE, STATE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
import initaccountMaster from "../../models/accountMaster.js";
const router = Router();
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

export default router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.ADMIN) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }
    let query = { is_active: STATE.ACTIVE, role: ROLE.COLLECTOR };
    const user_id = req.query.user_id;
    user_id != undefined ? (query.user_id = user_id) : "";
    const accountMaster = await initaccountMaster();

    let data = await accountMaster.findAll({
      where: query,
      attributes: ["user_id", "name", "phone", "password"],
    });

    data = data.map((itm) => {
      const bytes = CryptoJS.AES.decrypt(itm.password, process.env.SECRET_KEY);
      const decryptPassword = bytes.toString(CryptoJS.enc.Utf8);
      return {
        ...itm.toJSON(),
        password: decryptPassword,
      };
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
