'use client'
import { Text } from '@tremor/react'

interface InputRangeProps {
    label: string
    min: number
    max: number
    step: number
    handleRange: React.Dispatch<React.SetStateAction<number>>
    value: number
}

export default function InputRange({
    label = 'label',
    min = 0,
    max = 100,
    step = 1,
    handleRange,
    value = 0,
}: InputRangeProps) {
    return (
        <div className="flex items-center justify-start w-full gap-4">
            <Text>
                <label htmlFor={label}>{label}</label>
            </Text>
            <input
                type="range"
                className="transparent h-1.5 w-8/12 cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
                id={label}
                min={min}
                max={max}
                step={step}
                defaultValue={value}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseFloat(e.target.value)
                    if (typeof value === 'number') {
                        handleRange(value)
                    }
                }}
            />
            <Text>
                {' '}
                <span className="text-neutral-800 ">{value}</span>{' '}
            </Text>
        </div>
    )
}
