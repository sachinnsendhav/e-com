import ProductItem from "../../product-item";
import ProductsLoading from "./loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL, SHOPPING_LIST_ID } from "config";
const ProductsContent = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [wishlistProdId, setWishlistProdId] = useState<any[]>([]);
  const [sortingOption, setSortingOption] = useState<any>({})
  const [valueFacets, setvalueFacets] = useState<any[]>([])
  const [sortValue, setSortValue] = useState<any>()
  const nodeId = router.query.nodeId;
  const searchUrl = router.query.search;
  var token: any;
  if (typeof window !== "undefined") {
    // Code running in the browser
    token = localStorage.getItem("token");
  }


  const getSearchData = async () => {
    try {
      const resp = await fetch(
        `${API_URL}/catalog-search-suggestions?q=${searchUrl}&include=abstract-products%2Cconcrete-products%2F`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const result = await resp.json();
      result?.data[0]?.attributes?.abstractProducts.forEach((element: any) => {
        result?.included.forEach((item: any) => {
          if (element.abstractSku === item.id) {
            setSearchResults((searchResults) => [
              ...searchResults,
              {
                abstractName: element.abstractName,
                abstractSku: element.abstractSku,
                price: element.price,
                image: element.images[0].externalUrlLarge,
                concreteId: item.attributes.attributeMap.product_concrete_ids[0],
              },
            ]);
          }
        });
      });
    }
    catch (error) {
      console.log(error);
    }
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

  const getProductData = async (val: any) => {
    try {
      const resp = await fetch(
        `${API_URL}/catalog-search?category=${nodeId}&include=abstract-products${val}`,
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
      console.log("result-catlog", result)
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
      getProductData(val);
    }
  }, [nodeId, sortValue]);

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
        console.log(response, "resp")
      } catch (error) {
        console.log(error, "errors")
      }
    };

    // Call the handleMerchant function here
    handleMerchant
  }, []);



  return (
    <>
      {!searchResults && <ProductsLoading />}
      <div style={{ display: "flex" }}>
        <div style={{ width: "200px" }}>
          {valueFacets.map((val: any) => {
            return (
              val.values.length > 0 && val.name !== "category" ?
                <div style={{ border: "1px solid black", margin: "10px", padding: "5px" }}>
                  <p style={{ fontWeight: "bold", textAlign:"center" }}>{val.localizedName}</p>
                  {val.values.map((item: any) => {
                    return (
                      val.config.isMultiValued ?
                        <div style={{ display: "flex", padding:"3px" }}>
                          <input type="checkbox" />
                          <label>{item.value}</label>
                        </div> : <div style={{ display: "flex", padding:"3px" }}>
                          <input type="radio" />
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
    </>
  );
};

export default ProductsContent;
