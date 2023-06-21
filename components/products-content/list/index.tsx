import useSwr from 'swr';
import ProductItem from '../../product-item';
import ProductsLoading from './loading';
import { ProductTypeList } from 'types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
const ProductsContent = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([])
  const [products, setProducts] = useState([])
  const nodeId = router.query.nodeId;
  const searchUrl = router.query.search;


  const getSearchData = async () => {
    const resp = await fetch(
      `https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search-suggestions?q=${searchUrl}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();

    setSearchResults(result?.data[0]?.attributes?.abstractProducts);
  }
  useEffect(() => {
    if (searchUrl) {
      getSearchData()
    }
  }, [searchUrl])

  const getProductData = async () => {
    const resp = await fetch(
      `https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?category=${nodeId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();

    setProducts(result?.data[0]?.attributes?.abstractProducts);
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
              images={item.images[0].externalUrlLarge}
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
              images={item.images[0].externalUrlLarge}
            />
          ))}
        </section>
      }
    </>
  );
};

export default ProductsContent