import express from "express";
// import authController from "../controllers/authController.js";

const router = express.Router();

function displayDetails(req, res) {
  res.status(200).render("base", { title: "Base pug template" });
}

router.route("/templating-base").get(displayDetails);

// router.post("/signup", authController);
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

export default router;
