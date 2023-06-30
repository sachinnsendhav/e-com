import React, { useEffect, useState } from 'react'
import API_URL from "../../../config";

type WishlistType = {
    show: boolean;
}

const Wishlist = ({ show }: WishlistType) => {
    const style = {
        display: show ? 'flex' : 'none',
    }
    const [authToken, setAuthToken] = useState("");
    const [shoppingListName, setShoppingListName] = useState<any[]>()

    useEffect(() => {
        setAuthToken(localStorage.getItem("token"))
    }, [])

    const getShoppingListName = async () => {
        const resp = await fetch(`${API_URL}/shopping-lists`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );
        const result = await resp.json();
        setShoppingListName(result.data)
    }

    useEffect(() => {
        if (authToken) {
            getShoppingListName();
        }
    }, [authToken])
    console.log("shoppingListName", shoppingListName)
    return (
        <section style={style}>
            <div style={{ margin: "auto", width: "80%" }}>
                <div style={{ display: "flex", border: "1px solid" }}>
                    <div style={{ width: "25%" }}>
                        <ul style={{borderRight:"1px solid #7f7f7f"}}>
                            {shoppingListName?.map((list: any) => {
                                return (
                                    <li style={{padding:"5px", borderBottom:"1px solid black"}}>{`${list.attributes.name}(${list.attributes.numberOfItems})`}</li>
                                )
                            })}
                        </ul>
                    </div>
                    <div>Items</div>
                </div>
            </div>
        </section>
    )
}

export default Wishlist