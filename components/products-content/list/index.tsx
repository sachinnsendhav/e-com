import ProductItem from "../../product-item";
import ProductsLoading from "./loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL, SHOPPING_LIST_ID, CURRENCY_SYMBOLE } from "config";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { fetchCatalogSearchSuggestionsMethod } from "service/serviceMethods/publicApiMethods";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 2000,
};
const ProductsContent = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [wishlistProdId, setWishlistProdId] = useState<any[]>([]);
  const [sortingOption, setSortingOption] = useState<any>({})
  const [valueFacets, setvalueFacets] = useState<any[]>([])
  const [sortValue, setSortValue] = useState<any>()
  const [selectedValues, setSelectedValues] = useState<any>({});
  const [productIds, setProductIds] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);

  const nodeId = router.query.nodeId;
  const searchUrl = router.query.search;
  var token: any;
  if (typeof window !== "undefined") {
    // Code running in the browser
    token = localStorage.getItem("token");
  }


  const getSearchData = async () => {
    const result = await fetchCatalogSearchSuggestionsMethod(searchUrl)
    await setSearchResults(result);
    // try {
    //   const resp = await fetch(
    //     `${API_URL}/catalog-search-suggestions?q=${searchUrl}&include=abstract-products%2Cconcrete-products%2F`,
    //     {
    //       method: "GET",
    //       headers: {
    //         Accept: "application/json",
    //       },
    //     }
    //   );
    //   const result = await resp.json();
    //   result?.data[0]?.attributes?.abstractProducts.forEach((element: any) => {
    //     result?.included.forEach((item: any) => {
    //       if (element.abstractSku === item.id) {
    //         setSearchResults((searchResults) => [
    //           ...searchResults,
    //           {
    //             abstractName: element.abstractName,
    //             abstractSku: element.abstractSku,
    //             price: element.price,
    //             image: element.images[0].externalUrlLarge,
    //             concreteId: item.attributes.attributeMap.product_concrete_ids[0],
    //           },
    //         ]);
    //       }
    //     });
    //   });
    // }
    // catch (error) {
    //   //console.log(error);
    // }
    // setSearchResults(result?.data[0]?.attributes?.abstractProducts);
  };
  useEffect(() => {
    if (searchUrl) {
      setSearchResults([]);
      getSearchData();
    }
  }, [searchUrl]);
  useEffect(() => {
    if (token) {
      getShoppingListItem();
    }
  }, [token]);

  const getShoppingListItem = async () => {
    try {
      const resp = await fetch(
        `${API_URL}/shopping-lists/${SHOPPING_LIST_ID}?include=shopping-list-items`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resp.ok) {
        // Handle non-2xx status codes (e.g., 4xx, 5xx)
        throw new Error(
          `Failed to fetch shopping list items: ${resp.status} ${resp.statusText}`
        );
      }

      const result = await resp.json();
      var tempArr: any = [];
      result?.included?.map((item: any) => {
        tempArr.push({ sku: item?.attributes?.sku, wishId: item?.id });
      });
      setWishlistProdId(tempArr);
    } catch (error) {
      console.error("Error fetching shopping list items:", error);
    }
  };

  // const getShoppingListItem = async() => {
  //   const resp = await fetch(
  //     `${API_URL}/shopping-lists/${SHOPPING_LIST_ID}?include=shopping-list-items`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   const result = await resp.json();
  //   var tempArr:any =[];
  //   result?.included?.map((item:any)=>{
  //     tempArr.push({sku:item?.attributes?.sku, wishId:item?.id});
  //   })
  //   setWishlistProdId(tempArr);
  // };

  // const getProductData = async () => {
  //   const resp = await fetch(
  //     `${API_URL}/catalog-search?category=${nodeId}&include=abstract-products`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //       },
  //     }
  //   );
  //   const result = await resp.json();

  //   result?.data[0]?.attributes?.abstractProducts.forEach((element: any) => {
  //     result?.included.forEach((item: any) => {
  //       if (element.abstractSku === item.id) {
  //         setProducts((products) => [
  //           ...products,
  //           {
  //             abstractName: element.abstractName,
  //             abstractSku: element.abstractSku,
  //             description: item.attributes.description,
  //             price: element.price,
  //             image: element.images[0].externalUrlLarge,
  //             concreteId: item.attributes.attributeMap.product_concrete_ids[0],
  //           },
  //         ]);
  //       }
  //     });
  //   });
  //   // setProducts(result?.data[0]?.attributes?.abstractProducts);
  //   // setProducts(result?.included)
  // };

  const getProductData = async (val: any, queryString: any) => {
    try {
      const resp = await fetch(
        `${API_URL}/catalog-search?category=${nodeId}&include=abstract-products&${queryString}${val}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!resp.ok) {
        // Handle non-2xx status codes (e.g., 4xx, 5xx)
        throw new Error(
          `Failed to fetch product data: ${resp.status} ${resp.statusText}`
        );
      }

      const result = await resp.json();
      //console.log("result-catlog", result)
      setSortingOption(result?.data[0]?.attributes?.sort?.sortParamLocalizedNames);
      setvalueFacets(result?.data[0]?.attributes?.valueFacets)
      result?.data[0]?.attributes?.abstractProducts.forEach((element: any) => {
        result?.included.forEach((item: any) => {
          if (element.abstractSku === item.id) {
            setProducts((products) => [
              ...products,
              {
                abstractName: element.abstractName,
                abstractSku: element.abstractSku,
                description: item.attributes.description,
                price: element.price,
                image: element.images[0].externalUrlLarge,
                concreteId:
                  item.attributes.attributeMap.product_concrete_ids[0],
              },
            ]);
          }
        });
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (nodeId) {
      setProducts([]);
      const val = `&sort=${sortValue}`
      const queryString = Object.entries(selectedValues)
        .map(([key, values]: any) => `${key}=${values?.map(encodeURIComponent).join("%2C")}`)
        .join("&");

      //console.log("queryString", queryString);
      getProductData(val, queryString);
    }
  }, [nodeId, sortValue, selectedValues]);

  useEffect(() => {
    const handleMerchant = async (skuId: any) => {
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
        //console.log(response, "resp")
      } catch (error) {
        //console.log(error, "errors")
      }
    };

    // Call the handleMerchant function here
    handleMerchant
  }, []);


  // for selected filters vallue
  const handleCheckboxChange = (parameterName: any, value: any) => {
    setSelectedValues((prevState: any) => {
      if (prevState[parameterName]?.includes(value)) {
        // If the value is already in the state array, remove it
        return {
          ...prevState,
          [parameterName]: prevState[parameterName].filter(
            (selectedValue: any) => selectedValue !== value
          ),
        };
      } else {
        // If the value is not in the state array, add it
        return {
          ...prevState,
          [parameterName]: prevState[parameterName]
            ? [...prevState[parameterName], value]
            : [value],
        };
      }
    });
  };

  const handleRadioChange = (parameterName: any, value: any) => {
    //console.log("Gggggg", parameterName, "val-", value)
    setSelectedValues((prevState: any) => ({
      ...prevState,
      [parameterName]: [value],
    }));
  };
  const getRelatedProduct = async (id: any) => {
    const resp = await fetch(
      `${API_URL}/abstract-products/${id}/related-products`,
      {
        method: "GET",
      }
    );
    const result = await resp.json();
    setProductIds(result?.data);
  };
  const getRelatedProductData = async (id: any) => {
    const resp = await fetch(
      `${API_URL}/concrete-products/${id}?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      {
        method: "GET",
      }
    );
    const result = await resp.json();
    setProductData((productData) => [
      ...productData,
      {
        name: result.data.attributes.name,
        id: result.data.id,
        image:
          result.included[0]?.attributes?.imageSets[0]?.images[0]
            ?.externalUrlLarge,
        price: result.included[2]?.attributes?.price / 100,
      },
    ]);
  };

  useEffect(() => {
    if (products.length > 0) {
      getRelatedProduct(products[0].abstractSku);
    }
  }, [products]);

  useEffect(() => {
    setProductData([]);
    if (productIds?.length > 0) {
      productIds.forEach((element: any) => {
        getRelatedProductData(element.attributes.attributeMap.product_concrete_ids[0]);
      });
    }
  }, [productIds]);

  return (
    <>
      {!searchResults && <ProductsLoading />}
      <div style={{ display: "flex" }}>
        <div style={{ width: "200px" }}>
          {valueFacets.map((val: any) => {
            return (
              val.values.length > 0 && val.name !== "category" ?
                <div style={{ border: "1px solid black", margin: "10px", padding: "5px" }}>
                  <p style={{ fontWeight: "bold", textAlign: "center" }}>{val.localizedName}</p>
                  {val.values.map((item: any) => {
                    return (
                      val.config.isMultiValued ?
                        <div style={{ display: "flex", padding: "3px" }}>
                          <input
                            type="checkbox"
                            checked={selectedValues[val.name]?.includes(item.value)}
                            onChange={() => handleCheckboxChange(val.name, item.value)}
                          />
                          <label>{item.value}</label>
                        </div> : <div style={{ display: "flex", padding: "3px" }}>
                          <input
                            type="radio"
                            checked={selectedValues[val.name] === item.value}
                            onChange={() => handleRadioChange(val.name, item.value)}
                          />
                          <label>{item.value}</label>
                        </div>
                    )

                  })
                  }
                </div>
                : ""
            )
          })}
        </div>
        <div>


          {searchResults && (
            <section className="products-list">
              {searchResults.map((item: any) => (
                <ProductItem
                  id={item.abstractSku}
                  name={item.abstractName}
                  description={item.description}
                  price={item.price}
                  key={item.abstractSku}
                  images={item.image}
                  concreteId={item.concreteId}
                  wishlistProdId={wishlistProdId}
                />
              ))}
            </section>
          )}
          {products && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <select
                  onChange={(e) => setSortValue(e.target.value)}
                  style={{ marginBottom: "50px", padding: "10px", border: "1px solid black" }}>
                  {Object.keys(sortingOption).map((key) => (
                    <option key={key} value={key}>
                      {sortingOption[key]}
                    </option>
                  ))}
                </select>
              </div>
              <section className="products-list">
                {products.map((item: any) => (
                  <ProductItem
                    id={item.abstractSku}
                    name={item.abstractName}
                    description={item.description}
                    price={item.price}
                    key={item.abstractSku}
                    images={item.image}
                    concreteId={item.concreteId}
                    wishlistProdId={wishlistProdId}
                  />
                ))}
              </section>
            </>
          )}
        </div>
      </div>
      <div style={{ paddingInline: "75px", background:"white" }}>
        <p style={{
          fontWeight: "500",
          fontSize: "1.5rem",
          lineHeight: "1.4",
          color: "#333",
          paddingBottom: "10px"
        }}>Related Products</p>
        <Slider {...settings}>

          {productData.map((item: any) => {
            return (
              <div style={{ padding: "10px" }}>
                <Link
                  href={`/product/${item.name}?skuId=${item.id.split("_")[0]
                    }`}
                >
                  <div style={{ margin: "5px",cursor:"pointer" }}>
                    <img
                      src={item.image}
                      style={{
                        width: "220px",
                        height: "250px",
                        objectFit: "contain",
                      }}
                    />
                    <p style={{ paddingLeft: "10px" }}>{item.name}</p>
                    <p
                      style={{
                        fontWeight: "bold",
                        paddingTop: "5px",
                        paddingLeft: "10px",
                      }}
                    >
                      {CURRENCY_SYMBOLE}{item.price / 100}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
};

export default ProductsContent;
