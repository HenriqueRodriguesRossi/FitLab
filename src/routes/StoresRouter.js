const router = require("express").Router()
const StoreController = require("../controllers/StoresController")
const checkToken = require("../utils/checkToken")

router.get("/stores/find/all", checkToken, StoreController.newStore)

router.post("/stores/create", checkToken, StoreController.findAllStores)

module.exports = router