const { z } = require("zod")


const messageSchema = z.object({
    message: z.string({ required_error: "No es un string" })
        .regex(new RegExp("^\\D*\\d{5,}\\D*$"), { message: "Este no es un numero de DNI valido" })
})


module.exports = { messageSchema } 