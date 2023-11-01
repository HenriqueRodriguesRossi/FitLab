const router = require("express").Router()
const checkStoreToken = require("../utils/checkStoreToken")
const upload = require("../config/multer")
const SuplementController = require("../controllers/SuplementController")

//Funcionalidades exclusivas para lojas
router.post("/suplements/new/:store_id", checkStoreToken, upload.single("file"), SuplementController.newSuplement)

router.get("/suplements/find/quantity/:store_id", checkStoreToken, SuplementController.findSuplementsByQuantity)

router.put("/suplements/alter/quantity_stock/:suplement_id", checkStoreToken, SuplementController.alterAmount)
router.put("/suplements/alter/unit_value/:suplement_id", checkStoreToken, SuplementController.alterValue)

router.delete("/suplements/delete/:suplement_id", checkStoreToken, SuplementController.deleteSuplement)

//Funcionalidades gerais
router.get("/suplements/find/all/:store_id", SuplementController.findAllSuplements)
router.get("/suplements/find/name", SuplementController.findSuplementsByName)
router.get("/finda/all", SuplementController.findAll)

module.exports = router