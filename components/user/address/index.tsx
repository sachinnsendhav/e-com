import React, { useState, useEffect } from "react"

type AddressType = {
    show: boolean;
}

const Address = ({ show }: AddressType) => {
    const style = {
        display: show ? 'flex' : 'none',
    }
    const [authToken, setAuthToken] = useState<any>()
    const [address, setAddress] = useState([]);
    useEffect(() => {
        setAuthToken(localStorage.getItem('token'))
    }, [])
    const getAddresses = async () => {

        if (authToken) {
            try {
                const resp = await fetch('http://glue.us.spryker.local/customers/DE--21/addresses', {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${authToken}`
                    }
                })
                const result = await resp.json()
                setAddress(result.data)
            } catch {
                setAddress([])
                localStorage.setItem("status", "false")
            }
        }
    }
    useEffect(() => {
        getAddresses()
    }, [authToken])
    return (
        <section style={style}>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
            }}>
                {address.map((val: any) => {
                    return (
                        <div style={{ margin: "10px",width:"45%", border: "1px solid #7f7f7f", borderRadius: "10px", padding: "10px", paddingInline: "50px" }}>
                            <div >

                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>Name </p><p> {val.attributes.firstName + " " + val.attributes.lastName} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>Address </p><p>{val?.attributes?.address1 + ", " + val?.attributes?.address2} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>City </p><p>{val.attributes.city} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>Country </p><p>{val.attributes.country} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>Company </p><p>{val.attributes.company} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>iso2Code</p><p>{val.attributes.iso2Code} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>Zip code</p><p>{val.attributes.zipCode} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>Phone No.</p><p>{val.attributes.phone} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{padding:"5px", fontWeight:"bold", width:"150px"}}>Salutation</p><p>{val.attributes.salutation} </p>
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Address