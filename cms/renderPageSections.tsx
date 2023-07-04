import type { ComponentType } from 'react'
import Banners from '../components/sections/Banners'
import React from 'react';

/**
 * Sections: Components imported from '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: Record<string, ComponentType<any>> = {
    Banners
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections?: Array<{ name: string; data: any }>
}
function RenderPageSections({ sections }: Props) {

  return (
    <>
      {sections?.map(({ name, data }, index) => {
        const Component = COMPONENTS[name]

        if (!Component) {
          console.info(
            `Could not find component for block ${name}. Add a new component for this block or remove it from the CMS`
          )

          return <></>
        }

        return <Component key={`cms-section-${index}`} {...data} />
      })}
    </>
  )
}

export default RenderPageSections
