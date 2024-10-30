import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
import initaccountMaster from "../../models/accountMaster.js";
const router = Router();
import bcrypt from "bcrypt";
import { where } from "sequelize";
// export default router.post("/",authenticate, async (req, res) => {
//   try {
//     if (req.user.role != ROLE.ADMIN) {
//       return send(res, RESPONSE.ACCESS_DENIED);
//     }
export default router.post("/", async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const accountMaster = await initaccountMaster();
    if (!name || name == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "Name"));
    }

    if (!phone || phone == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "phone"));
    }

    const pPattern = String(phone).match(/^\+\d{10,15}$/);
    if (!pPattern || pPattern.length <= 0 || String(phone).indexOf(" ") >= 0) {
      return send(res, setErrorResponseMsg(RESPONSE.INVALID_DATA, "Phone no."));
    }

    if (!password || password == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "password"));
    }
    const pwdPattern = String(password).match(
      //example Qwerty@123
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,32}$/
    );
    if (!pwdPattern || pwdPattern.length <= 0 || password.indexOf(" ") >= 0) {
      return send(res, setErrorResponseMsg(RESPONSE.INVALID_DATA, "Password"));
    }

    const isPhoneExist = await accountMaster.findAll({
      where: { phone: phone },
    });

    if (isPhoneExist.length > 0) {
      return send(res, setErrorResponseMsg(RESPONSE.ALREADY_EXIST, "phone"));
    }

    // const encryptPassword = CryptoJS.AES.encrypt(
    //   password,
    //   process.env.SECRET_KEY
    // ).toString();

    await accountMaster.create({
      ...req.body,
      password: await bcrypt.hash(password, 10),
      role: ROLE.COLLECTOR,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("add collector", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
