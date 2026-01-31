import React from 'react'

type Props = {
    beforeId: string;
}

const DropIndicator = ({ beforeId }: Props) => {

    return (
        <div
            className='indicator my-0.5 h-0.5 w-full bg-gradient-gold-gbcs opacity-0'
            data-before={beforeId || "-1"} />
    )
}

export default DropIndicator