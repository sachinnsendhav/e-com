import useSwr from 'swr';
import ProductItem from '../../product-item';
import ProductsLoading from './loading';
import { ProductTypeList } from 'types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import API_URL from 'config';
import { forEach } from 'lodash';
const ProductsContent = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const nodeId = router.query.nodeId;
  const searchUrl = router.query.search;


  const getSearchData = async () => {
    const resp = await fetch(
      `${API_URL}/catalog-search-suggestions?q=${searchUrl}&include=abstract-products%2Cconcrete-products%2F`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();
    result?.data[0]?.attributes?.abstractProducts.forEach((element: any) => {
      result?.included.forEach((item: any) => {
        if (element.abstractSku === item.id) {
          setSearchResults((searchResults) => [...searchResults, {
            abstractName: element.abstractName,
            abstractSku: element.abstractSku,
            price: element.price,
            image: element.images[0].externalUrlLarge,
            concreteId: item.attributes.attributeMap.product_concrete_ids[0]
          }])
        }
      });
    });
    // setSearchResults(result?.data[0]?.attributes?.abstractProducts);
  }
  useEffect(() => {
    if (searchUrl) {
      getSearchData()
    }
  }, [searchUrl])

  const getProductData = async () => {
    const resp = await fetch(
      `${API_URL}/catalog-search?category=${nodeId}&include=abstract-products`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();
console.log("pppp",result)

    result?.data[0]?.attributes?.abstractProducts.forEach((element: any) => {
      result?.included.forEach((item: any) => {
        if (element.abstractSku === item.id) {
          setProducts((products) => [...products, {
            abstractName: element.abstractName,
            abstractSku: element.abstractSku,
            price: element.price,
            image: element.images[0].externalUrlLarge,
            concreteId: item.attributes.attributeMap.product_concrete_ids[0]
          }])
        }
      });
    });
    // setProducts(result?.data[0]?.attributes?.abstractProducts);
    // setProducts(result?.included)
  }

  useEffect(() => {
    if (nodeId) {
      getProductData()
    }
  }, [nodeId])
  return (
    <>
      {!searchResults &&
        <ProductsLoading />
      }

      {searchResults &&
        <section className="products-list">
          {searchResults.map((item: any) => (
            <ProductItem
              id={item.abstractSku}
              name={item.abstractName}
              price={item.price}
              key={item.abstractSku}
              images={item.image}
              concreteId={item.concreteId}
            />
          ))}
        </section>
      }
      {products &&
        <section className="products-list">
          {products.map((item: any) => (
            <ProductItem
              id={item.abstractSku}
              name={item.abstractName}
              price={item.price}
              key={item.abstractSku}
              images={item.image}
              concreteId={item.concreteId}

            />
          ))}
        </section>
      }
    </>
  );
};

export default ProductsContent