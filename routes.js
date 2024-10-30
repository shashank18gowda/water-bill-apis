import express from "express";

import authApiHandler from "./src/controllers/auth/apiHandler.js";
import collectorApiHandler from "./src/controllers/manageCollector/apiHandler.js";
import customerApiHandler from "./src/controllers/manageCustomer/apiHandler.js";
import billApiHandler from "./src/controllers/manageBill/apiHandler.js";

const routes = (app) => {
  app.use(express.json());
  app.use("/api/auth", authApiHandler);
  app.use("/api/collector", collectorApiHandler);
  app.use("/api/customer", customerApiHandler);
  app.use("/api/bill", billApiHandler);
};

export default routes;
