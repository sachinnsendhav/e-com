import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import { CURRENCY_SYMBOLE } from "config";
//@ts-ignore
import deleteIcon from "../../../assets/images/delete.png";
import Loader from "../../loader";

type WishlistType = {
  show: boolean;
};

const Wishlist = ({ show }: WishlistType) => {
  const style = {
    display: show ? "block" : "none",
  };
  const [authToken, setAuthToken] = useState<any>("");
  const [shoppingListName, setShoppingListName] = useState<any[]>();
  const [showBlock, setShowBlock] = useState<any>("");
  const [shppingListId, setShppingListId] = useState("");
  const [shoppingItems, setShoppingItems] = useState<any>();
  const [shoppingItemsPrice, setShoppingItemsPrice] = useState<any>();
  const [loading, setLoading] = useState<any>(false);
  const [listLoading, setListLoading] = useState<any>(false);
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
  }, []);

  const getShoppingListName = async () => {
    try{
    setLoading(true);
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
    setLoading(false);
  }
  catch(error){
    console.log(error,"errors")
  }
  };

  useEffect(() => {
    if (authToken) {
      getShoppingListName();
    }
  }, [authToken]);

  const getShoppingListItem = async (id: any) => {
    setListLoading(true);
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
    setListLoading(false);
  };

  useEffect(() => {
    getShoppingListItem(shppingListId);
  }, [shppingListId]);

  const handleMerchant = async (
    skuId: any,
    index: number
    // tempPriceArr: any
  ) => {
    try {
      const resp = await fetch(
        `${API_URL}/concrete-products/${skuId}/product-offers?include=product-offer-prices`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const response = await resp.json();
      console.log(response, "resp");
      if (response) {
        var groupId = await localStorage.getItem("customerGroup");
        if (response.data?.length && response.data.length > 0) {
          var groupOffer = await response.data.find((offer: any) => {
            return offer.attributes?.fkCustomerGroup == groupId;
          });
          if (groupOffer) {
            var offerfilteredPrice: any = await response.included.find(
              (inc: any) => inc.id === groupOffer.id
            );
            return await offerfilteredPrice?.attributes?.price;
          }
        }
      }
    } catch (error) {
      console.log(error, "errors");
    }
  };

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

  useEffect(() => {
    if (shoppingItems && shoppingItems[0]) {
    //   const handleMerchant = (itemId, index) => {
    //     return new Promise((resolve, reject) => {
    //       // Assume handleMerchant is an async function that fetches the price of the item
    //       // You should replace the following line with your actual implementation.
    //       setTimeout(() => resolve(10 + index), 1000); // Simulating an async operation
    //     });
    //   };
  
      const handlePriceMethod = async () => {
        try {
          const tempPriceArr = await Promise.all(
            shoppingItems.map(async (item, index) => {
              const price = await handleMerchant(item?.id, index);
              return price;
            })
          );
          setShoppingItemsPrice(tempPriceArr);
        } catch (error) {
          console.error("Error while fetching prices:", error);
        }
      };
  
      handlePriceMethod();
    }
  }, [shoppingItems]);
  

  console.log(shoppingItemsPrice, "shoppingItemsPrice");
  return (
    <div style={style}>
      {/* <div style={{ margin: "auto", width: "80%" }}>
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
      </div> */}
      {loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <Loader />
        </div>
      ) : (
        <>
          <h1
            style={{
              fontWeight: "500",
              fontSize: "1.5rem",
              lineHeight: "1.4",
              display: "block",
              color: "#333",
              paddingBottom: "0.25rem",
            }}
          >
            Shopping List
          </h1>
          <div style={{ display: "flex", border: "0.0625rem solid #dce0e5" }}>
            <div
              style={{ width: "30%", borderRight: "0.0625rem solid #dce0e5" }}
            >
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
                          showBlock === list.attributes.name
                            ? "#f2f2f2"
                            : "#ffffff"
                        }`,
                        color: `${
                          showBlock === list.attributes.name
                            ? "black"
                            : "#b2b2b2"
                        }`,
                        borderBottom: "0.0625rem solid #dce0e5",
                        display: "flex",
                        alignItems: "center",
                        // padding: "0.125rem 0.8125rem",
                        lineHeight: "1.3em",
                        fontSize: "1.0625rem",
                        fontWeight: "500",
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
              {listLoading ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "20px",
                  }}
                >
                  <Loader />
                </div>
              ) : shoppingItems?.length > 0 ? (
                shoppingItems?.map((item: any, index:number) => {
                  return (
                    <div
                      style={{
                        paddingInline: "5px",
                        display: "flex",
                        borderBottom: "0.0625rem solid #dce0e5",
                        marginTop: "5px",
                      }}
                    >
                      <div style={{ padding: "10px" }}>
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
                          <p
                            style={{
                              fontWeight: "400",
                              fontFamily:
                                "Frutiger LT W01_55 Roma1475738, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                            }}
                          >
                            {item.name}
                          </p>
                          <p style={{ paddingTop: "15px", fontWeight: "400" }}>
                            <span style={{ fontWeight: "600" }}>
                              Quantity :
                            </span>{" "}
                            {item.quantity}
                          </p>
                          <p style={{ paddingTop: "10px", fontWeight: "400" }}>
                            <span style={{ fontWeight: "600" }}>Price : </span>
                            {CURRENCY_SYMBOLE}
                            {Number(shoppingItemsPrice  ?shoppingItemsPrice[index]: item.price) / 100}
                          </p>
                        </div>
                        <div>
                          <button
                            style={{
                              padding: "15px",
                            }}
                            onClick={() => deleteShoppingListItems(item.itemId)}
                          >
                            <img
                              src={deleteIcon.src}
                              style={{ height: "25px", width: "25px" }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
