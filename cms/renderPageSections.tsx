import type { ComponentType } from 'react'
import blog from '../components/sections/Blog'
import carousel from '../components/sections/Carousel'
import industries from '../components/sections/Industries'
import infoTile from '../components/sections/InfoTile'
import news from '../components/sections/News'
import React from 'react';

/**
 * Sections: Components imported from '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: Record<string, ComponentType<any>> = {
    blog,
    carousel,
    industries,
    infoTile,
    news
}

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections?: Array<{ id: string; data: any }>
    imageData : any
}
function RenderPageSections({ sections,imageData }: Props) {
    return (
        <>
            {sections?.map(({ id, data }, index) => {
                const Component = COMPONENTS[id]

                if (!Component) {
                    console.info(
                        `Could not find component for block ${id}. Add a new component for this block or remove it from the CMS`
                    )

                    return <></>
                }

                return <Component key={`cms-section-${index}`} {...data} imageData={imageData}/>
            })}
        </>
    )
}

export default RenderPageSections
