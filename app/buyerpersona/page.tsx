'use client';

import React, { useState, useMemo } from 'react';
import Papa, { ParseResult } from 'papaparse';
import axios from 'axios';
import { BuyerPersonaGeneratorOptions } from '../../lib/BuyerPersonaGenerator';
import InputRange from './inputRange';
import {
  Card,
  Metric,
  Text,
  Flex,
  ColGrid,
  Title,
  BarList
} from '@tremor/react';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Spinner from './spinner';

interface dataRow {
  [header: string]: string | number;
}

export default function PlaygroundPage() {
  const [loading, isLoading] = useState(false);
  const [jsonFile, setJSONFile] = useState<dataRow[]>();
  const [limitValuesPerHeader, setLimitValuesPerHeader] = useState<number>(70);
  const [neighborhoodRadius, setNeighborhoodRadius] = useState<number>(1);
  const [minPointsPerCluster, setMinPointsPerCluster] = useState<number>(1);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      Papa.parse(event.target.files[0], {
        delimiter: ',',
        transform: (value: string) => {
          const number = parseFloat(value);
          if (!isNaN(number)) {
            return number;
          } else {
            return value;
          }
        },
        header: true,
        complete: (results: ParseResult<dataRow>) => {
          setJSONFile(results.data);
        }
      });
    }
  };

  useMemo(() => {
    async function buyerPersonaGeneratorCall() {
      try {
        const options: BuyerPersonaGeneratorOptions = {
          limitValuesPerHeader,
          neighborhoodRadius,
          minPointsPerCluster
        };

        const response = await axios.post('/api/buyerPersona', {
          jsonFile,
          options
        });
        return response;
      } catch (e) {
        console.log(e);
        return e;
      }
    }

    //Si no se cumplen abandono

    if (!jsonFile) return;
    if (typeof limitValuesPerHeader !== 'number') return;
    if (typeof neighborhoodRadius !== 'number') return;
    if (typeof minPointsPerCluster !== 'number') return;
    isLoading(true);
    buyerPersonaGeneratorCall().then((response) => {
      //console.log(response.data.buyerPersonaData?.length);
      isLoading(false);
    });
  }, [jsonFile, limitValuesPerHeader, neighborhoodRadius, minPointsPerCluster]);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Flex justifyContent="justify-center" marginTop="mt-12">
        <Metric>Generador de Buyer Persona</Metric>
      </Flex>
      <Flex justifyContent="justify-center" marginTop="mt-4">
        <Text textAlignment="text-center">
          Haz click en el botón debajo para subir el archivo .CSV
        </Text>
      </Flex>
      <Flex
        justifyContent="justify-center"
        marginTop="mt-4"
        alignItems="items-center"
      >
        <InputRange
          label="Ajuste"
          min={0}
          max={10}
          step={0.1}
          handleRange={setNeighborhoodRadius}
          value={neighborhoodRadius}
        />
        <InputRange
          label="Ruido"
          min={0}
          max={100}
          step={1}
          handleRange={setMinPointsPerCluster}
          value={minPointsPerCluster}
        />
      </Flex>
      <Flex justifyContent="justify-center" marginTop="mt-8">
        <label
          htmlFor="file-upload"
          className="tremor-base input-elem tr-flex-shrink-0 gap-2 tr-inline-flex tr-items-center tr-group focus:tr-outline-none focus:tr-ring-2 focus:tr-ring-offset-2 focus:tr-ring-transparent tr-font-medium tr-rounded-md tr-border tr-shadow-sm tr-pl-4 tr-pr-4 tr-pt-2.5 tr-pb-2.5 tr-text-lg tr-text-white tr-bg-blue-500 tr-border-transparent focus:tr-ring-blue-400 tr-text-white hover:tr-bg-blue-600 hover:tr-border-blue-600"
        >
          {loading ? <Spinner /> : <ArrowUpOnSquareIcon className="h-6 w-6" />}
          <span> {loading ? 'Subiendo archivo' : 'Subir archivo .CSV'}</span>
          <input
            id="file-upload"
            style={{ display: 'none' }}
            onInput={handleFileChange}
            type="file"
          />
        </label>
      </Flex>
    </main>
  );
}
