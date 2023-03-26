'use client';
import { Text } from '@tremor/react';

export default function InputRange({
  label = 'label',
  min = 0,
  max = 100,
  step = 1,
  handleRange,
  value = ''
}) {
  return (
    <div className="pl-6 pr-6">
      <Text>
        <label htmlFor={label}>
          {label}: {value}
        </label>
      </Text>
      <input
        type="range"
        className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
        id={label}
        min={min}
        max={max}
        step={step}
        defaultValue={value}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = parseFloat(e.target.value);
          if (typeof value === 'number') {
            handleRange(value);
          }
        }}
      />
    </div>
  );
}
