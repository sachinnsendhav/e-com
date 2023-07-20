import { API_URL } from "config";
import React, { useState, useEffect } from "react"
//@ts-ignore
import deleteIcon from '../../../assets/images/delete.png'
type AddressType = {
    show: boolean;
}

const Address = ({ show }: AddressType) => {
    const style = {
        display: show ? 'block' : 'none',
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

    const deleteAddress = async (id: any) => {
        const resp = await fetch(`${API_URL}/customers/DE--21/addresses/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${authToken}`
            }
        });
        if (resp.status === 204) {
            const updatedItems = address.filter((item: any) => item.id !== id);
            setAddress(updatedItems || [])
            alert("deleted sucessfully...!")
        }
    }
    return (
        <div style={style}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h1 style={{
                    fontWeight: "500",
                    fontSize: "1.5rem",
                    lineHeight: "1.4",
                    display: "block",
                    color: "#333",
                }}>Addresses</h1>
                <button style={{ padding: "10px", fontWeight: "bold", color: "white", background: "rgb(207, 18, 46)", borderRadius: "1px" }}> Add New Address</button>
            </div>
            <div style={{ display: "flex" }}>
                {address?.length > 0 ? address.map((item: any) => {
                    return (
                        <div style={{ width: "50%", background: "#f2f2f2", margin: "1rem", padding: "1rem" }}>
                            <div style={{ display: "flex", justifyContent: "end" }}>
                                <button onClick={() => deleteAddress(item.id)}>
                                    <img src={deleteIcon.src} alt="" style={{ height: "25px", width: "25px" }} />
                                </button>
                            </div>
                            <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px", fontFamily: "sans-serif" }}>{item.attributes.salutation} <span style={{ fontWeight: "bold", color: "#333" }}>{item.attributes.firstName} {item.attributes.lastName}</span> </p>
                            <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px", fontFamily: "sans-serif" }}>{item.attributes.company}</p>
                            <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px", fontFamily: "sans-serif" }}>{`${item.attributes?.address1}, ${item.attributes?.address2}`}</p>
                            <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px", fontFamily: "sans-serif" }}>{item.attributes.zipCode}, {item.attributes.city}, {item.attributes.company}</p>
                            <p style={{ color: "#8f8f8f", fontSize: "15px", padding: "4px", fontFamily: "sans-serif" }}>{item.attributes.phone}</p>
                            <div style={{
                                display: "flex",
                                marginTop: "0.875rem",
                                marginBottom: "0.3125rem"
                            }}>
                                {item.attributes.isDefaultBilling ?
                                    <p style={{
                                        background: "#dce0e5",
                                        color: "#4c4c4c",
                                        letterSpacing: "0.0125rem",
                                        borderRadius: "2px",
                                        fontSize: "0.6875rem",
                                        lineHeight: "normal",
                                        fontWeight: "700",
                                        padding: "0.5rem",
                                        marginRight: "10px"
                                    }}> BILLING ADDRESS</p> : null}
                                {item.attributes.isDefaultShipping ?
                                    <p style={{
                                        background: "#dce0e5",
                                        color: "#4c4c4c",
                                        letterSpacing: "0.0125rem",
                                        borderRadius: "2px",
                                        fontSize: "0.6875rem",
                                        lineHeight: "normal",
                                        fontWeight: "700",
                                        padding: "0.5rem"
                                    }}> SHIPPING ADDRESS</p> : null}
                            </div>
                        </div>
                    )
                }) : ""}
            </div>
        </div>
    )
}

export default Address