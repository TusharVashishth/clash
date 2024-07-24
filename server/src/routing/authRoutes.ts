import { Router, Response, Request } from "express";
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validations/authValidation.js";
import { ZodError } from "zod";
import {
  checkDateHourDifference,
  formatError,
  generateRandomNum,
  renderEmailEjs,
} from "../helper.js";
import prisma from "../config/database.js";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import bcrypt from "bcrypt";
import { authLimiter } from "../config/rateLimit.js";
import { testQueue, testQueueName } from "../jobs/TestQueue.js";
import { emailQueue, emailQueueName } from "../jobs/EmailQueue.js";

const router = Router();

router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = loginSchema.parse(body);
    // * Check if user exist
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with this email." });
    }

    // * Check email verified or not
    if (user.email_verified_at === null) {
      return res.status(422).json({
        errors: {
          email:
            "Email is not verified yet.please check your email and verify your email.",
        },
      });
    }

    // Check password
    const compare = await bcrypt.compare(payload.password, user.password);
    if (!compare) {
      return res.status(422).json({
        errors: {
          email: "Invalid Credentials.",
        },
      });
    }

    const JWTPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    const resPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: `Bearer ${token}`,
    };

    return res.json({
      message: "Logged in successfully!",
      data: resPayload,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
    } else {
      logger.error({ type: "Auth Error", body: error });
      res
        .status(500)
        .json({ error: "Something went wrong.please try again!", data: error });
    }
  }
});

router.post(
  "/check/login",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = loginSchema.parse(body);
      // * Check if user exist
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!user) {
        return res.status(422).json({
          errors: {
            email: "No user found with this email.",
          },
        });
      }
      // * Check email verified or not
      if (user.email_verified_at === null) {
        return res.status(422).json({
          errors: {
            email:
              "Email is not verified yet.please check your email and verify your email.",
          },
        });
      }
      // Check password
      if (!bcrypt.compareSync(payload.password, user.password)) {
        return res.status(422).json({
          errors: {
            email: "Invalid Credentials.",
          },
        });
      }
      return res.json({
        message: "Logged in successfully!",
        data: null,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatError(error);
        res.status(422).json({ message: "Invalid login data", errors });
      } else {
        logger.error({ type: "Auth Error", body: error });
        res.status(500).json({
          error: "Something went wrong.please try again!",
          data: error,
        });
      }
    }
  }
);

router.post("/register", authLimiter, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = registerSchema.parse(body);
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (user) {
      return res.status(422).json({
        errors: {
          email: "Email already taken.please use another one.",
        },
      });
    }
    //   * Encrypt the password
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);

    const id = generateRandomNum();
    const token = await bcrypt.hash(id, salt);
    const url = `${process.env.APP_URL}/verify/email/?email=${payload.email}&token=${token}`;

    const html = await renderEmailEjs("verify-email", {
      name: payload.name,
      url: url,
    });
    await emailQueue.add(emailQueueName, {
      to: payload.email,
      subject: "Please verify your email Clash",
      html: html,
    });
    await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        email_verify_token: token,
      },
    });
    return res.json({ message: "User created successfully!" });
  } catch (error) {
    console.log("The errir is ", error);
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
    } else {
      logger.error({ type: "Register Error", body: JSON.stringify(error) });
      res
        .status(500)
        .json({ error: "Something went wrong.please try again!", data: error });
    }
  }
});

// * Forget password
router.post(
  "/forget-password",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = forgetPasswordSchema.parse(body);
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!user) {
        return res.status(422).json({
          message: "Invalid data",
          errors: {
            email: "No Account found with this email!",
          },
        });
      }

      const id = generateRandomNum();
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(id, salt);
      await prisma.user.update({
        data: {
          password_reset_token: token,
          token_send_at: new Date().toISOString(),
        },
        where: {
          email: payload.email,
        },
      });
      const url = `${process.env.CLIENT_URL}/reset-password?email=${payload.email}&token=${token}`;
      const html = await renderEmailEjs("forget-password", {
        name: user.name,
        url: url,
      });
      await emailQueue.add(emailQueueName, {
        to: payload.email,
        subject: "Forgot Password",
        html: html,
      });

      return res.json({
        message: "Email sent successfully!! please check your email.",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatError(error);
        return res.status(422).json({ message: "Invalid data", errors });
      } else {
        logger.error({ type: "Auth Error", body: error });
        return res.status(500).json({
          error: "Something went wrong.please try again!",
          data: error,
        });
      }
    }
  }
);

// *Reset Password routes
router.post(
  "/reset-password",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = resetPasswordSchema.parse(body);
      const user = await prisma.user.findUnique({
        select: {
          email: true,
          password_reset_token: true,
          token_send_at: true,
        },
        where: { email: payload.email },
      });

      if (!user) {
        return res.status(422).json({
          errors: {
            email: "No Account found with this email.",
          },
        });
      }

      // * Check token
      if (payload.token !== user.password_reset_token) {
        return res.status(422).json({
          errors: {
            email: "Please make sure you are using correct url.",
          },
        });
      }

      const hoursDiff = checkDateHourDifference(user.token_send_at);
      if (hoursDiff > 2) {
        return res.status(422).json({
          errors: {
            email:
              "Password Reset token got expire.please send new token to reset password.",
          },
        });
      }

      // * Update the password
      const salt = await bcrypt.genSalt(10);
      const newPass = await bcrypt.hash(payload.password, salt);
      await prisma.user.update({
        data: {
          password: newPass,
          password_reset_token: null,
          token_send_at: null,
        },
        where: { email: payload.email },
      });

      return res.json({
        message: "Password reset successfully! please try to login now.",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatError(error);
        return res.status(422).json({ message: "Invalid data", errors });
      } else {
        logger.error({ type: "Auth Error", body: error });
        return res.status(500).json({
          error: "Something went wrong.please try again!",
          data: error,
        });
      }
    }
  }
);

router.get("/user", authMiddleware, async (req: Request, res: Response) => {
  const user = req.user;
  await testQueue.add(testQueueName, user);
  return res.json({ message: "Fetched", user });
});

export default router;
