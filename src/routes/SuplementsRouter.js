const router = require("express").Router()
const checkStoreToken = require("../utils/checkStoreToken")
const upload = require("../config/multer")
const SuplementController = require("../controllers/SuplementController")

router.post("/suplements/new/:store_id", checkStoreToken, upload.single("file"), SuplementController.newSuplement)

module.exports = router