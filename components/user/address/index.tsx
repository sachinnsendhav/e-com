import React from "react"

type AddressType = {
    show: boolean;
}

const Address = ({ show }: AddressType) => {
    const style = {
        display: show ? 'flex' : 'none',
    }
    return (
        <section style={style}>
            Address
        </section>
    )
}

export default Address