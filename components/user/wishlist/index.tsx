import React, { useEffect, useState } from 'react'
import {API_URL} from "../../../config";
import { forEach } from 'lodash';

type WishlistType = {
    show: boolean;
}

const Wishlist = ({ show }: WishlistType) => {
    const style = {
        display: show ? 'flex' : 'none',
    }
    const [authToken, setAuthToken] = useState("");
    const [shoppingListName, setShoppingListName] = useState<any[]>()
    const [showBlock, setShowBlock] = useState<any>("")
    const [shppingListId, setShppingListId] = useState("")
    const [shoppingItems, setShoppingItems] = useState<any[]>([])
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
        setShoppingListName(result.data);
        setShowBlock(result.data[0]?.attributes?.name);
        setShppingListId(result.data[0]?.id)
    }

    useEffect(() => {
        if (authToken) {
            getShoppingListName();
        }
    }, [authToken])

    const getShoppingListItem = async (id: any) => {
        const resp = await fetch(`${API_URL}/shopping-lists/${id}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            }
        );
        const result = await resp.json();
        console.log("shopping list item", result);

        const concreteProductData: any = [];
        const image: any = [];
        const quantity: any = [];
        const price: any = [];

        if (result && result.included && result.included.length > 0) {
            result.included.forEach((element: any) => {
                switch (element.type) {
                    case "concrete-products":
                        concreteProductData.push({
                            id: element.id,
                            name: element.attributes.name,
                        });
                        break;
                    case "concrete-product-image-sets":
                        image.push({
                            id: element.id,
                            image: element?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge,
                        });
                        break;
                    case "shopping-list-items":
                        quantity.push({
                            quantity: element.attributes.quantity,
                            id: element.attributes.sku,
                        });
                        break;
                    default:
                        price.push({
                            price: element.attributes.price,
                            id: element.id,
                        });
                        break;
                }
            });
        }

        console.log("image:", image);


        const shoppingItems = concreteProductData.map((concreteProduct: any) => {

            const matchingImage = image.find((img: any) => img.id === concreteProduct.id);
            const matchingQuantity = quantity.find((qty: any) => qty.id === concreteProduct.id);
            const matchingPrice = price.find((prc: any) => prc.id === concreteProduct.id);
            return {
                id: concreteProduct.id,
                name: concreteProduct.name,
                image: matchingImage?.image,
                quantity: matchingQuantity?.quantity || 0,
                price: matchingPrice?.price || 0,
            };
        });

        setShoppingItems(shoppingItems);

    }
    useEffect(() => {
        getShoppingListItem(shppingListId)
    }, [shppingListId])

    console.log("shoppingListName", shoppingListName);
    console.log("shoppingItems", shoppingItems);
    return (
        <section style={style}>
            <div style={{ margin: "auto", width: "80%" }}>
                <div style={{ display: "flex", border: "1px solid" }}>
                    <div style={{ width: "30%", borderRight: "1px solid #7f7f7f" }}>
                        <ul>
                            {shoppingListName?.map((list: any) => {
                                return (
                                    <li
                                        onClick={() => {
                                            setShowBlock(list.attributes.name);
                                            setShppingListId(list.id)
                                        }}
                                        style={{
                                            padding: "10px",
                                            backgroundColor: `${showBlock === list.attributes.name ? "black" : "#f7f7f7"}`,
                                            color: `${showBlock === list.attributes.name ? "#ffffff" : "black"}`,
                                            borderBottom: "1px solid black"
                                        }}>
                                        {`${list.attributes.name} (${list.attributes.numberOfItems ? list.attributes.numberOfItems : 0})`}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div style={{ width: "70%" }}>{
                        shoppingItems.length > 0 ?
                            shoppingItems.map((item: any) => {
                                return (
                                    <div style={{ paddingInline: "50px", display: "flex", borderBottom: "1px solid #7f7f7f", marginTop: "5px" }}>
                                        <div>
                                            <img src={item.image} style={{ height: "100px", width: "100px", objectFit: "contain" }} />
                                        </div>
                                        <div style={{ padding: "10px" }}>
                                            <p style={{ fontWeight: "bold" }}>{item.name}</p>
                                            <p style={{ paddingTop: "5px", fontWeight: "bold" }}>Quantity : {item.quantity}</p>
                                            <p style={{ paddingTop: "5px", fontWeight: "bold" }}>Price : &euro; {item.price}</p>
                                        </div>
                                    </div>
                                )
                            }) : null

                    }</div>
                </div>
            </div>
        </section>
    )
}

export default Wishlist