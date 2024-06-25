const express = require("express");
const { signup, login, listUsers, getUserDetails, updateUser, deleteUser, logout } = require("../controllers/userController");
const authenticateUser = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/register",signup );
router.post("/login",login );
router.get("/login",logout );
router.get('/users',authenticateUser, listUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

module.exports = router;