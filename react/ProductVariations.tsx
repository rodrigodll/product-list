import type { FunctionComponent } from 'react'
import React from 'react'
import type { SkuSpecification } from 'vtex.checkout-graphql'
import { useCssHandles } from 'vtex.css-handles'

import { useItemContext } from './ItemContext'
import { opaque } from './utils/opaque'

const CSS_HANDLES = [
  'productVariationsContainer',
  'productVariationsItem',
  'productVariationsItemValue'
] as const

const ProductVariations: FunctionComponent = () => {
  const { item } = useItemContext()
  const handles = useCssHandles(CSS_HANDLES)

  return item.skuSpecifications && item.skuSpecifications.length > 0 ? (
    <div
      className={`c-muted-1 f6 lh-copy ${
        handles.productVariationsContainer
      } ${opaque(item.availability)}`}
    >
      {item.skuSpecifications.map((spec: SkuSpecification) => {
        return (
          <div
            className={`${handles.productVariationsItem} ${handles.productVariationsItem}--${spec.fieldName}`}
            id={`specification-${item.id}-${spec.fieldName}`}
            key={spec.fieldName || undefined}
          >
            {`${spec.fieldName?.toLocaleLowerCase()}: `} <span title={spec.fieldValues.join(', ')} className={handles.productVariationsItemValue}>{spec.fieldValues.join(', ')?.toLocaleLowerCase()}</span>
          </div>
        )
      })}
    </div>
  ) : null
}

export default ProductVariations
