const { Router } = require("express");
const router = Router();
const whatsappController = require("../controller/whatsapp.controller.js");
const { whatsappValidations } = require("../middleware/whatsapp.validations.js");


router.post("/getClientDebt", whatsappValidations,whatsappController.getClientDebt)










module.exports = router