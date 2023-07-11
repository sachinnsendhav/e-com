import Footer from "components/footer";
import React, { useState, useEffect } from "react";
import Layout from "../../layouts/Main";
import { API_URL } from "../../config";
import Link from "next/link";
import { useRouter } from "next/router";

function ConfigurableBundleItems() {
  const router = useRouter();
  const configurableBundleId = router.query.bundleId;
  var cartId: any;
  var token: any;
  if (typeof window !== "undefined") {
    // Code running in the browser
    cartId = localStorage.getItem("cartId");
    token = localStorage.getItem("token");
  }
  const [finalData, setFinalData] = useState<any>([]);

  const [slotData, setSlotData] = useState<any>([]);
  const [showBlock, setShowBlock] = useState("");
  const [selectedProduct, setselectedProduct] = useState("");
  const [productData, setProductData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [configuredBundleTemplateSlots, setConfiguredBundleTemplateSlots] =
    useState<any>([]);

  const allProductsWithSlots: any = [];
  useEffect(() => {
    if (configuredBundleTemplateSlots?.included?.length > 0) {
      const slotIds =
        configuredBundleTemplateSlots?.data?.relationships[
          "configurable-bundle-template-slots"
        ]?.data;
      slotIds?.forEach((slot: any) => {
        configuredBundleTemplateSlots?.included.forEach((element: any) => {
          if (
            element.type == "configurable-bundle-template-slots" &&
            slot.id === element.id
          ) {
            allProductsWithSlots.push({
              slotID: slot.id,
              productSKUS: element?.relationships["concrete-products"]?.data,
              slotName: element?.attributes?.name,
            });
          }
        });
      });

      allProductsWithSlots?.forEach((products: any) => {
        products?.productSKUS?.map((item: any, index: number) => {
          configuredBundleTemplateSlots.included.forEach(
            (includedItem: any) => {
              if (
                includedItem.type === "concrete-product-image-sets" &&
                item?.id === includedItem.id
              ) {
                const externalUrlLarge =
                  includedItem.attributes.imageSets[0]?.images[0]
                    ?.externalUrlLarge;
                item.image = externalUrlLarge;
              }
              if (
                includedItem.type === "concrete-product-prices" &&
                item?.id === includedItem.id
              ) {
                const price = includedItem.attributes.price;
                item.price = price;
              }
              if (
                includedItem.type === "concrete-products" &&
                item?.id === includedItem.id
              ) {
                const name = includedItem.attributes.name;
                item.name = name;
              }
            }
          );
        });
      });
      setFinalData(allProductsWithSlots);
    }
  }, [configuredBundleTemplateSlots]);

  useEffect(() => {
    const getConfiguredBundleSlotsByID = async (configurableBundleId: any) => {
      setIsLoading(true);
      const resp = await fetch(
        `${API_URL}/configurable-bundle-templates/${configurableBundleId}?include=configurable-bundle-template-slots%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
        {
          method: "GET",
        }
      );
      const response = await resp.json();
      console.log(response, "resp");
      setConfiguredBundleTemplateSlots(response);
      setIsLoading(false);
    };
    getConfiguredBundleSlotsByID(configurableBundleId);
  }, [configurableBundleId]);
  useEffect(() => {
    setShowBlock(finalData[0]?.slotName);
  }, [finalData]);
  console.log(productData, "productData");
  useEffect(() => {
    finalData.forEach((element: any) => {
      if (element.slotName === showBlock) {
        setProductData(element.productSKUS);
      }
    });
    slotData.map((item: any) => {
      if (item.slotName == showBlock) {
        setselectedProduct(item?.selectedProduct?.id);
      }
    });
  }, [showBlock, slotData]);

  useEffect(() => {
    var tempSlotArr: any = [];
    finalData.forEach((element: any) => {
      tempSlotArr.push({
        slotID: element.slotID,
        slotName: element.slotName,
        selectedProduct: {},
        selected: false,
      });
    });
    setSlotData(tempSlotArr);
  }, [finalData]);

  console.log(finalData, "finalData", slotData);

  const productSelcetionHandler = async (product: any) => {
    console.log(product, "prod", showBlock, "selectedProduct", selectedProduct);
    const tempArr: any = [];
    if (selectedProduct == product.id) {
      await slotData?.map((item: any, index: number) => {
        if (item.slotName == showBlock) {
          tempArr.push({
            slotID: item.slotID,
            slotName: item.slotName,
            selectedProduct: "",
            selected: false,
          });
        } else {
          tempArr.push(item);
        }
      });
    } else {
      await slotData?.map((item: any, index: number) => {
        if (item.slotName == showBlock) {
          tempArr.push({
            slotID: item.slotID,
            slotName: item.slotName,
            selectedProduct: product,
            selected: true,
          });
        } else {
          tempArr.push(item);
        }
      });
    }
    setSlotData(tempArr);
  };

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
        localStorage.setItem("cartId", response?.data[0].id);
        cartId = response?.data[0].id;
        return response?.data[0].id;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

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

  const addtoCartHandler = async () => {
    console.log(slotData, "slotData");
    const tempItem:any = [];
    slotData?.map((item:any)=>{
        if(item?.selectedProduct?.id){ 
        tempItem.push({slotUuid:item?.slotID,sku:item?.selectedProduct?.id,quantity: 1,})
  }});
  if(tempItem && tempItem[0]){
    if (await checkCartExist()) {
      if (cartId) {
        const productCart = {
          data: {
            type: "configured-bundles",
            attributes: {
              quantity: 1,
              templateUuid: configurableBundleId,
              items:tempItem,
            },
          },
        };
        setIsLoading(true);
        try {
          const resp = await fetch(`${API_URL}/carts/${cartId}/configured-bundles`, {
            method: "POST",
            body: JSON.stringify(productCart),
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

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
        addtoCartHandler();
      }
    }}else{
        alert('Please configure atleast one slot')
    }
  };

  return (
    <>
      <Layout />
      <div style={{ paddingInline: "100px" }}>
        <Link href="/configurable-product">
          <button
            style={{
              border: "1px solid black",
              marginTop: "10px",
              padding: "5px",
            }}
          >
            Back To Bundles
          </button>
        </Link>
        <div style={{ border: "1px solid #dedede", marginTop: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
            }}
          >
            {slotData?.map((val: any) => {
              return (
                <div
                  style={{
                    borderRight: "1px solid #dedede",
                    borderBottom: "1px solid #dedede",
                    background: `${
                      showBlock === val.slotName ? "#dedede" : "#ffffff"
                    }`,
                    width: "100%",
                    color: `${
                      showBlock === val.slotName ? "#eeeee" : "#c6c6c6"
                    }`,
                    borderColor: "#dedede",
                    padding: "1rem",
                    fontWeight: 500,
                    fontSize: ".8125rem",
                    letterSpacing: ".1375rem",
                    textTransform: "uppercase",
                  }}
                  onClick={() => setShowBlock(val.slotName)}
                >
                  {val.slotName}{" "}
                  {val.selected ? (
                    <span style={{ color: "green", fontSize: "20px" }}>✔</span>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
            <div
              style={{
                borderBottom: "1px solid #dedede",
                width: "100%",
                color: "#c6c6c6",
                borderColor: "#dedede",
                padding: "1rem",
                fontWeight: 500,
                fontSize: ".8125rem",
                letterSpacing: ".1375rem",
                textTransform: "uppercase",
              }}
              onClick={() => setShowBlock("summary")}
            >
              Summary
            </div>
          </div>
          <div style={{ padding: "2rem" }}>
            {showBlock === "summary" ? (
              <div className="summeryParent">
                <div style={{ width: "68%" }}>
                  {slotData?.map((item: any, index: number) =>
                    item?.selected ? (
                      <>
                        <p style={{ paddingTop: "12px" }}>{item?.slotName}</p>
                        <div
                          style={{
                            padding: "1rem",
                            display: "flex",
                            justifyContent: "space-between",
                            background: "#dedede",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div style={{ width: "70px" }}>
                              <img
                                src={item?.selectedProduct?.image}
                                style={{
                                  width: "100%",
                                  background: "#dedede",
                                  objectFit: "cover",
                                }}
                              />
                            </div>

                            <div style={{ padding: "20px", color: "black" }}>
                              {item?.selectedProduct?.name}
                            </div>
                          </div>
                          <div style={{ paddingTop: "20px", color: "black" }}>
                            € {item?.selectedProduct?.price}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )
                  )}
                </div>
                <div className="summeryTotalParent">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>Total</p>
                    <p>€ 121121</p>
                  </div>
                  <button
                    className="bundleSelectButton"
                    style={{ width: "100%", marginTop: "24px" }}
                    onClick={() => addtoCartHandler()}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ) : (
              productData?.map((item: any) => {
                return (
                  <div
                    style={{
                      margin: "20px",
                      marginInline: "100px",
                      padding: "2rem",
                      display: "flex",
                      justifyContent: "space-between",
                      background: "#dedede",
                    }}
                  >
                    <div style={{ width: "150px" }}>
                      <img
                        src={item.image}
                        style={{
                          width: "100%",
                          background: "#dedede",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div style={{ padding: "50px", color: "black" }}>
                      {item.name}
                    </div>
                    <div>
                      <div style={{ paddingTop: "50px", color: "black" }}>
                        € {item.price}
                      </div>
                      {selectedProduct == item.id ? (
                        <button
                          className="bundleSelectButtonSelected"
                          onClick={() => productSelcetionHandler(item)}
                        >
                          Unselect
                        </button>
                      ) : (
                        <button
                          className="bundleSelectButton"
                          onClick={() => productSelcetionHandler(item)}
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ConfigurableBundleItems;
