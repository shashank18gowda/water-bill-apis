import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();
import initcollectorModel from "../../models/accountMaster.js";
import { Op } from "sequelize";
import CryptoJS from "crypto-js";

export default router.put("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.ADMIN) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }
    // export default router.post("/", async (req, res) => {
    //   try {
    const { name, phone, password } = req.body;
    const collectorModel = await initcollectorModel();
    let updates = {};

    const user_id = req.query.user_id;

    if (!user_id || user_id == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "user_id"));
    }

    if (name && name !== undefined) updates.name = name;

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

      const isPhoneExist = await collectorModel.findOne({
        where: { phone: phone, user_id: { [Op.ne]: user_id } },
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

    if (password || password != undefined) {
      const pwdPattern = String(password).match(
        //example Qwerty@123
        /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,32}$/
      );
      if (!pwdPattern || pwdPattern.length <= 0 || password.indexOf(" ") >= 0) {
        return send(
          res,
          setErrorResponseMsg(RESPONSE.INVALID_DATA, "Password")
        );
      } else {
        const encryptPassword = CryptoJS.AES.encrypt(
          password,
          process.env.SECRET_KEY
        ).toString();

        updates.password = encryptPassword;
      }
    }

    await collectorModel.update(updates, {
      where: {
        user_id: user_id,
      },
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("edit collector", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
