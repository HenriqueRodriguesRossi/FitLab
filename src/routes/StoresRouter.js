const router = require("express").Router()
const StoreController = require("../controllers/StoresController")
const checkStoreToken = require("../utils/checkStoreToken")
const checkToken = require("../utils/checkToken")

router.post("/stores/create", StoreController.newStore)
router.post("/stores/login", StoreController.StoreLogin)

router.get("/stores/find/all", checkToken,  StoreController.findAllStores),
router.get("/stores/find/:store_id", checkToken, StoreController.findeStoreById)
router.get("/stores/find-by-name",checkToken, StoreController.findStoresByName)

router.put("/stores/alter/email/:store_id", checkStoreToken, StoreController.alterStoreEmail)
router.put("/stores/alter/pass/:store_id", checkStoreToken, StoreController.alterStorePassword)

router.delete("/stores/delete/:store_id", checkStoreToken, StoreController.deleteStoreAccount)

module.exports = router