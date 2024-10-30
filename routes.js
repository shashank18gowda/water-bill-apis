import express from "express";

import authApiHandler from "./src/controllers/auth/apiHandler.js";
import collectorApiHandler from "./src/controllers/manageCollector/apiHandler.js";

const routes = (app) => {
  app.use(express.json());
  app.use("/api/auth", authApiHandler);
  app.use("/api/collector", collectorApiHandler);
};

export default routes;
