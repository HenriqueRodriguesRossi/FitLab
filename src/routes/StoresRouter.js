const router = require("express").Router()
const StoreController = require("../controllers/StoresController")
const checkStoreToken = require("../utils/checkStoreToken")

router.post("/stores/create", StoreController.newStore)
router.post("/stores/login", StoreController.StoreLogin)

router.get("/stores/find/all", checkStoreToken,  StoreController.findAllStores)

module.exports = router