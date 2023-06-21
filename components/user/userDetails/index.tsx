import React from "react"

type AddressType = {
    show: boolean;
}

const UserDetails = ({ show }: AddressType) => {
    const style = {
        display: show ? 'flex' : 'none',
    }
    return (
        <section style={style}>
            User Details
        </section>
    )
}

export default UserDetails