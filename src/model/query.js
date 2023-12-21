const pool = require("../model/connection-object.js");

const getCteDni = async (dni) => {

    const [rows] = await pool.query(
        `SELECT CTE,CALLE FROM ClientesSV where ClientesSV.DNI = ? limit 1`, [dni]);
    if (rows.length > 0) {
        return rows[0];
    }
    return { CTE: -1 };

}



const getClientes = async (cte) => {

    const [rows] = await pool.query(
        `SELECT
        ClientesSV.CTE,
        ClientesSV.ZONA,
        ClientesSV.NOMBRE,
        ClientesSV.CALLE,
        ClientesSV.CRUCES,
        ClientesSV.CRUCES2,
        (SELECT BaseCTE.TELEFONO FROM BaseCTE WHERE cte = ? AND ID = (SELECT MAX(ID) from BaseCTE where CTE = ?)) AS WHATSAPP,
        ClientesSV.DNI,
        MasterResumen.CALIF AS MASTER,
        NULL AS OBS
    FROM
        ClientesSV
    LEFT JOIN MasterResumen	 ON MasterResumen.Cliente = ClientesSV.CTE
    WHERE
        ClientesSV.CTE = ?
    LIMIT 1;`, [cte, cte, cte]);

    if (rows.length > 0) {
        return rows;
    }

    return [{
        CTE: null, NOMBRE: null, ZONA: null, CALLE: null, WHATSAPP: null, CRUCES: null, CRUCES2: null, DNI: null
    }];

}



const getFichasByCte = async (CTE = "%", MODO = "CTE") => {
    const [fichas] = await pool.query(
        `SELECT
    Fichas.FECHA AS FECHA_VENTA,
    Fichas.CTE,
    Fichas.PRIMER_PAGO,
    Fichas.FICHA,
    Fichas.Z,
    Fichas.VENCIMIENTO,
    Fichas.TOTAL,
    Fichas.SERVICIO_ANT,
    Fichas.ARTICULOS,
    PagosSV.SERV_PAGO,
    SERV_UNIT,
    CUOTA,
    CUOTA_ANT,
    Fichas.CUOTA_ANT - IFNULL(PagosSV.CUOTA_PAGO,0) AS SALDO,
    CUOTAS,
    IFNULL(PagosSV.CUOTA_PAGO,0) AS CUOTA_PAGO,
    Fichas.MORA_ANT,
    IFNULL(PagosSV.MORA_PAGO,0) AS MORA_PAGO,
    Pagas(IFNULL(CUOTA_PAGO,0) + TOTAL - CUOTA_ANT,CUOTA,0) AS CUOTAS_PAGAS,
    
    (SELECT COUNT(*) FROM CambiosDeFecha WHERE
        CambiosDeFecha.FECHA > DATE_ADD(
            Fichas.VENCIMIENTO,
            INTERVAL Pagas(
                IFNULL(CUOTA_PAGO,0) + TOTAL - CUOTA_ANT,
                CUOTA,0
            ) MONTH
        ) AND CambiosDeFecha.FICHA = Fichas.FICHA
	) AS CAMBIOS_DE_FECHA,
    
    LEAST((SELECT COUNT(*) FROM CambiosDeFecha WHERE
        CambiosDeFecha.FECHA > DATE_ADD(
            Fichas.VENCIMIENTO,
            INTERVAL Pagas(
                IFNULL(CUOTA_PAGO,0) + TOTAL - CUOTA_ANT,
                CUOTA,1
            ) MONTH
        ) AND CambiosDeFecha.FICHA = Fichas.FICHA AND OFICINA = 0 
	),5) AS CAMBIOS_DE_FECHA_EXACTO,

    EXISTS (SELECT 1 from CambiosDeFecha where CambiosDeFecha.FECHA = CURRENT_DATE and CambiosDeFecha.FICHA = Fichas.FICHA) as SERVICIO_HOY


FROM

    (SELECT *,ROUND(TOTAL / CUOTA,0) AS CUOTAS FROM Fichas) Fichas
    
LEFT JOIN(
    SELECT
        PagosSV.FICHA,
        SUM(PagosSV.VALOR) AS CUOTA_PAGO,
        SUM(PagosSV.MORA) AS MORA_PAGO,
        SUM(PagosSV.SERV) AS SERV_PAGO
    FROM
        PagosSV
    WHERE
        PagosSV.CONFIRMACION != 'INVALIDO'
    GROUP BY
        FICHA
) PagosSV
ON
    PagosSV.FICHA = Fichas.FICHA
WHERE
    Fichas.?? LIKE ?;`
        // HAVING
        //     SALDO > 0;
        , [MODO, CTE]);

    if (fichas.length > 0) {
        return fichas;
    }

    return [];
}






module.exports = {getCteDni,getClientes,getFichasByCte}