// import { useState, useEffect } from "react";
// import Footer from "../../components/footer";
// import Layout from "../../layouts/Main";
// import Breadcrumb from "../../components/breadcrumb";
// import Gallery from "../../components/product-single/gallery";
// import Content from "../../components/product-single/content";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { API_URL, CURRENCY_SYMBOLE } from "config";

// const Product = () => {
//   const router = useRouter();
//   const productId = router.query.skuId;
//   const [showBlock, setShowBlock] = useState("description");
//   const [product, setProduct] = useState<any>();
//   const [img, setImg] = useState();
//   const [authToken, setAuthToken] = useState<any>("");
//   const [productIds, setProductIds] = useState<any[]>([]);
//   const [productData, setProductData] = useState<any[]>([]);
//   useEffect(() => {
//     setAuthToken(localStorage.getItem('token'));
//   }, []);

//   const getProductDetails = async () => {
//     try {
//       const resp = await fetch(`${API_URL}/abstract-products/${productId}`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });
//       const result = await resp.json();
//       setProduct(result.data.attributes);
//     } catch (error) {
//       console.error("Error occurred while fetching product:", error);
//     }

//     try {5
//       const img = await fetch(
//         `${API_URL}/abstract-products/${productId}/abstract-product-image-sets`,
//         {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );
//       const imgData = await img.json();
//       setImg(
//         imgData.data[0]?.attributes.imageSets[0].images[0].externalUrlLarge
//       );
//     } catch (error) {
//       console.error("Error occurred while fetching image:", error);
//     }
//   };

//   const temp = product?.description.split('&')[1]
//   const mainDisc = product?.description.split('&')[0]
//   const sentences = temp?.split(/\.|<B>/)
//     .map((sentence: any) => sentence.replace(/-/g, ' ').replace(/<br\/?>/g, '').replace(/<\/?b>/g, ''));
//   //console.log(sentences,"descccc");
//   useEffect(() => {
//     if (productId) {
//       getProductDetails();
//     }
//   }, [productId]);

//   // related product

//   const getRelatedProduct = async (id: any) => {
//     const resp = await fetch(
//       `${API_URL}/abstract-products/${id}/related-products`,
//       {
//         method: "GET",
//         headers: {
//           authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     const result = await resp.json();
//     setProductIds(result?.data);
//   };

//   const getProductData = async (id: any) => {
//     const resp = await fetch(
//       `${API_URL}/concrete-products/${id}?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
//       {
//         method: "GET",
//         headers: {
//           authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     const result = await resp.json();
//     setProductData((productData) => [
//       ...productData,
//       {
//         name: result.data.attributes.name,
//         id: result.data.id,
//         image:
//           result.included[0]?.attributes?.imageSets[0]?.images[0]
//             ?.externalUrlLarge,
//         price: result.included[2]?.attributes?.price,
//       },
//     ]);
//   };

//   useEffect(() => {
//     if (productId) {
//       getRelatedProduct(productId);
//     }
//   }, [authToken, productId]);

//   useEffect(() => {
//     setProductData([]);
//     if (productIds?.length > 0) {
//       productIds.forEach((element: any) => {
//         getProductData(element.attributes.attributeMap.product_concrete_ids[0]);
//       });
//     }
//   }, [productIds]);

//   return (
//     <Layout>
//       <Breadcrumb />

//       <section className="product-single">
//         <div className="container">
//           <div className="product-single__content">
//             <Gallery images={img} />
//             <Content product={product} />
//           </div>

//           <div className="product-single__info">
//             <div className="product-single__info-btns">
//               {/* <button
//                 type="button"
//                 onClick={() => setShowBlock("description")}
//                 className={`btn btn--rounded ${
//                   showBlock === "description" ? "btn--active" : ""
//                 }`}
//               > */}
//                <h2>Description</h2> 
//               {/* </button> */}
//               {/* <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Reviews (2)</button> */}
//             </div>
//             {/* // updated the code because it was showing html tags aas texts, added bullet points to the description to make it look appealing */}
//             <p style={{ fontWeight: "600",marginBottom:"10px" }}>{mainDisc}</p> 
//             <p
//               style={{
//                 fontFamily: "inherit",
//                 letterSpacing: "1px",
//                 lineHeight: "25px",
//                 marginLeft:"10px"
//               }}
              
//             ><ul className="description-section">{sentences?.map((item:any) => item ? <li>{item}</li>:"")}
//             </ul>
//             </p>
//           </div>
//         </div>
//         {productData.length > 0 ? (
//           <>
//             <h1
//               style={{
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 paddingInline: "50px",
//                 paddingTop: "30px",
//                 color: "#7f7f7f",
//               }}
//             >
//               Related Products
//             </h1>
//             <div
//               style={{
//                 display: "flex",
//                 overflowX: "scroll",
//                 marginInline: "50px",
//               }}
//             >
//               {productData.map((item: any) => {
//                 return (
//                   <div style={{ padding: "5px" }}>
//                     <Link
//                       href={`/product/${item.name}?skuId=${
//                         item.id.split("_")[0]
//                       }`}
//                     >
//                       <div style={{ padding: "5px" }}>
//                         <img
//                           src={item.image}
//                           style={{
//                             width: "220px",
//                             height: "250px",
//                             objectFit: "contain",
//                           }}
//                         />
//                         <p style={{ paddingLeft: "10px" }}>{item.name}</p>
//                         <p
//                           style={{
//                             fontWeight: "bold",
//                             paddingTop: "5px",
//                             paddingLeft: "10px",
//                           }}
//                         >
//                           {CURRENCY_SYMBOLE} {item.price}
//                         </p>
//                       </div>
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         ) : null}
//       </section>
//       <Footer />
//     </Layout>
//   );
// };

// export default Product;


//-----------------------------------
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
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState<any>();
  const [img, setImg] = useState();
  const [authToken, setAuthToken] = useState<any>("");
  const [productIds, setProductIds] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [tutorialsContent, setTutorialsContent] = useState<string[]>([]);
  const [howTosContent, setHowTosContent] = useState<string[]>([]);

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

  useEffect(() => {
    const sentences = temp
      ?.split(/\.|<B>/)
      .map((sentence: any) =>
        sentence.replace(/-/g, " ").replace(/<br\/?>/g, "").replace(/<\/?b>/g, "")
      );
    setTutorialsContent(sentences?.slice(0, 4) || []);
    setHowTosContent(sentences?.slice(4) || []);
  }, [temp]);

  useEffect(() => {
    if (productId) {
      getProductDetails();
    }
  }, [productId]);

  // Related products

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
        price: result.included[2]?.attributes?.price/100,
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
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`btn btn--rounded ${
                  activeTab === "description" ? "btn--active" : ""
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tutorials")}
                className={`btn btn--rounded ${
                  activeTab === "tutorials" ? "btn--active" : ""
                }`}
              >
                Tutorials & How TO's
              </button>
             
            </div>
            {activeTab === "description" && (
              <>
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>
                  {mainDisc}
                </p>
                <ul className="description-section">
                {tutorialsContent.map((item: any, index: number) => (
                  <li style={{padding:"0.5rem"}} key={index}>{item}</li>
                ))}
                </ul>
              </>
            )}
     {activeTab === "tutorials" && (
 <div style={{ marginLeft: "12px" }} className="video-container">
 <div
   style={{
     width: "600px", // Adjust width as needed
     height: "300px", // Adjust height as needed
     border: "1px solid black",
     borderRadius: "2px",
    
     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
     overflow: "hidden", // Hide any overflowing content
   }}
 >
   <iframe
     width="600"
     height="300"
     src="https://www.youtube.com/embed/q41FgNuoVmE"
     title="YouTube video player"
     frameBorder="0"
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
     allowFullScreen
   ></iframe>
 </div>
</div>


)}

           
          </div>
        </div>
        {productData.length > 0 && (
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
                          {CURRENCY_SYMBOLE} {item.price/100}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
      <Footer />
    </Layout>
  );
};

export default Product;

