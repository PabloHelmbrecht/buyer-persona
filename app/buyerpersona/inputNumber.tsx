'use client'
import { useState } from 'react'
import { Text } from '@tremor/react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

interface InputNumberProps {
    min?: number
    max?: number
    defaultValue?: number
    label?: string
    handleNumber: React.Dispatch<React.SetStateAction<number>>
}

function Contador({
    min = 0,
    max = 100,
    defaultValue = 1,
    label = 'label',
    handleNumber: handleNumber,
}: InputNumberProps) {
    const [count, setInternalCount] = useState(defaultValue)

    const handleIncrement = () => {
        if (count < max) {
            const newCount = count + 1
            setInternalCount(newCount)
            handleNumber(newCount)
        }
    }

    const handleDecrement = () => {
        if (count > min) {
            const newCount = count - 1
            setInternalCount(newCount)
            handleNumber(newCount)
        }
    }

    const buttonClasses =
        'bg-blue-500 hover:bg-blue-600 flex justify-center content-center items-center rounded-sm aspect-square h-7'
    const iconClases = 'h-4 w-4 text-white font-bold'

    return (
        <div className="w-32 flex gap-4 items-center items w-fit overflow-hidden">
            <Text textAlignment="text-center">
                <label>{label}</label>
            </Text>
            <div className="flex justify-center content-center items-center gap-1">
                <button
                    className={buttonClasses}
                    onClick={handleDecrement}
                >
                    <MinusIcon className={iconClases} />
                </button>
                <div>
                    <input
                        className="w-12 h-7 align-middle text-center bg-neutral-200 rounded-sm text-elem tremor-base tr-shrink-0 tr-mt-0s text-neutral-800 tr-text-sm tr-font-normal"
                        type="text"
                        value={count}
                        readOnly
                        onChange={(event) => {
                            const newValue = Number(event.target.value)
                            if (newValue >= min && newValue <= max) {
                                setInternalCount(newValue)
                                handleNumber(newValue)
                            }
                        }}
                    />
                </div>
                <button
                    className={buttonClasses}
                    onClick={handleIncrement}
                >
                    <PlusIcon className={iconClases} />
                </button>
            </div>
        </div>
    )
}

export default Contador
