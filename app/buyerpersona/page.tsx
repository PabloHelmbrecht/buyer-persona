'use client'

import React, { useState, useMemo } from 'react'
import Papa, { ParseResult } from 'papaparse'
import axios from 'axios'
import { Card, Metric, Text, Flex as div, Divider, Title } from '@tremor/react'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'

import Spinner from './spinner'
import InputRange from './inputRange'
import InputNumber from './inputNumber'
import BuyerPersonaTable from './table'
import { BuyerPersonaGeneratorOptions, dataRow, attributeBuyerPersonaData } from '../../lib/BuyerPersonaGenerator'

export default function PlaygroundPage() {
    const [loading, isLoading] = useState(false)
    const [jsonFile, setJSONFile] = useState<dataRow[]>()
    const [limitValuesPerHeader, setLimitValuesPerHeader] = useState<number>(70)
    const [neighborhoodRadius, setNeighborhoodRadius] = useState<number>(0.25)
    const [minPointsPerCluster, setMinPointsPerCluster] = useState<number>(20)
    const [table, setTable] = useState<attributeBuyerPersonaData[] | undefined>()
    const [csvData, setCSVData] = useState()

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            Papa.parse(event.target.files[0], {
                delimiter: ',',
                transform: (value: string) => {
                    const number = parseFloat(value)
                    if (!isNaN(number)) {
                        return number
                    } else {
                        return value
                    }
                },
                header: true,
                complete: (results: ParseResult<dataRow>) => {
                    setJSONFile(results.data)
                },
            })
        }
    }

    useMemo(() => {
        async function buyerPersonaGeneratorCall() {
            try {
                const options: BuyerPersonaGeneratorOptions = {
                    limitValuesPerHeader,
                    neighborhoodRadius,
                    minPointsPerCluster,
                }

                const response = await axios.post('/api/buyerPersona', {
                    jsonFile,
                    options,
                })
                return response
            } catch (e) {
                console.log(e)
                return e
            }
        }

        //Si no se cumplen abandono

        if (!jsonFile) return
        if (typeof limitValuesPerHeader !== 'number') return
        if (typeof neighborhoodRadius !== 'number') return
        if (typeof minPointsPerCluster !== 'number') return
        isLoading(true)
        buyerPersonaGeneratorCall().then((response: any) => {
            console.log(response.data)
            setTable(response.data.buyerPersonaData)
            setCSVData(response.data.clusterizedData)
            isLoading(false)
        })
    }, [jsonFile, limitValuesPerHeader, neighborhoodRadius, minPointsPerCluster])

    return (
        <main className="p-4 md:p-10 mx-auto flex flex-col items-center">
            <Metric
                marginTop="mt-4"
                textAlignment="text-center"
            >
                Subir
            </Metric>
            <Text
                textAlignment="text-center"
                marginTop="mt-4"
            >
                Haz click en el botón debajo para subir el archivo .CSV
            </Text>

            <Transition
                show={table === undefined}
                enter="transition ease-out duration-300 delay-200"
                enterFrom="-translate-y-4 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transition ease-in duration-300"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="-translate-y-4 opacity-0"
                className="mt-8"
            >
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
            </Transition>

            <div className="w-80">
                <Card marginTop="mt-8">
                    <Title>Parámetros</Title>
                    <Divider />
                    <div className="flex items-start flex-col gap-6">
                        <InputRange
                            label="Ajuste:"
                            min={0}
                            max={2}
                            step={0.05}
                            handleRange={setNeighborhoodRadius}
                            value={neighborhoodRadius}
                        />
                        <InputNumber
                            handleNumber={setLimitValuesPerHeader}
                            label="Valores por Columna:"
                        />
                        <InputRange
                            label="Ruido"
                            min={0}
                            max={100}
                            step={1}
                            handleRange={setMinPointsPerCluster}
                            value={minPointsPerCluster}
                        />
                    </div>
                </Card>
            </div>

            <Transition
                show={table !== undefined}
                enter="transition ease-out duration-300 delay-500"
                enterFrom="-translate-y-4 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transition ease-in duration-300"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="-translate-y-4 opacity-0"
                className="mt-8 w-11/12"
            >
                <BuyerPersonaTable
                    data={table}
                    csvData={csvData}
                />
            </Transition>
        </main>
    )
}
