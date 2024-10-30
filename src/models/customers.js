import { DataTypes, STRING } from "sequelize";
import getConnection from "../helper/databaseConnection.js";
import initaccountMaster from "./accountMaster.js";

const customerSchema = {
  customer_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  house_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  is_active: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let customerModel = null;
const initcustomerModel = async () => {
  try {
    if (customerModel) return customerModel;
    const sequelize = await getConnection();
    customerModel = sequelize.define("customers", customerSchema, {
      freezeTableName: true,
    });

    const collector = await initaccountMaster();
    collector.hasMany(customerModel, {
      as: "customerInfo",
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "user_id",
      },
      targetKey: "user_id",
    });

    await customerModel.sync({ alter: true });
    return customerModel;
  } catch (err) {
    console.log("customerModel", err.message);
  }
};

export default initcustomerModel;
