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

import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

const categories: {
  title: string;
  metric: string;
  metricPrev: string;
}[] = [
  {
    title: 'Sales',
    metric: '$ 12,699',
    metricPrev: '$ 9,456'
  },
  {
    title: 'Profit',
    metric: '$ 40,598',
    metricPrev: '$ 45,564'
  },
  {
    title: 'Customers',
    metric: '1,072',
    metricPrev: '86'
  }
];

export default function PlaygroundPage() {
  const [loading, isLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isLoading(true);

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(e);
        isLoading(false);
      }, 5000);
    });

    promise;
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
          {loading?  <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>: <ArrowUpOnSquareIcon className="h-6 w-6" />}
          <span> {loading ? 'Subiendo a' : 'Subir archivo .CSV'}</span>
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
