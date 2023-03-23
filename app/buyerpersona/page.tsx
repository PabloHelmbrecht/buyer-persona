'use client';

import React, { useState } from 'react';
import {
  Card,
  Metric,
  Text,
  Flex,
  ColGrid,
  Title,
  BarList
} from '@tremor/react';
import Papa from 'papaparse';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Spinner from './spinner';

export default function PlaygroundPage() {
  const [loading, isLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    isLoading(true);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results.data);
      }
    });
    isLoading(false);
  };

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
            onChange={handleFileChange}
            type="file"
          />
        </label>
      </Flex>
    </main>
  );
}
