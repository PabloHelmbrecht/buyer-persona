import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import csvParser from 'csv-parser';

type CsvRow = { [ke{ [key: string]: string }nst uploadCsv = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to parse form data' });
      return;
    }

    let { file, options } = files;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    if (!options) {
      res.status(400).json({ error: 'No options uploaded' });
      return;
    }

    console.log(options);

    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on('data', (row: CsvRow) => {
        console.log(row);
      })
      .on('end', () => {
        res.status(200).json({ message: 'CSV file uploaded and parsed' });
      });
  });
};

export default uploadCsv;
