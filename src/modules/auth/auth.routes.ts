import { Router } from "express";
import { loginHandler, registerHandler } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router: Router = Router();


router.post("/login", loginHandler);
router.post("/register", registerHandler);

router.get('/me', authMiddleware, (req, res) => {
    return res.json(req.user);
});



export default router;