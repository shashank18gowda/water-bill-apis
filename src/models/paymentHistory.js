import { DataTypes, STRING } from "sequelize";
import getConnection from "../helper/databaseConnection.js";
import initbillModel from "./waterBill.js";
import initcustomerModel from "./customers.js";

const paymentSchema = {
  payment_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pay_method: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paid_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  is_active: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let paymentModel = null;
const initpaymentModel = async () => {
  try {
    if (paymentModel) return paymentModel;
    const sequelize = await getConnection();
    paymentModel = sequelize.define("paymenthistory", paymentSchema, {
      freezeTableName: true,
    });

    const billModel = await initbillModel();
    paymentModel.belongsTo(billModel, {
      as: "billInfo",
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "bill_id",
      },
      targetKey: "bill_id",
    });

    await paymentModel.sync({ alter: true });
    return paymentModel;
  } catch (err) {
    console.log("paymentModel", err.message);
  }
};

export default initpaymentModel;
