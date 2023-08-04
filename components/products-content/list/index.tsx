import ProductItem from "../../product-item";
import ProductsLoading from "./loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL, SHOPPING_LIST_ID } from "config";
import {
  fetchCatalogSearchSuggestionsMethod,
  fetchCatalogSearchByCategoryMethod,
  fetchShoppingListItemsMethod
} from "../../../service/serviceMethods/publicApiMethods";
const ProductsContent = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [wishlistProdId, setWishlistProdId] = useState<any[]>([]);
  const [sortingOption, setSortingOption] = useState<any>({});
  const [valueFacets, setvalueFacets] = useState<any[]>([]);
  const [sortValue, setSortValue] = useState<any>();
  const [selectedValues, setSelectedValues] = useState<any>({});

  const nodeId = router.query.nodeId;
  const searchUrl = router.query.search;
  var token: any;
  if (typeof window !== "undefined") {
    // Code running in the browser
    token = localStorage.getItem("token");
  }

  const getSearchData = async () => {
    const result = await fetchCatalogSearchSuggestionsMethod(searchUrl);
    await setSearchResults(result);
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
    const result = await fetchShoppingListItemsMethod(SHOPPING_LIST_ID);
    await setWishlistProdId(result);
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
    const result = await fetchCatalogSearchByCategoryMethod(
      nodeId,
      queryString,
      val
    );
    console.log(result,"result")
    await setSortingOption(result?.sortingOptions);
    await setvalueFacets(result?.facetsValue);
    await setProducts(result.productData);
  };

  useEffect(() => {
    if (nodeId) {
      setProducts([]);
      const val = `&sort=${sortValue}`;
      const queryString = Object.entries(selectedValues)
        .map(
          ([key, values]: any) =>
            `${key}=${values?.map(encodeURIComponent).join("%2C")}`
        )
        .join("&");

      getProductData(val, queryString);
    }
  }, [nodeId, sortValue, selectedValues]);

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
  //console.log("selectedValues", selectedValues)
  return (
    <>
      {!searchResults && <ProductsLoading />}
      <div style={{ display: "flex" }}>
        <div style={{ width: "200px" }}>
          {valueFacets.map((val: any) => {
            return val.values.length > 0 && val.name !== "category" ? (
              <div
                style={{
                  border: "1px solid black",
                  margin: "10px",
                  padding: "5px",
                }}
              >
                <p style={{ fontWeight: "bold", textAlign: "center" }}>
                  {val.localizedName}
                </p>
                {val.values.map((item: any) => {
                  return val.config.isMultiValued ? (
                    <div style={{ display: "flex", padding: "3px" }}>
                      <input
                        type="checkbox"
                        checked={selectedValues[val.name]?.includes(item.value)}
                        onChange={() =>
                          handleCheckboxChange(val.name, item.value)
                        }
                      />
                      <label>{item.value}</label>
                    </div>
                  ) : (
                    <div style={{ display: "flex", padding: "3px" }}>
                      <input
                        type="radio"
                        checked={selectedValues[val.name] === item.value}
                        onChange={() => handleRadioChange(val.name, item.value)}
                      />
                      <label>{item.value}</label>
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            );
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
                  style={{
                    marginBottom: "50px",
                    padding: "10px",
                    border: "1px solid black",
                  }}
                >
                  {Object.keys(sortingOption).map((key) => (
                    <option key={key} value={key}>
                      {sortingOption[key]}
                    </option>
                  ))}
                </select>
              </div>
              <section className="products-list">
                {products?.map((item: any) => (
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
