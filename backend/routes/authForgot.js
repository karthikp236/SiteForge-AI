
import { Router } from "express";
import { User } from "../models/User.js";
import {
    generateOtp,
    peekOtp,
    saveOtp,
    sendOtpEmail,
    verifyOtp
} from "../utils/services.js";

const router = Router();

// Step 1: Request forgot password OTP
router.post("/request", async (req, res, next) => {
    try {
        const email = (req.body.email || "").trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                error: "Email is required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "No account found with that email."
            });
        }

        const code = generateOtp();

        saveOtp(email, code);

        const emailResult = await sendOtpEmail({
            to: user.email,
            name: user.name,
            code,
            purpose: "forgot"
        });

        console.log("Forgot password email result:", emailResult);

        res.json({
            ok: true,
            email: user.email,
            emailSent: emailResult.sent,
            emailFallback: emailResult.fallback
        });

    } catch (err) {
        next(err);
    }
});

// Step 2: Verify OTP
router.post("/verify-code", async (req, res, next) => {
    try {
        const email = (req.body.email || "").trim().toLowerCase();
        const { code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                error: "Email and code are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "No account found with that email."
            });
        }

        const result = peekOtp(email, code);

        if (!result.ok) {
            return res.status(400).json({
                error: result.reason
            });
        }

        res.json({ ok: true });

    } catch (err) {
        next(err);
    }
});

// Step 3: Reset password
router.post("/reset", async (req, res, next) => {
    try {
        const email = (req.body.email || "").trim().toLowerCase();
        const { code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                error: "Email, code and new password are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: "New password must be at least 6 characters."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "No account found with that email."
            });
        }

        const result = verifyOtp(email, code);

        if (!result.ok) {
            return res.status(400).json({
                error: result.reason
            });
        }

        user.passwordHash = await User.hashPassword(newPassword);

        if (!user.emailVerified) {
            user.emailVerified = true;
        }

        await user.save();

        res.json({
            ok: true,
            message: "Password reset successfully."
        });

    } catch (err) {
        next(err);
    }
});

export default router;
