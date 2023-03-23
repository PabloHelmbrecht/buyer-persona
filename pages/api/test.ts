import { NextRequest, NextResponse } from 'next/server';
/*import BuyerPersonaGenerator, {
  BuyerPersonaGeneratorOptions
} from '../../lib/BuyerPersonaGenerator';*/

//Borrar después
import fs from 'fs';
import csvParser from 'csv-parser';

export const config = {
  runtime: 'edge'
};

const edgeFunction = async (req: NextRequest) => {
  const form = await req.formData();
  const file = form.get('file');

  if (file instanceof File) {
    file.stream();
  }

  const options = form.get('options');
  return NextResponse.json({ tipo: options });
};

export default edgeFunction;
