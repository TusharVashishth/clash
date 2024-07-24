import { Router } from "express";
import AuthRoutes from "./authRoutes.js";
import ClashRoutes from "./clashRoutes.js";
import VerifyRoutes from "./verifyRoutes.js";
const router = Router();

router.use("/api", AuthRoutes);
router.use("/api/clash", ClashRoutes);
router.use("/", VerifyRoutes);

export default router;
