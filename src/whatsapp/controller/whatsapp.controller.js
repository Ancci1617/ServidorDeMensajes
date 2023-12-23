const { getCteDni, getClientes, getFichasByCte } = require("../../model/query");
const { getDebtEasy, getDoubt } = require("../../lib/debt.js");


const getClientDebt = async (req, res) => {
    const { sender, message, phone } = req.body;

    try {

        const dni = message.match("\\d+")[0];

        console.log("desde",phone,"dni", dni);

        if (!dni) return res.status(400).json({ reply: "No se encontro un numero de DNI Valido" })

        const { CTE } = await getCteDni(dni)
        if (CTE == -1) {
            return res.json({
                reply: "Lo lamentamos!, ese dni no se encuentra registrado en nuestra base"
            });
        }
        const [CTE_DATA] = await getClientes(CTE);
        // console.log(CTE_DATA)

        const fichas = await getFichasByCte(CTE_DATA.CTE, "CTE");
        if (fichas.length == 0)
            return res.status(200).json({ reply: "No encontramos ninguna deuda asociada a este dni." })


        const fichas_data = fichas.map(ficha => ({
            data: ficha, deuda: ficha.FICHA < 50000 ? getDoubt(ficha) : getDebtEasy(ficha)
        }));

        fichas_data.forEach(ficha =>
            ficha.deuda.cuota = Math.max(Math.min(ficha.data.CUOTA, parseInt(ficha.data.SALDO)), ficha.deuda.cuota)
        );
        const totales = fichas_data.reduce((acumm, ficha) => ({
            cuota: acumm.cuota + ficha.deuda.cuota,
            servicio: acumm.servicio + ficha.deuda.servicio,
            mora: acumm.mora + ficha.deuda.mora
        }), { cuota: 0, servicio: 0, mora: 0 })






        let detail_string = fichas_data.reduce((acum, ficha) => {
            const { cuota, mora, servicio } = ficha.deuda
            const { FICHA } = ficha.data

            acum = acum + "\n" +
                "*" + (FICHA > 50000 ? "💰" : "📝") + FICHA + "*\n" +
                "• $" + cuota + "(cuota)" + "\n" +
                (servicio ? "• $" + servicio + "(servicio)" + "\n" : "") +
                (mora ? "• $" + mora + "(mora)" + "\n" : "")

            return acum
        },
            `
💡Hola *${CTE_DATA.NOMBRE}* el *alias* correspondiente es el siguiente: 👇🏼
*${CTE_DATA.ALIAS}*
        
💳 El total a abonar es: *$${totales.cuota + totales.mora + totales.servicio}* 
• $${totales.cuota} (cuota)
• $${totales.servicio} (servicio)
• $${totales.mora} (mora)
        
Correspondiente a los siguientes créditos:
`)







        return res.status(200).json({
            reply: detail_string

        });


    } catch (error) {
        console.log(error)
        return res.json({ reply: "Ocurrio un error inesperado!, no pudimos consultar tu numero de DNI" });
    }


}




module.exports = { getClientDebt }