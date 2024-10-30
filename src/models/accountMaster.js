import { DataTypes, STRING } from "sequelize";
import getConnection from "../helper/databaseConnection.js";

const accountMasterModel = {
  user_id: {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fcm_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let accountMaster = null;
const initaccountMaster = async () => {
  try {
    if (accountMaster) return accountMaster;
    const sequelize = await getConnection();
    accountMaster = sequelize.define("accountmaster", accountMasterModel, {
      freezeTableName: true,
    });

    await accountMaster.sync({ alter: true });
    return accountMaster;
  } catch (err) {
    console.log("accountmaster", err.message);
  }
};

export default initaccountMaster;
