const router = require("express").Router()
const StoresController = require("../controllers/StoresController")
const checkToken = require("../utils/checkToken")

router.get("/stores/find/all", checkToken, )

router.post("/stores/create", checkToken, )

module.exports = router