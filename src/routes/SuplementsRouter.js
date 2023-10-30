const router = require("express").Router()
const checkStoreToken = require("../utils/checkStoreToken")
const upload = require("../config/multer")

router.post("/suplements/new/:store_id", checkStoreToken, upload.single("file"), )

module.exports = router