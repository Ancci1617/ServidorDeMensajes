const { z } = require("zod");
const { messageSchema } = require("../schema/whatsapp.request.schema.js");
const whatsappValidations = (req, res, next) => {
    const { message } = req.body;

    try {
        messageSchema.parse(req.body)
        next()



    } catch (error) {


        return res.json({
            reply: `
            Actualmente no nos encontramos trabajando, 
            en caso que quieras abonar tu cuota debes enviarnos en un mensaje: 
            'Mi dni es ' seguido de tu numero de dni, sin puntos ni espacios
        `})
    }


}

module.exports = { whatsappValidations }