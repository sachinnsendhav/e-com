import { API_URL } from "config";
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
                const resp = await fetch(`${API_URL}/customers/DE--21/addresses`, {
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
            {/* <div style={{
                display: "flex",
                flexWrap: "wrap",
            }}>
                {address.map((val: any) => {
                    return (
                        <div style={{ margin: "10px", width: "45%", border: "1px solid #7f7f7f", borderRadius: "10px", padding: "10px", paddingInline: "50px" }}>
                            <div >

                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Name </p><p> {val.attributes.firstName + " " + val.attributes.lastName} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Address </p><p>{val?.attributes?.address1 + ", " + val?.attributes?.address2} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>City </p><p>{val.attributes.city} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Country </p><p>{val.attributes.country} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Company </p><p>{val.attributes.company} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>iso2Code</p><p>{val.attributes.iso2Code} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Zip code</p><p>{val.attributes.zipCode} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Phone No.</p><p>{val.attributes.phone} </p>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <p style={{ padding: "5px", fontWeight: "bold", width: "150px" }}>Salutation</p><p>{val.attributes.salutation} </p>
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div> */}
            <div className="address-list" style={{ width: "90%", margin: "auto" }}>
                <table>
                    <tbody >
                        <tr style={{ border: "1px solid black" }}>
                            <th style={{ color: "black", paddingTop: "20px" }}>Name</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Address</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>City</th>
                            <th style={{ color: "black", paddingTop: "20px"}}>Country</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Phone No.</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Zipcode</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Company</th>

                        </tr>
                        {address.length > 0 ? address.map((item: any) => {
                            return (
                                <tr style={{ border: "1px solid black" }}>
                                    <td>{`${item.attributes.salutation} ${item.attributes.firstName} ${item.attributes.lastName}`} </td>
                                    <td>{`${item.attributes?.address1}, ${item.attributes?.address2}`}</td>
                                    <td>{item.attributes.city}</td>
                                    <td>{`${item.attributes.country}, (${item.attributes.iso2Code})`}</td>
                                    <td>{item.attributes.phone}</td>
                                    <td>{item.attributes.zipCode}</td>
                                    <td>{item.attributes.company}</td>

                                </tr>)
                        }) : null}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default Address