import { useState, useEffect } from "react";
import Footer from "../../components/footer";
import Layout from "../../layouts/Main";
import Breadcrumb from "../../components/breadcrumb";
import Gallery from "../../components/product-single/gallery";
import Content from "../../components/product-single/content";
import { useRouter } from "next/router";
import Link from "next/link";
import { API_URL, CURRENCY_SYMBOLE } from "config";

const Product = () => {
  const router = useRouter();
  const productId = router.query.skuId;
  const [showBlock, setShowBlock] = useState("description");
  const [product, setProduct] = useState<any>();
  const [img, setImg] = useState();
  const [authToken, setAuthToken] = useState<any>("");
  const [productIds, setProductIds] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  useEffect(() => {
    setAuthToken(localStorage.getItem('token'));
  }, []);

  const getProductDetails = async () => {
    try {
      const resp = await fetch(`${API_URL}/abstract-products/${productId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const result = await resp.json();
      setProduct(result.data.attributes);
    } catch (error) {
      console.error("Error occurred while fetching product:", error);
    }

    try {
      const img = await fetch(
        `${API_URL}/abstract-products/${productId}/abstract-product-image-sets`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const imgData = await img.json();
      setImg(
        imgData.data[0]?.attributes.imageSets[0].images[0].externalUrlLarge
      );
    } catch (error) {
      console.error("Error occurred while fetching image:", error);
    }
  };

  const temp = product?.description.split('&')[1]
  const mainDisc = product?.description.split('&')[0]
  const sentences = temp?.split(/\.|<B>/)
    .map((sentence: any) => sentence.replace(/-/g, ' ').replace(/<br\/?>/g, '').replace(/<\/?b>/g, ''));
  console.log(sentences,"descccc");
  useEffect(() => {
    if (productId) {
      getProductDetails();
    }
  }, [productId]);

  // related product

  const getRelatedProduct = async (id: any) => {
    const resp = await fetch(
      `${API_URL}/abstract-products/${id}/related-products`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }
    );
    const result = await resp.json();
    setProductIds(result?.data);
  };

  const getProductData = async (id: any) => {
    const resp = await fetch(
      `${API_URL}/concrete-products/${id}?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
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
        price: result.included[2]?.attributes?.price,
      },
    ]);
  };

  useEffect(() => {
    if (productId) {
      getRelatedProduct(productId);
    }
  }, [authToken, productId]);

  useEffect(() => {
    setProductData([]);
    if (productIds?.length > 0) {
      productIds.forEach((element: any) => {
        getProductData(element.attributes.attributeMap.product_concrete_ids[0]);
      });
    }
  }, [productIds]);

  return (
    <Layout>
      <Breadcrumb />

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={img} />
            <Content product={product} />
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              {/* <button
                type="button"
                onClick={() => setShowBlock("description")}
                className={`btn btn--rounded ${
                  showBlock === "description" ? "btn--active" : ""
                }`}
              > */}
               <h2>Description</h2> 
              {/* </button> */}
              {/* <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Reviews (2)</button> */}
            </div>
            {/* // updated the code because it was showing html tags aas texts, added bullet points to the description to make it look appealing */}
            <p>{mainDisc}</p>
            <p
              style={{
                fontFamily: "inherit",
                letterSpacing: "1px",
                lineHeight: "25px",
              }}
            >{sentences?.slice(0,3)?.map((item:any) => <li>${item}</li>)}
            </p>
          </div>
        </div>
        {productData.length > 0 ? (
          <>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                paddingInline: "50px",
                paddingTop: "30px",
                color: "#7f7f7f",
              }}
            >
              Related Products
            </h1>
            <div
              style={{
                display: "flex",
                overflowX: "scroll",
                marginInline: "50px",
              }}
            >
              {productData.map((item: any) => {
                return (
                  <div style={{ padding: "5px" }}>
                    <Link
                      href={`/product/${item.name}?skuId=${
                        item.id.split("_")[0]
                      }`}
                    >
                      <div style={{ padding: "5px" }}>
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
                          {CURRENCY_SYMBOLE} {item.price}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </section>
      <Footer />
    </Layout>
  );
};

export default Product;