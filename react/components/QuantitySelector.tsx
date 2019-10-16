import { range } from 'ramda'
import React, { FunctionComponent, useState } from 'react'
import { Dropdown, Input } from 'vtex.styleguide'

const MAX_INPUT_LENGTH = 5

enum SelectorType {
  Dropdown,
  Input,
}

interface Props {
  value: number
  maxValue: number
  onChange: (value: number) => void
  disabled: boolean
}

const normalizeValue = (value: number, maxValue: number) =>
  value > maxValue ? maxValue : value

const validateValue = (value: string, maxValue: number) => {
  const parsedValue = parseInt(value, 10)

  if (isNaN(parsedValue)) {
    return 1
  }

  return normalizeValue(parseInt(value, 10), maxValue)
}

const validateDisplayValue = (value: string, maxValue: number) => {
  const parsedValue = parseInt(value, 10)

  if (isNaN(parsedValue) || parsedValue < 0) {
    return ''
  }

  return `${normalizeValue(parsedValue, maxValue)}`
}

const getDropdownOptions = (maxValue: number) => {
  const limit = Math.min(9, maxValue)
  const options = [
    { value: 0, label: '0' },
    ...range(1, limit + 1).map(idx => ({ value: idx, label: `${idx}` })),
  ]

  if (maxValue >= 10) {
    options.push({ value: 10, label: '10+' })
  }

  return options
}

const QuantitySelector: FunctionComponent<Props> = ({
  value,
  maxValue,
  onChange,
  disabled,
}) => {
  const [curSelector, setSelector] = useState(
    value < 10 ? SelectorType.Dropdown : SelectorType.Input
  )
  const [activeInput, setActiveInput] = useState(false)

  const normalizedValue = normalizeValue(value, maxValue)

  const [curDisplayValue, setDisplayValue] = useState(`${normalizedValue}`)

  const handleDropdownChange = (value: string) => {
    const validatedValue = validateValue(value, maxValue)
    const displayValue = validateDisplayValue(value, maxValue)

    if (validatedValue >= 10 && curSelector === SelectorType.Dropdown) {
      setSelector(SelectorType.Input)
    }

    setDisplayValue(displayValue)
    onChange(validatedValue)
  }

  const handleInputChange = (value: string) => {
    const displayValue = validateDisplayValue(value, maxValue)

    setDisplayValue(displayValue)
  }

  const handleInputBlur = () => {
    setActiveInput(false)
    if (curDisplayValue === '') {
      setDisplayValue('1')
    }

    const validatedValue = validateValue(curDisplayValue, maxValue)
    onChange(validatedValue)
  }

  const handleInputFocus = () => setActiveInput(true)

  if (
    !activeInput &&
    normalizedValue !== validateValue(curDisplayValue, maxValue)
  ) {
    if (normalizedValue >= 10) {
      setSelector(SelectorType.Input)
    }
    setDisplayValue(validateDisplayValue(`${normalizedValue}`, maxValue))
  }

  if (curSelector === SelectorType.Dropdown) {
    const dropdownOptions = getDropdownOptions(maxValue)

    return (
      <div>
        <div className="dn-m">
          <Dropdown
            options={dropdownOptions}
            size="small"
            value={normalizedValue}
            onChange={(event: any) => handleDropdownChange(event.target.value)}
            placeholder=""
            disabled={disabled}
          />
        </div>
        <div className="dn db-m">
          <Dropdown
            options={dropdownOptions}
            value={normalizedValue}
            onChange={(event: any) => handleDropdownChange(event.target.value)}
            placeholder=""
            disabled={disabled}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className="dn-m">
          <Input
            size="small"
            value={curDisplayValue}
            maxLength={MAX_INPUT_LENGTH}
            onChange={(event: any) => handleInputChange(event.target.value)}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder=""
            disabled={disabled}
          />
        </div>
        <div className="dn db-m">
          <Input
            value={curDisplayValue}
            maxLength={MAX_INPUT_LENGTH}
            onChange={(event: any) => handleInputChange(event.target.value)}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder=""
            disabled={disabled}
          />
        </div>
      </div>
    )
  }
}

export default QuantitySelector
