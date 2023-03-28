import { InboxArrowDownIcon } from '@heroicons/react/24/outline'
import CustomTableCell from './tableCell'
import { CSVLink } from 'react-csv'
import { attributeBuyerPersonaData } from '../../lib/BuyerPersonaGenerator'

import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, Title } from '@tremor/react'

interface BuyerPersonaTableProps {
    data: attributeBuyerPersonaData[]
    csvData: object[]
}

function BuyerPersonaTable({ data, csvData }: BuyerPersonaTableProps) {
    if (data === undefined) {
        return <Card maxWidth="max-w-full">Sin Datos</Card>
    }
    return (
        <Card maxWidth="max-w-full">
            <div className="flex justify-between items-start mb-2">
                <Title>Lista de Segmentaciones Generadas</Title>

                <div className="bg-blue-500 hover:bg-blue-600 flex justify-center content-center items-center rounded-md aspect-square h-8">
                    <InboxArrowDownIcon className="h-5 w-5 text-white" />
                </div>
            </div>
            <Table marginTop="mt-5">
                <TableHead>
                    <TableRow>
                        {Object.keys(data[0]).map((header) => (
                            <TableHeaderCell key={header}>
                                {header.charAt(0).toUpperCase() + header.slice(1)}
                            </TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((entry, entryIndex) => (
                        <TableRow key={entryIndex}>
                            {Object.keys(entry).map((entryField: any, fieldIndex) => {
                                return (
                                    <CustomTableCell
                                        key={fieldIndex}
                                        cellData={entry[entryField]}
                                    />
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default BuyerPersonaTable
