const router = require("express").Router()
const UserController = require("../controllers/UserController")
const checkStoreToken = require("../utils/checkStoreToken")

router.post("/users/new", UserController.newUser)
router.post("/users/login", UserController.login)

router.get("/users/find/all", checkStoreToken, UserController.findAllUsers)

module.exports = router