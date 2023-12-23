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

💡Le informamos que durante el *24/12/2023  al 03/01/2024* el equipo de *BGM HOGAR* se tomará vacaciones. *Todos nuestros servicios estarán suspendidos durante ese período.*

🚨*IMPORTANTE*🚨

📲 Se encuentra *HABILITADO* el pago vía *TRANSFERENCIA*💰

🤳🏼*Para eso, envíanos tu N° DNI para que puedas abonar tus cuotas,* de esa manera podremos brindarte:
• Saldo deuda.
• Alias para transferir.
        `})
    }


}

module.exports = { whatsappValidations }