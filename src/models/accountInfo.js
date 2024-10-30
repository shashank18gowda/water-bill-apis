// import { DataTypes, STRING } from "sequelize";
// import getConnection from "../helper/databaseConnection.js";

// const accountInfoModel = {
//   userinfo_id: {
//     primaryKey: true,
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//   },

//   phone: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   role: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   fcm_token: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   is_active: {
//     type: DataTypes.INTEGER,
//     defaultValue: 1,
//   },
// };

// let accountInfo = null;
// const initaccountInfo = async () => {
//   try {
//     if (accountInfo) return accountInfo;
//     const sequelize = await getConnection();
//     accountInfo = sequelize.define("accountinfo", accountInfoModel, {
//       freezeTableName: true,
//     });

//     await accountInfo.sync({ alter: true });
//     return accountInfo;
//   } catch (err) {
//     console.log("accountinfo", err.message);
//   }
// };

// export default initaccountInfo;
