const router = require("express").Router()
const checkStoreToken = require("../utils/checkStoreToken")
const upload = require("../config/multer")
const SuplementController = require("../controllers/SuplementController")
const checkToken = require("../utils/checkToken")

//Funcionalidades exclusivas para lojas
router.post("/suplements/new/:store_id", checkStoreToken, upload.single("file"), SuplementController.newSuplement)

router.get("/suplements/find/quantity", checkStoreToken,)

router.put("/suplements/alter/quantity_stock", checkStoreToken)
router.put("/suplements/alter/unit_value", checkStoreToken,)

router.delete("/suplements/delete/:suplement_id", checkStoreToken)

//Funcionalidades gerais
router.get("/suplements/find/all/:store_id", SuplementController.findAllSuplements)
router.get("/suplements/find/name", SuplementController.findSuplementsByName)


module.exports = router