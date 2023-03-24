import { NextRequest, NextResponse } from 'next/server'
import BuyerPersonaGenerator, {
  BuyerPersonaGeneratorOptions
} from '../../lib/BuyerPersonaGenerator'

export const config = {
  runtime: 'edge'
}

const edgeFunction = async (req: NextRequest) => {

  const form = await req.formData()


  const file = form.get('file')
  if(!(file instanceof File)) return

  
  const optionsString = form.get('options')?.toString()
  const options: BuyerPersonaGeneratorOptions = optionsString ? JSON.parse(optionsString) : {}


  const buyerPersona = new BuyerPersonaGenerator(file, options)
  await buyerPersona.loadCSVFromFile()
  await buyerPersona.runClustering()

  return NextResponse.json({ msg: "funciona" })
}

export default edgeFunction
