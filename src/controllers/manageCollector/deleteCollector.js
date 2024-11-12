import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import { ROLE, STATE } from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();
import initcollectorModel from "../../models/accountMaster.js";
import { Op } from "sequelize";

export default router.delete("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.ADMIN) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }

    const collectorModel = await initcollectorModel();
    const user_id = req.query.user_id;

    if (!user_id || user_id == undefined) {
      return send(res, setErrorResponseMsg(RESPONSE.IS_MANDATORY, "user_id"));
    }

    const isCollectorExist = await collectorModel.findOne({
      where: { user_id: user_id, is_active: STATE.ACTIVE },
    });

    if (!isCollectorExist) {
      return send(res, setErrorResponseMsg(RESPONSE.NOT_FOUND, "Collector"));
    }

    await collectorModel.update(
      {
        is_active: STATE.INACTIVE,
      },
      {
        where: {
          user_id: user_id,
          is_active: STATE.ACTIVE,
        },
      }
    );

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("delete collector", error);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
