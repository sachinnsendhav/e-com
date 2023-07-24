// import { GetServerSideProps } from 'next'

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import Layout from '../../layouts/Main';
import Breadcrumb from '../../components/breadcrumb';
// import ProductsFeatured from '../../componen/ts/products-featured';
import Gallery from '../../components/product-single/gallery';
import Content from '../../components/bundleProduct-item/bundlePdp';
// import Description from '../../components/product-single/description';
// import Reviews from '../../components/product-single/reviews';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {API_URL, CURRENCY_SYMBOLE} from 'config';
//@ts-ignore
import img12 from '../../assets/images/colbundle.jpg';


const BundleProduct = ({ image }:any) => {
  const router = useRouter();
  const productId = router.query.skuId;
  var cartId: any;
  var token: any;
  var customerGroup: any = "";
  if (typeof window !== "undefined") {
    // Code running in the browser
    cartId = localStorage.getItem("cartId");
    token = localStorage.getItem("token");
    customerGroup = localStorage.getItem("customerGroup");
  }

  const [showBlock, setShowBlock] = useState('description');
  const [product, setProduct] = useState<any>()
  const [img, setImg] = useState()
  const [imgData, setImgData] = useState([]);
  const [authToken, setAuthToken] = useState<any>("");
  const [productIds, setProductIds] = useState<any[]>([])
  const [productData, setProductData] = useState<any[]>([])
  const [bundleProductData, setBundleProductData] = useState<any>([]);
  const [bundleProductDataProps, setBundleProductDataProps] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const temp = product?.description.split('&')[1]
  const mainDisc = product?.description.split('&')[0]
  const sentences = temp?.split(/\.|<B>/)
    .map((sentence: any) => sentence.replace(/-/g, ' ').replace(/<br\/?>/g, '').replace(/<\/?b>/g, ''));
  console.log(sentences,"descccc");
  // const [bundleProductIds, setBundleProductIds] = useState<any[]>([])
  useEffect(() => {
    // getBundleProducts();
    setAuthToken(localStorage.getItem("token"))
  }, [])

//   const getBundleProducts = async() => {
//     try {
//         const resp = await fetch(
//           `${API_URL}/concrete-products/${productId}/bundled-products`,
//           {
//             method: 'GET',
//             headers: {
//               Accept: 'application/json',
//             },
//           }
//         );
//         const result = await resp.json();
//         const tempArr:any = [];
//         await result?.data?.map((item:any)=>{
//             tempArr.push(item.id)
//         })
//         setBundleProductIds(tempArr);
//         // setProduct(result.data.attributes);
//       } catch (error) {
//         console.error('Error occurred while fetching product:', error);
//       }
//   }

  const getProductDetails = async () => {
    try {
      const resp = await fetch(
        `${API_URL}/abstract-products/${productId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );
      const result = await resp.json();
      setProduct(result.data.attributes);
    } catch (error) {
    }

    try {
      const img = await fetch(
        `${API_URL}/abstract-products/${productId}/abstract-product-image-sets`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );
      const imgData = await img.json();
      setImg(imgData?.data? imgData?.data[0]?.attributes.imageSets[0].images[0].externalUrlLarge:"");
    } catch (error) {
      console.error('Error occurred while fetching image:', error);
    }
  }
  useEffect(() => {
    if (productId) {
      getProductDetails()
      const getBundleProductData = async() => {
        try {
            const resp = await fetch(`${API_URL}/concrete-products/${productId}/bundled-products`, {
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
                setBundleProductData(response?.data)
                console.log(response,"response12")
              setIsLoading(false);
            } else {
              setIsLoading(false);
            }
          } catch (error) {
            setIsLoading(false);
          }
      }
    getBundleProductData();
    }
  }, [productId])

  // related product

  const getRelatedProduct = async (id: any) => {
    try {
      const resp = await fetch(`${API_URL}/abstract-products/${id}/related-products`, {
        method: 'GET',
        headers: {
          // authorization: `Bearer ${authToken}`
        }
      });
  
      if (!resp.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await resp.json();
      setProductIds(result?.data);
    } catch (error) {
      console.error('Error fetching related products:',error);
      setProductIds([]);
    }
  };
  

  const getProductData = async (id: any) => {
    const resp = await fetch(`${API_URL}/concrete-products/${id}?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
    const result = await resp.json();
    setProductData((productData) => [...productData, {
      name: result.data.attributes.name,
      id: result.data.id,
      image: result.included[0]?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge,
      price: result.included[2]?.attributes?.price
    }])
  }

  useEffect(() => {
    if (productId) {
      getRelatedProduct(productId);
    }
  }, [authToken, productId])

  useEffect(() => {
    setProductData([])
    if (productIds?.length > 0) {
      productIds.forEach((element: any) => {
        getProductData(element.attributes.attributeMap.product_concrete_ids[0])
      });
    }
  }, [productIds])

  console.log(bundleProductData,"bundleProductData")
  useEffect(() => {
    const handleBundleProdData = async () => {
      if (bundleProductData) {
        try {
          const tempArr:any = [];
          const fetchPromises = bundleProductData.map(async (item:any) => {
            const resp = await fetch(
              `${API_URL}/concrete-products/${item.id}?include=concrete-product-image-sets`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const response = await resp.json();
            if (resp.status === 200) {
              console.log(response, "Included");
              item.image = response?.included[0]?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge;
              item.name = response?.data?.attributes?.name;
              tempArr.push(response?.included[0]?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge);
            }
          });
  
          await Promise.all(fetchPromises);
          setBundleProductData(bundleProductData);
          setBundleProductDataProps(bundleProductData);
          setImgData(tempArr);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    };
  
    handleBundleProdData();
  }, [bundleProductData]);
  

  return (
    <Layout>
      <Breadcrumb />

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            {imgData &&
            <Gallery images={[img12.src,...imgData]} />}
            {bundleProductDataProps && bundleProductDataProps[1] &&
            <Content product={{product:product,bundleProductDataProps:bundleProductDataProps}}/>}
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              {/* <button type="button" onClick={() => setShowBlock('description')} className={`btn btn--rounded ${showBlock === 'description' ? 'btn--active' : ''}`}>Description</button> */}
              <h2>Description</h2> 
              {/* <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Reviews (2)</button> */}
            </div>
            <p style={{ fontWeight: "600",marginBottom:"10px" }}>{mainDisc}</p> 
            <p
              style={{
                fontFamily: "inherit",
                letterSpacing: "1px",
                lineHeight: "25px",
                marginLeft:"10px"
              }}
            ><ul className="description-section">{sentences?.map((item:any) => item ? <li>{item}</li>:"")}
            </ul>
            </p>
            {/* <p style={{ fontFamily: "inherit", letterSpacing: "1px", lineHeight: "25px" }}>{product?.description}</p> */}
            {/* <Description show={showBlock === 'description'} /> */}
            {/* <Reviews product={product} show={showBlock === 'reviews'} /> */}
          </div>
        </div>
        {productData.length > 0 ?
          <>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", paddingInline: "50px",paddingTop:"30px", color: "#7f7f7f" }}>
              Related Products</h1>
            <div style={{ display: "flex", overflowX: "scroll", marginInline: "50px"}}>
              {
                productData.map((item: any) => {
                  return (
                    <div style={{ padding: "5px" }}>
                      <Link href={`/product/${item.name}?skuId=${item.id.split('_')[0]}`}>
                        <div style={{ padding: "5px" }}>
                          <img src={item.image} style={{ width: "220px", height: "250px", objectFit: "contain" }} />
                          <p style={{ paddingLeft: "10px" }}>{item.name}</p>
                          <p style={{ fontWeight: "bold", paddingTop: "5px", paddingLeft: "10px" }}>{CURRENCY_SYMBOLE} {item.price}</p>
                        </div>
                      </Link>
                    </div>
                  )
                })
              }
            </div>
          </>
          : null}
      </section>

      {/* <div className="product-single-page">
        <ProductsFeatured />
      </div> */}
      <Footer />
    </Layout>
  );
}

BundleProduct.getInitialProps = ({ query }:any) => {
  return { image: query.image };
};

export default BundleProduct;




