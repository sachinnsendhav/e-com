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
        <section style={style}>
            <div className="address-list" style={{ width: "90%", margin: "auto" }}>
                <table>
                    <tbody >
                        <tr style={{ border: "1px solid black" }}>
                            <th style={{ color: "black", paddingTop: "20px" }}>Name</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Address</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>City</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Country</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Phone No.</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Zipcode</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Company</th>
                            <th style={{ color: "black", paddingTop: "20px" }}>Action</th>

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
                                    <td><button style={{
                                        backgroundColor: "black",
                                        color: "white",
                                        paddingInline: "10px",
                                        padding: "5px",
                                        borderRadius: "5px"
                                    }} onClick={() => deleteAddress(item.id)}>Delete</button></td>

                                </tr>)
                        }) : null}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default Address