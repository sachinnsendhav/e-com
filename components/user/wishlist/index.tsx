import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import { CURRENCY_SYMBOLE } from "config";

type WishlistType = {
  show: boolean;
};

const Wishlist = ({ show }: WishlistType) => {
  const style = {
    display: show ? "flex" : "none",
  };
  const [authToken, setAuthToken] = useState<any>("");
  const [shoppingListName, setShoppingListName] = useState<any[]>();
  const [showBlock, setShowBlock] = useState<any>("");
  const [shppingListId, setShppingListId] = useState("");
  const [shoppingItems, setShoppingItems] = useState<any[]>([]);
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
  }, []);

  const getShoppingListName = async () => {
    const resp = await fetch(`${API_URL}/shopping-lists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const result = await resp.json();
    setShoppingListName(result.data);
    setShowBlock(result?.data ? result?.data[0]?.attributes?.name : "");
    setShppingListId(result?.data ? result.data[0]?.id : "");
  };

  useEffect(() => {
    if (authToken) {
      getShoppingListName();
    }
  }, [authToken]);

  const getShoppingListItem = async (id: any) => {
    try {
      const resp = await fetch(
        `${API_URL}/shopping-lists/${id}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const result = await resp.json();
      const concreteProductData: any = [];
      const image: any = [];
      const quantity: any = [];
      const price: any = [];

      if (result && result.included && result.included.length > 0) {
        result?.included.forEach((element: any) => {
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
                image:
                  element?.attributes?.imageSets[0]?.images[0]
                    ?.externalUrlLarge,
              });
              break;
            case "shopping-list-items":
              quantity.push({
                quantity: element.attributes.quantity,
                id: element.attributes.sku,
                itemId: element.id,
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

      const shoppingItems = quantity.map((qtyItem: any) => {
        const matchingImage = image.find((img: any) => img.id === qtyItem.id);
        const matchingPrice = price.find((prc: any) => prc.id === qtyItem.id);
        const matchingConcreteProduct = concreteProductData.find(
          (val: any) => val.id === qtyItem.id
        );

        return {
          id: qtyItem.id,
          name: matchingConcreteProduct?.name || "",
          image: matchingImage?.image,
          quantity: qtyItem?.quantity || 0,
          price: matchingPrice?.price || 0,
          itemId: qtyItem?.itemId,
        };
      });

      setShoppingItems(shoppingItems);
    } catch (error) {
      console.error("Error fetching shopping list items:", error);
    }
  };

  // const getShoppingListItem = async (id: any) => {
  //     const resp = await fetch(`${API_URL}/shopping-lists/${id}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
  //         {
  //             method: "GET",
  //             headers: {
  //                 "Authorization": `Bearer ${authToken}`
  //             }
  //         }
  //     );
  //     const result = await resp.json();
  //     const concreteProductData: any = [];
  //     const image: any = [];
  //     const quantity: any = [];
  //     const price: any = [];

  //     if (result && result.included && result.included.length > 0) {
  //         result?.included.forEach((element: any) => {
  //             switch (element.type) {
  //                 case "concrete-products":
  //                     concreteProductData.push({
  //                         id: element.id,
  //                         name: element.attributes.name,
  //                     });
  //                     break;
  //                 case "concrete-product-image-sets":
  //                     image.push({
  //                         id: element.id,
  //                         image: element?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge,
  //                     });
  //                     break;
  //                 case "shopping-list-items":
  //                     quantity.push({
  //                         quantity: element.attributes.quantity,
  //                         id: element.attributes.sku,
  //                         itemId: element.id
  //                     });
  //                     break;
  //                 default:
  //                     price.push({
  //                         price: element.attributes.price,
  //                         id: element.id,
  //                     });
  //                     break;
  //             }
  //         });
  //     }

  //     const shoppingItems = quantity.map((qtyItem: any) => {
  //         const matchingImage = image.find((img: any) => img.id === qtyItem.id);
  //         // const matchingQuantity = quantity.find((qty: any) => qty.id === qtyItem.id);
  //         const matchingPrice = price.find((prc: any) => prc.id === qtyItem.id);
  //         const matchingConcreteProduct = concreteProductData.find((val: any) => val.id === qtyItem.id);
  //         // console.log("matchingConcreteProduct", matchingConcreteProduct)
  //         return {
  //             id: qtyItem.id,
  //             name: matchingConcreteProduct?.name || "",
  //             image: matchingImage?.image,
  //             quantity: qtyItem?.quantity || 0,
  //             price: matchingPrice?.price || 0,
  //             itemId: qtyItem?.itemId
  //         };
  //     });
  //     setShoppingItems(shoppingItems);
  // }
  useEffect(() => {
    getShoppingListItem(shppingListId);
  }, [shppingListId]);

  const deleteShoppingListItems = async (id: any) => {
    const resp = await fetch(
      `${API_URL}/shopping-lists/${shppingListId}/shopping-list-items/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (resp.status === 204) {
      const updatedItems = shoppingItems.filter((item) => item.itemId !== id);
      setShoppingItems(updatedItems || []);
      alert("deleted sucessfully...!");
    }
  };
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
                      setShppingListId(list.id);
                    }}
                    style={{
                      padding: "10px",
                      backgroundColor: `${
                        showBlock === list.attributes.name ? "black" : "#f7f7f7"
                      }`,
                      color: `${
                        showBlock === list.attributes.name ? "#ffffff" : "black"
                      }`,
                      borderBottom: "1px solid black",
                    }}
                  >
                    {`${list.attributes.name} (${
                      list.attributes.numberOfItems
                        ? list.attributes.numberOfItems
                        : 0
                    })`}
                  </li>
                );
              })}
            </ul>
          </div>
          <div style={{ width: "70%" }}>
            {shoppingItems.length > 0
              ? shoppingItems.map((item: any) => {
                  return (
                    <div
                      style={{
                        paddingInline: "50px",
                        display: "flex",
                        borderBottom: "1px solid #7f7f7f",
                        marginTop: "5px",
                      }}
                    >
                      <div>
                        <img
                          src={item.image}
                          style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: "bold" }}>{item.name}</p>
                          <p style={{ paddingTop: "5px", fontWeight: "bold" }}>
                            Quantity : {item.quantity}
                          </p>
                          <p style={{ paddingTop: "5px", fontWeight: "bold" }}>
                            Price : {CURRENCY_SYMBOLE} {item.price}
                          </p>
                        </div>
                        <div>
                          <button
                            style={{
                              backgroundColor: "black",
                              borderRadius: "5px",
                              borderColor: "black",
                              padding: "5px",
                              paddingInline: "15px",
                              color: "#ffffff",
                            }}
                            onClick={() => deleteShoppingListItems(item.itemId)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
