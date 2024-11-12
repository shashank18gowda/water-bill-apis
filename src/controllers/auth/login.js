import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { STATE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
import jwt from "jsonwebtoken";
import initaccountMaster from "../../models/accountMaster.js";
const router = Router();
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

export default router.post("/", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const accountMaster = await initaccountMaster();

    if (!phone || phone == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "phone"));
    }

    if (!password || password == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "password"));
    }

    const userdata = await accountMaster.findOne({
      where: { is_active: STATE.ACTIVE, phone: phone },
    });

    if (userdata) {
    }

    if (userdata) {
      const bytes = CryptoJS.AES.decrypt(
        userdata.password,
        process.env.SECRET_KEY
      );

      const decryptPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (password == decryptPassword) {
        // if (userdata && (await bcrypt.compare(password, userdata.password))) {
        const token = jwt.sign(
          {
            id: userdata.user_id,
            name: userdata.name,
            role: userdata.role,
          },
          process.env.TOKEN_KEY
        );
        return send(res, RESPONSE.SUCCESS, { access_token: token });
      } else {
        return send(
          res,
          setErrorResponseMsg(RESPONSE.INVALID_DATA, "Login Credentials")
        );
      }
    } else {
      return send(res, setErrorResponseMsg(RESPONSE.NOT_FOUND, "User"));
    }
  } catch (error) {
    console.log("Login ", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
