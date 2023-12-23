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
👨🏻‍💻 Estimado cliente: 
Le informamos que durante el *24/12/2023  al 03/01/2024* nuestro equipo se tomará vacaciones.
            
💡 *No* estaremos brindando *ninguno de nuestros servicios* por ese periodo.
            
⚠️ Le recordamos que *no debe abonar a extraños durante esos días,* caso contrario *su pago no será reconocido.*
            
🎄*_BGM HOGAR les desea: feliz Navidad y un próspero año nuevo._* 🎉🥂 
            
🤍 ¡Gracias por elegirnos! 💫
            
📲 Se encuentra *HABILITADO* el pago via *TRANSFERENCIA* 📲
            
Para consultar su deuda ingrese 'mi dni es' seguido de su numero de documento
        `})
    }


}

module.exports = { whatsappValidations }