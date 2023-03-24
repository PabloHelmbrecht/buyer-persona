import { NextRequest, NextResponse } from 'next/server';
import BuyerPersonaGenerator, {
  BuyerPersonaGeneratorOptions
} from '../../lib/BuyerPersonaGenerator';

export const config = {
  runtime: 'edge'
};

export default async function buyerPersona(req: NextRequest) {
  try {
    //Si no recibo ningun payload cancelo la API
    if (!req) throw new Error('No hay request');
    if (!req.body) throw new Error('No hay body');
    const options: BuyerPersonaGeneratorOptions = {
      route: 'datos.csv',
      separator: ',',
      limitValuesPerHeader: 70,
      neighborhoodRadius: 15,
      minPointsPerCluster: 15,
      independizeFieldOptions: false
    };

    const buyerPersona = new BuyerPersonaGenerator(options);
    await buyerPersona.loadCSVFromRoute();
    await buyerPersona.runClustering();

    return NextResponse.json({
      rawData: buyerPersona._data,
      buyerPersonaData: buyerPersona.buyerPersonaData,
      clusterizedData: buyerPersona.clusterizedData
    });
  } catch (error) {
    return NextResponse.json({
      error,
      message: 'Hubo un error en la Edge Function'
    });
  }
}
