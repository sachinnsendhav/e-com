import { useState, useEffect } from "react";
import { CURRENCY_SYMBOLE } from "../../../config";
import { API_URL } from "config";
const Content = (product: any) => {
  var cartId: any;
  var token: any;
  var customerGroup: any = "";
  if (typeof window !== "undefined") {
    // Code running in the browser
    cartId = localStorage.getItem("cartId");
    token = localStorage.getItem("token");
    customerGroup = localStorage.getItem("customerGroup");
  }
  const [count, setCount] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [variationData, setVariationData] = useState<any>();
  const [variationIdData, setVariationIdData] = useState<any>();
  const [variationKey, setVariationKey] = useState<any>();
  const [productData, setProductData] = useState<any>();
  const [isBundle, setIsBundle] = useState<any>();
  const [price, setPrice] = useState(null);
  const [priceSymbole, setPriceSymbole] = useState(null);
  const [selectedId, setSelectedId] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  const [wishlistOperation, setWishlistOperation] = useState<boolean>(false);
  const [shoppingListName, setShoppingListName] = useState<any[]>();
  const [showBlock, setShowBlock] = useState<any>("");
  const [shppingListId, setShppingListId] = useState("");
  const [shoppingItems, setShoppingItems] = useState<any[]>([]);
  const [merchantOffer, setMerchantOffer] = useState<any>();
  const [selectedMerchantOffer, setSelectedMerchantOffer] = useState<any>();
  const [wishlistedItemId, setWishlistedItemId] = useState<any>("");
  const getShoppingListName = async () => {
    const resp = await fetch(`${API_URL}/shopping-lists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await resp.json();
    setShoppingListName(result.data);
    setShowBlock(result.data[0]?.attributes?.name);
    setShppingListId(result.data[0]?.id);
  };
  console.log(selectedMerchantOffer,isBundle,showBlock,merchantOffer, "selectedMerchantOffer");

  const getShoppingListItem = async (id: any) => {
    const resp = await fetch(
      `${API_URL}/shopping-lists/${id}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await resp.json();
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
              image:
                element?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge,
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

    const shoppingItems = concreteProductData.map((concreteProduct: any) => {
      const matchingImage = image.find(
        (img: any) => img.id === concreteProduct.id
      );
      const matchingQuantity = quantity.find(
        (qty: any) => qty.id === concreteProduct.id
      );
      const matchingPrice = price.find(
        (prc: any) => prc.id === concreteProduct.id
      );
      return {
        id: concreteProduct.id,
        name: concreteProduct.name,
        image: matchingImage?.image,
        quantity: matchingQuantity?.quantity || 0,
        price: matchingPrice?.price || 0,
        itemId: matchingQuantity?.itemId,
      };
    });
    setShoppingItems(shoppingItems);
  };
  useEffect(() => {
    setIsLoadingWishlist(true);
    setIsWishlisted(false);
    getShoppingListItem(shppingListId);
  }, [shppingListId]);

  const createCart = async () => {
    const data = {
      data: {
        type: "carts",
        attributes: {
          priceMode: "NET_MODE",
          currency: "USD",
          store: "US",
          name: "cart",
        },
      },
    };
    try {
      const resp = await fetch(`${API_URL}/carts`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) {
        alert("Please Login");
        window.location.href = "/login";
        return;
      }
      const response = await resp.json();

      if (response) {
        setIsLoading(false);
        localStorage.setItem("cartId", response?.data?.id);
        cartId = response?.data?.id;
        return response?.data?.id;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setProductData(product?.product);
    setVariationIdData(product?.product?.attributeMap?.product_concrete_ids);
    if (product?.product?.attributes?.bundled_product) {
      setIsBundle(true);
    }
  }, [product]);
  const handlecart = async () => {
    try {
      const resp = await fetch(`${API_URL}/carts`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401) {
        alert("Please Login");
        window.location.href = "/login";
        return;
      }
      const response = await resp.json();

      if (response) {
        setIsLoading(false);
        if (response?.data[0]?.id) {
          localStorage.setItem("cartId", response?.data[0].id);
          cartId = response?.data[0].id;
          return response?.data[0].id;
        } else {
          await createCart();
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productData) {
      const getPrice = async () => {
        const resp = await fetch(
          `${API_URL}/abstract-products/${productData?.sku}/abstract-product-prices`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const response = await resp.json();
        if (resp.status == 200) {
          setPrice(response?.data[0]?.attributes?.price);
          setPriceSymbole(
            response?.data[0]?.attributes?.prices[0]?.currency?.symbol
          );
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      };
      getPrice();
    }
  }, [productData]);

  useEffect(() => {
    var tempVar: any = [];
    const handlerfunction = async () => {
      if (productData) {
        Object.keys(productData?.attributeMap?.attribute_variant_map)?.map(
          (item, index) => {
            tempVar.push({
              id: index,
              title: Object.keys(
                productData?.attributeMap?.attribute_variant_map[item]
              ).map((item1) => {
                return productData?.attributeMap?.attribute_variant_map[item][
                  item1
                ];
              }),
            });
          }
        );
        setVariationData(tempVar);
        Object.keys(productData?.attributeMap?.super_attributes)?.map(
          (item1: any, index: number) => {
            if (index === 0) {
              const formattedKey = formatKey(item1);
              setVariationKey(formattedKey);
            }
          }
        );

        function formatKey(key: any) {
          return key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: any) => c.toUpperCase());
        }
      }
    };
    handlerfunction();
  }, [productData]);
  useEffect(() => {
    if (variationIdData && variationIdData[1]) {
      shoppingItems?.map((item: any) => {
        console.log(item, selectedId, "hey", variationIdData, "edsj");
        if (variationIdData[selectedId] == item?.id) {
          setIsWishlisted(true);
          setWishlistedItemId(item?.itemId);
        }
      });
    } else {
      shoppingItems?.map((item: any) => {
        if (variationIdData[0] == item?.id) {
          setIsWishlisted(true);
          setWishlistedItemId(item?.itemId);
        }
      });
    }
    setIsLoadingWishlist(false);
  }, [shoppingItems]);

  const AddtoCartHandler = async () => {
    if (variationData && variationData[1]) {
      if (selectedId) {
        var productSkuId = "";
        productSkuId = await variationIdData[selectedId];
      } else {
        return alert("select Variant");
      }
    } else {
      productSkuId = variationIdData[0];
    }

    if (productSkuId && (await checkCartExist())) {
      if (cartId) {
        var productCart: any = {
          data: {
            type: "items",
            attributes: {
              sku: productSkuId.toString(),
              quantity: count,
              salesUnit: {
                id: 0,
                amount: 0,
              },
              productOptions: [null],
            },
          },
        };
        await selectedMerchantOffer
          ? (productCart = {
              data: {
                type: "items",
                attributes: {
                  sku: productSkuId.toString(),
                  productOfferReference: selectedMerchantOffer?.id,
                  merchantReference: selectedMerchantOffer?.attributes?.merchantReference,
                  quantity: count,
                  salesUnit: {
                    id: 0,
                    amount: 0,
                  },
                  productOptions: [null],
                },
              },
            })
          : "";
        setIsLoading(true);
        try {
          const resp = await fetch(`${API_URL}/carts/${cartId}/items`, {
            method: "POST",
            body: JSON.stringify(productCart),
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (resp.status === 401) {
            alert("Please Login");
            window.location.href = "/login";
            return;
          }

          const response = await resp.json();

          if (response) {
            if (response.errors) {
              alert(response.errors[0]?.detail);
            } else {
              alert("Added to cart");
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        AddtoCartHandler();
      }
    }
  };

  useEffect(() => {
    if (variationIdData && variationIdData[1]) {
      console.log(variationIdData, "variationData");
    } else if (variationIdData && variationIdData[0]) {
      var skuId = variationIdData[0];
      console.log(skuId, "skuIdIdIdIdID");
      const handleMerchant = async () => {
        try {
          const resp = await fetch(
            `${API_URL}/concrete-products/${skuId}/product-offers?include=product-offer-prices`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                // Authorization: `Bearer ${token}`,
              },
            }
          );
          const response = await resp.json();

          if (response) {
            if (response.errors) {
              alert(response.errors[0]?.detail);
            } else {
              console.log(response, "offer response");
              var modifiedData = response?.data;
              await modifiedData?.map(async (item: any, index: number) => {
                item.price = await response.included[index]?.attributes?.price;
              });

              await setMerchantOffer(modifiedData);
              var tempselected = await modifiedData?.find(
                (offer: any) =>
                  offer?.attributes?.fkCustomerGroup == customerGroup
              );
              console.log(tempselected, "temp");
              setSelectedMerchantOffer(tempselected);
            }
          }
        } catch (error) {
          setIsLoading(false);
        }
      };
      handleMerchant();
    }
  }, [variationIdData, selectedId]);

  const toggleFav = () => {
    setWishlistOperation(true);
    if (token) {
      var id =
        variationIdData && variationIdData[1]
          ? selectedId
            ? variationIdData[selectedId]
            : ""
          : variationIdData[0];
      if (id) {
        getShoppingListName();
      } else {
        alert("select Varient to add to wishlist");
      }
    } else {
      if (confirm("Please Login to add product to wishlist")) {
        window.location.href = "/login";
      }
    }
  };
  console.log(shoppingItems, "shoppingItems");

  const checkCartExist = async () => {
    if (localStorage.getItem("cartId")) {
      const handleGetCart = async () => {
        try {
          const resp = await fetch(`${API_URL}/carts/${cartId}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (resp.status === 401) {
            // Redirect to "/login" route
            alert("Please Login");
            window.location.href = "/login";
            return;
          } else if (resp.status === 404) {
            const cartIdtemp = await handlecart();
            // window.location.href = "/";
            return cartIdtemp;
          }
          const response = await resp.json();
          if (response) {
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      };
      handleGetCart();
    } else {
      await handlecart();
    }
    return true;
  };

  console.log(
    isWishlisted,
    "isWishlisted",
    shppingListId,
    "shppingListId",
    isLoadingWishlist
  );
  const handleAddtoWishlist = async (wishlisted: any) => {
    if (token) {
      if (!wishlisted) {
        const productCart = {
          data: {
            type: "shopping-list-items",
            attributes: {
              productOfferReference: null,
              quantity: 1,
              sku: selectedId
                ? variationIdData[selectedId]
                : variationIdData[0],
            },
          },
        };
        setIsLoading(true);
        try {
          const resp = await fetch(
            `${API_URL}/shopping-lists/${shppingListId}/shopping-list-items`,
            {
              method: "POST",
              body: JSON.stringify(productCart),
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (resp.status === 401) {
            // Redirect to login page
            alert("Please Login");
            window.location.href = "/login";
            return;
          }
          const response = await resp.json();
          if (response) {
            if (response.errors) {
              alert(response.errors[0]?.detail);
            } else {
              setShppingListId("");
              getShoppingListName();
              // setWishlisted(response?.data?.id);
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        try {
          const resp = await fetch(
            `${API_URL}/shopping-lists/${shppingListId}/shopping-list-items/${wishlistedItemId}`,
            {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (resp.status === 401) {
            // Redirect to login page
            alert("Please Login");
            window.location.href = "/login";
            return;
          }
          if (resp.status === 204) {
            // setWishlisted(null);
            setShppingListId("");
            getShoppingListName();
          }
          const response = await resp.json();

          if (response) {
            if (response.errors) {
              alert(response.errors[0]?.detail);
            }

            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      }
    } else {
      if (confirm("Please Login")) {
        window.location.href = "/login";
      }
    }
    setWishlistedItemId("");
  };
  return (
    <section className="product-content">
      <div className="product-content__intro">
        <h1 className="product__name">{productData?.name}</h1>
        <span
          className="product-on-sale"
          style={{ background: "rgb(207, 18, 46)" }}
        >
          Sale
        </span>
        <h5 className="product__id">
          Product ID:&nbsp;
          {productData?.sku}
        </h5>

        <div className="product__prices">
          {selectedMerchantOffer ? (
            <h4 style={{ color: "rgb(207, 18, 46)" }}>
              {CURRENCY_SYMBOLE} {selectedMerchantOffer?.price}
            </h4>
          ) : (
            <h4 style={{ color: "rgb(207, 18, 46)" }}>
              {priceSymbole} {price} <span style={{fontSize:"8px"}}>without offer</span>
            </h4>
          )}
        </div>
      </div>

      <div className="product-content__filters">
        {productData && (
          <div style={{ display: "flex", marginBottom: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent:"space-evenly",height: "100px"}}>
              {Object.keys(productData?.attributes)?.map((item, index) => {
                const formattedKey = item
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                return <h5 key={index}>{formattedKey}</h5>;
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent:"space-evenly", height: "100px", marginLeft: "30px", fontWeight:"400" }}>
              {Object.keys(productData?.attributes)?.map((item, index) => {
                return (
                  <span key={index}> {productData?.attributes[item]}</span>
                );
              })}
            </div>
          </div>
        )}
        {variationData && variationData[1] && (
          <div className="product-filter-item">
            <h5>Variants : </h5>
            <div className="checkbox-color-wrapper">
              <div className="select-wrapper">
                <select onChange={(e) => setSelectedId(e.target.value)}>
                  <option>
                    Choose {variationKey ? variationKey : "any option"}
                  </option>
                  {variationData?.map((item: any) => (
                    <option value={item.id}>{item.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {wishlistOperation && shoppingListName && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              border: "1px solid",
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#F4F6F8",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
                borderBottom: "1px solid #E4E7EB",
                paddingBottom: "0.5rem",
              }}
            >
              <span style={{ fontWeight: "bold", color: "rgb(207, 18, 46)" }}>
                Select Wishlist
              </span>
              <button
                style={{
                  color: "rgb(207, 18, 46)",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
                onClick={() => setWishlistOperation(false)}
              >
                Close
              </button>
            </div>
            {shoppingListName?.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => setShppingListId(item?.id)}
                  className={`wishlistButton ${
                    item?.id === shppingListId ? "selected" : ""
                  }`}
                  style={{
                    maxWidth: "20rem",
                    border: "1px solid gray",
                    borderRadius: "5px",
                    padding: "0.5rem",
                    margin: "0.5rem",
                    background:
                      item?.id === shppingListId ? "rgb(207, 18, 46)" : "",
                    color: item?.id === shppingListId ? "white" : "black",
                    fontWeight: item?.id === shppingListId ? "bold" : "normal",
                    transition: "background 0.3s",
                  }}
                >
                  {item?.attributes?.name}
                  {item?.id === shppingListId ? "(Default)" : ""}
                </button>
                <button
                  onClick={() => handleAddtoWishlist(isWishlisted)}
                  className={item?.id === shppingListId ? "handlerbutton" : ""}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    marginLeft: "0.5rem",
                    color: "black",
                    fontWeight: item?.id === shppingListId ? "bold" : "normal",
                    transition: "color 0.3s",
                  }}
                >
                  {item?.id === shppingListId ? (
                    isLoadingWishlist ? (
                      "Loading..."
                    ) : isWishlisted ? (
                      <span style={{ color: "rgb(207, 18, 46)" }}>
                        --Remove From ShoppingList
                      </span>
                    ) : (
                      <span style={{ color: "green" }}>
                        -- Add to this ShoppingList
                      </span>
                    )
                  ) : (
                    ""
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="product-filter-item">
          <h5>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button
                type="button"
                onClick={() => setCount(count - 1)}
                className="quantity-button__btn"
              >
                -
              </button>
              <span>{count}</span>
              <button
                type="button"
                onClick={() => setCount(count + 1)}
                className="quantity-button__btn"
              >
                +
              </button>
            </div>

            <button
              style={{ background: "rgb(207, 18, 46)" }}
              type="submit"
              onClick={() => AddtoCartHandler()}
              className="btn btn--rounded btn--yellow"
            >
              {isLoading ? "Adding to cart..." : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={() => toggleFav()}
              className="btn-heart"
            >
              <i className="icon-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
