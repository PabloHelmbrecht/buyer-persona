import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import BuyerPersonaGenerator, {
  BuyerPersonaGeneratorOptions
} from '../../lib/BuyerPersonaGenerator';

//Borrar después
import fs from 'fs';
import csvParser from 'csv-parser';

export const config = {
  runtime: 'edge'
};

const edgeFunction = (req: any) => {
  //Obtengo el Middleware para procesar el form
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    //Si hay algún error envío una respuesta
    if (err) {
      console.error(err);
      NextResponse.json({ error: 'Failed to parse form data' });
      return;
    }

    const { file } = files;
    const { options } = fields;
    if (!file) {
      NextResponse.json({ error: 'No file uploaded' });
      return;
    }
    if (!options) {
      NextResponse.json({ error: 'No options uploaded' });
      return;
    }
  });

  fs.createReadStream(file.path)
    .pipe(csvParser())
    .on('data', (row: { [key: string]: string }) => {
      console.log(row);
    })
    .on('end', () => {
      NextResponse.json({ message: 'CSV file uploaded and parsed' });
    });
};

export default edgeFunction;
