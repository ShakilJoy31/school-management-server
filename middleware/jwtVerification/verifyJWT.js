const jwt = require("jsonwebtoken");
const Branch = require("../../models/Authentication/branchAdmin.model");
const BranchUser = require("../../models/Authentication/branchAdminUser.model");












//! The Branch JWT Verification Middleware
const verifyBranchAdminJWT = (req, res, next) => {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const access_token = authHeader.split(" ")[1];

  jwt.verify(
    access_token,
    process.env.JWT_ACCESS_TOKEN,
    async (error, decoded) => {
      if (error) return next("Session Expired!");
      if (!decoded?.id) return next("invalid id");
      const user = await Branch.findOne({ where: { id: decoded?.id } });
      if (!user) return next("Invalid token!");

      req.id = decoded?.id;
      req.email = user.dataValues?.email;
      req.role = decoded?.role;
      next();
    }
  );
};



//! The Branch User JWT Verification Middleware
const verifyBranchAdminUserJWT = (req, res, next) => {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const access_token = authHeader.split(" ")[1];

  jwt.verify(
    access_token,
    process.env.JWT_ACCESS_TOKEN,
    async (error, decoded) => {
      if (error) return next("Session Expired!");
      if (!decoded?.id) return next("invalid id");
      const user = await BranchUser.findOne({ where: { id: decoded?.id } });
      if (!user) return next("Invalid token!");

      req.id = decoded?.id;
      req.email = user.dataValues?.email;
      req.role = decoded?.role;
      next();
    }
  );
};



module.exports = verifyBranchAdminJWT;
module.exports = verifyBranchAdminUserJWT;
