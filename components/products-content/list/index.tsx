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
  const nodeId = router.query.nodeId;
  const searchUrl = router.query.search;
  var token: any;
  if (typeof window !== "undefined") {
    // Code running in the browser
    token = localStorage.getItem("token");
  }


  const getSearchData = async () => {
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

  const getProductData = async () => {
    try {
      const resp = await fetch(
        `${API_URL}/catalog-search?category=${nodeId}&include=abstract-products`,
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
      getProductData();
    }
  }, [nodeId]);

  useEffect(() => {
    const handleMerchant = async (skuId:any) => {
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
        console.log(response,"dfks")
        
      } catch (error) {
      console.log(error,"skls")

      }
    };
    
    // Call the handleMerchant function here
    handleMerchant
  }, []);



  return (
    <>
      {!searchResults && <ProductsLoading />}

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
      )}
    </>
  );
};

export default ProductsContent;
