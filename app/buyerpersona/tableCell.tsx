'use client'
import { TableCell } from '@tremor/react'
import { attributeNumber, attributeType } from '../../lib/BuyerPersonaGenerator'

interface TableCellProps {
    cellData?: attributeNumber | attributeType[] | number | undefined
    textAlignment?: 'text-left' | 'text-center' | 'text-right' | 'text-justify' | 'text-start' | 'text-end' | undefined
}

function isAttributeNumber(object: any): object is attributeNumber {
    return true
}

function isAttributeType(object: any): object is attributeType[] {
    return true
}

function CustomTableCell({ cellData, textAlignment = 'text-center' }: TableCellProps) {
    if (typeof cellData === 'number') {
        return <TableCell textAlignment={textAlignment}>{cellData}</TableCell>
    }

    if (isAttributeType(cellData) && Array.isArray(cellData)) {
        return <TableCell textAlignment={textAlignment}>{cellData[0][0]}</TableCell>
    }
    if (isAttributeNumber(cellData) && typeof cellData === 'object') {
        return <TableCell textAlignment={textAlignment}>{cellData.mean}</TableCell>
    }

    return <TableCell textAlignment={textAlignment}>#ERROR</TableCell>
}

export default CustomTableCell
