'use client'
import { useState } from 'react'
import { TableCell, DonutChart, Text, Bold } from '@tremor/react'
import { attributeNumber, attributeType } from './../lib/BuyerPersonaGenerator'
import { Transition } from '@headlessui/react'

interface TableCellProps {
    cellData?: attributeNumber | attributeType[] | number | undefined
    textAlignment?: 'text-left' | 'text-center' | 'text-right' | 'text-justify' | 'text-start' | 'text-end' | undefined
    rowIndex?: number
}

function isAttributeNumber(object: any): object is attributeNumber {
    return true
}

function isAttributeType(object: any): object is attributeType[] {
    return true
}

function CustomTableCell({ cellData, textAlignment = 'text-center', rowIndex = 1 }: TableCellProps) {
    const [open, setOpen] = useState<boolean>(false)

    const handleMouseEnter = () => {
        setOpen(true)
    }

    const handleMouseLeave = () => {
        setOpen(false)
    }

    if (typeof cellData === 'number') {
        return <TableCell textAlignment={textAlignment}>{parseInt((cellData * 100).toString()) / 100}</TableCell>
    }

    if (isAttributeType(cellData) && Array.isArray(cellData)) {
        return (
            <TableCell textAlignment={textAlignment}>
                <div
                    className="relative flex flex-col overflow-visible "
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {cellData[0][0]}

                    <Transition
                        show={open}
                        enter="transition ease-out duration-300 delay-200"
                        enterFrom="-translate-y-4 opacity-0"
                        enterTo="translate-y-0 opacity-100"
                        leave="transition ease-in duration-300 delay-100"
                        leaveFrom="translate-y-0 opacity-100"
                        leaveTo="-translate-y-4 opacity-0"
                        className={`flex flex-col gap-2 items-center absolute z-10 ${
                            rowIndex > 3 ? 'bottom-8' : 'top-10'
                        } w-44 h-48 left-2/4 -translate-x-1/2 transform rounded-md border-t-4	border-blue-500 bg-white p-3 text-left align-middle shadow-md transition-all opacity-100 scale-100`}
                    >
                        <Bold>Grupo #{rowIndex}</Bold>
                        <DonutChart
                            data={cellData.map((value) => {
                                return { name: value[0], cantidad: parseInt((value[1] * 100).toString()) / 100 }
                            })}
                            category="cantidad"
                            colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                            variant="pie"
                        />
                    </Transition>
                </div>
            </TableCell>
        )
    }
    if (isAttributeNumber(cellData) && typeof cellData === 'object') {
        return (
            <TableCell textAlignment={textAlignment}>
                <div
                    className="relative flex flex-col overflow-visible "
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {parseInt((cellData.mean * 100).toString()) / 100}

                    <Transition
                        show={open}
                        enter="transition ease-out duration-300 delay-200"
                        enterFrom="-translate-y-4 opacity-0"
                        enterTo="translate-y-0 opacity-100"
                        leave="transition ease-in duration-300 delay-100"
                        leaveFrom="translate-y-0 opacity-100"
                        leaveTo="-translate-y-4 opacity-0"
                        className={`flex flex-col gap-2 items-center absolute z-10 ${
                            rowIndex > 3 ? 'bottom-8' : 'top-10'
                        } w-44 h-fit left-2/4 -translate-x-1/2 transform rounded-md border-t-4	border-blue-500 bg-white p-3 text-left align-middle shadow-md transition-all opacity-100 scale-100`}
                    >
                        <Bold>Grupo #{rowIndex}</Bold>
                        <div className="flex flex-col gap-2 mt-1 mb-1">
                            <Text>
                                Media:{'  '}
                                <span className="text-blue-400 font-medium">
                                    {parseInt((cellData.mean * 100).toString()) / 100}
                                </span>
                            </Text>
                            <Text>
                                Desviación Típica:{'  '}
                                <span className="text-blue-400 font-medium">
                                    {parseInt((cellData.sdev * 100).toString()) / 100}
                                </span>
                            </Text>
                            <Text>
                                Máximo:{'  '}
                                <span className="text-blue-400 font-medium">
                                    {parseInt((cellData.max * 100).toString()) / 100}
                                </span>
                            </Text>
                            <Text>
                                Mínimo:{'  '}
                                <span className="text-blue-400 font-medium">
                                    {parseInt((cellData.min * 100).toString()) / 100}
                                </span>
                            </Text>
                        </div>
                    </Transition>
                </div>
            </TableCell>
        )
    }

    return <TableCell textAlignment={textAlignment}>#ERROR</TableCell>
}

export default CustomTableCell

{
    /* */
}
