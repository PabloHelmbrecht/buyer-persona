import { InboxArrowDownIcon } from '@heroicons/react/24/outline'
import CustomTableCell from './tableCell'
import { CSVLink } from 'react-csv'
import { Data } from 'react-csv/components/CommonPropTypes'
import { attributeBuyerPersonaData } from '../../lib/BuyerPersonaGenerator'
import SkeletonText from '../skeleton-text'
import ErrorBoundary from '../error-boundary'

import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, Title, TableCell } from '@tremor/react'

interface BuyerPersonaTableProps {
    data: attributeBuyerPersonaData[] | undefined
    csvData: Data
    loadingTableState: boolean
}

function BuyerPersonaTable({ data, csvData, loadingTableState }: BuyerPersonaTableProps) {
    if (data === undefined) {
        return <Card maxWidth="max-w-full">Sin Datos</Card>
    }
    return (
        <Card maxWidth="max-w-full">
            <div className="flex justify-between items-start mb-2 overflow-hidden">

                <div className='flex items-center justify-center justify-items-center content-center gap-2'>
                    <Title>Lista de Segmentaciones Generadas: </Title>
                    {loadingTableState ? <SkeletonText className='h-5 w-10 rounded-sm' /> : <Title>{data.length}</Title>}
                </div>
                <ErrorBoundary>
                    <CSVLink data={csvData} filename={'datos_segmentados.csv'}>
                        <div className="bg-blue-500 hover:bg-blue-600 flex justify-center content-center items-center rounded-md aspect-square h-8">
                            <InboxArrowDownIcon className="h-5 w-5 text-white" />
                        </div>
                    </CSVLink>
                </ErrorBoundary>
            </div>
            <Table marginTop="mt-5">
                <TableHead>
                    <TableRow>
                        {Object.keys(data[0]).map((header) => (
                            <TableHeaderCell textAlignment='text-center' key={header}>
                                {header.charAt(0).toUpperCase() + header.slice(1)}
                            </TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((entry, entryIndex) => (
                        <TableRow key={entryIndex}>
                            {Object.keys(entry).map((entryField: any, fieldIndex) => {
                                if (loadingTableState) {
                                    return (
                                        <TableCell
                                            key={fieldIndex}
                                        ><SkeletonText className='h-5 w-full rounded-sm' /></TableCell>
                                    )
                                }
                                else {
                                    return (
                                        <CustomTableCell
                                            key={fieldIndex}
                                            cellData={entry[entryField]}
                                            rowIndex={entryIndex+1}
                                        />
                                    )
                                }
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default BuyerPersonaTable
