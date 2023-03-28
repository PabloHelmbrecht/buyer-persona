import { NextRequest, NextResponse } from 'next/server'
import { json } from 'node:stream/consumers'
import BuyerPersonaGenerator from '../../lib/BuyerPersonaGenerator'

export const config = {
    runtime: 'edge',
}
const edgeFunction = async (req: NextRequest) => {
    try {
        const { jsonFile, options } = await new Response(req.body).json()
        const buyerPersona = new BuyerPersonaGenerator(options)
        await buyerPersona.loadCSVFromJSON(jsonFile)
        await buyerPersona.runClustering()
        return NextResponse.json({
            buyerPersonaData: buyerPersona.buyerPersonaData,
            tableData: buyerPersona.clusterizedData,
            data: buyerPersona._data,
            parseData: buyerPersona._parsedData,
        })
    } catch (error) {
        return NextResponse.json(JSON.stringify({ error }))
    }
}

export default edgeFunction
