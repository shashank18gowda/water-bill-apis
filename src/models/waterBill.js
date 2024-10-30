import { DataTypes, STRING } from "sequelize";
import getConnection from "../helper/databaseConnection.js";
import initaccountMaster from "./accountMaster.js";
import initcustomerModel from "./customers.js";

const billSchema = {
  bill_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  // serialNumber: {
  //   type: DataTypes.INTEGER,
  //   autoIncrement: true,
  //   unique: true,
  //   allowNull: false,
  // },
  used_quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slab_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  pay_method: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pay_status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let billModel = null;
const initbillModel = async () => {
  try {
    if (billModel) return billModel;
    const sequelize = await getConnection();
    billModel = sequelize.define("waterbill", billSchema, {
      freezeTableName: true,
    });

    const customer = await initcustomerModel();
    customer.hasMany(billModel, {
      as: "billInfo",
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "customer_id",
      },
      targetKey: "customer_id",
    });

    billModel.belongsTo(customer, {
      as: "billInfo",
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "customer_id",
      },
      targetKey: "customer_id",
    });

    await billModel.sync({ alter: true });
    return billModel;
  } catch (err) {
    console.log("billModel", err.message);
  }
};

export default initbillModel;
