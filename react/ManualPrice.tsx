import React, { FunctionComponent, Fragment, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedPrice } from 'vtex.formatted-price'
import { Button, ButtonPlain, InputCurrency, Modal, Tag } from 'vtex.styleguide'

import { useItemContext } from './ItemContext'
import { getFormattedPrice } from './utils/price'

const ManualPrice: FunctionComponent = () => {
  const {
    item,
    itemIndex,
    shouldAllowManualPrice,
    onSetManualPrice,
  } = useItemContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [manualPrice, setManualPrice] = useState(item.sellingPrice)
  const priceChanged = item.price !== item.sellingPrice

  const submitManualPrice = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    onSetManualPrice(manualPrice!, itemIndex)
    setIsModalOpen(false)
  }

  const handleManualPriceChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newManualPrice = evt.target.value
    setManualPrice(parseFloat(newManualPrice) * 100)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setManualPrice(item.sellingPrice)
    setIsModalOpen(false)
  }

  const revertToOriginalPrice = () => {
    onSetManualPrice(item.price!, itemIndex)
    setManualPrice(item.price)
    setIsModalOpen(false)
  }

  return (
    <Fragment>
      {shouldAllowManualPrice && (
        <div className="flex flex-column items-center mt3">
          {priceChanged ? (
            <div>
              <div className={`flex-grow-0 tc mb2 c-muted-1`}>
                <FormattedPrice
                  value={manualPrice != null ? manualPrice / 100 : manualPrice}
                />
              </div>
              <div className="flex-grow-0 mb3 tc">
                <Tag size="small" bgColor="#3F3F40" className="fw5">
                  <FormattedMessage id="store/product-list.priceChanged"></FormattedMessage>
                </Tag>
              </div>
              <ButtonPlain size="small" onClick={handleOpenModal}>
                <FormattedMessage id="store/product-list.priceOptions"></FormattedMessage>
              </ButtonPlain>
            </div>
          ) : (
            <ButtonPlain size="small" onClick={handleOpenModal}>
              <FormattedMessage id="store/product-list.changePrice"></FormattedMessage>
            </ButtonPlain>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="w-25">
        <div className="flex flex-column">
          <span className="t-small mw9 mb1">
            <FormattedMessage id="store/product-list.originalPrice"></FormattedMessage>
          </span>
          <div className={`c-muted-1 mb3 ${priceChanged ? 'strike' : ''}`}>
            <FormattedPrice
              value={item.price != null ? item.price / 100 : item.price}
            />
          </div>

          <label className="t-small mw9 mb2">
            <FormattedMessage id="store/product-list.changeTo"></FormattedMessage>
          </label>
          <div className="flex flex-row flex-grow mb3">
            <div className="mr2">
              <InputCurrency
                id="manual-price-input"
                placeholder="Type a monetary value"
                locale="pt-BR"
                currencyCode="BRL"
                value={getFormattedPrice(manualPrice)}
                onChange={handleManualPriceChange}
              />
            </div>

            <Button
              variation="secondary"
              size="regular"
              onClick={submitManualPrice}
            >
              ok
            </Button>
          </div>

          {priceChanged && (
            <div>
              <ButtonPlain onClick={revertToOriginalPrice}>
                <FormattedMessage id="store/product-list.revertToOriginal"></FormattedMessage>
              </ButtonPlain>
            </div>
          )}
        </div>
      </Modal>
    </Fragment>
  )
}

export default ManualPrice
