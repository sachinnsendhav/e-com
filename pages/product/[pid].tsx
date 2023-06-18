import { GetServerSideProps } from 'next'

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import Layout from '../../layouts/Main';
import Breadcrumb from '../../components/breadcrumb';
import ProductsFeatured from '../../components/products-featured';
import Gallery from '../../components/product-single/gallery';
import Content from '../../components/product-single/content';
import Description from '../../components/product-single/description';
import Reviews from '../../components/product-single/reviews';
import { useRouter } from 'next/router';

const Product = () => {
  const router = useRouter();
  const productId = router.query.skuId;

  const [showBlock, setShowBlock] = useState('description');
  const [product, setProduct] = useState<any>()
  const [img, setImg] = useState()
  console.log("productId", productId)

  const getProductDetails = async () => {
    try {
      const resp = await fetch(
        `https://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/${productId}`,
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
      console.error('Error occurred while fetching product:', error);
    }

    try {
      const img = await fetch(
        `https://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/${productId}/abstract-product-image-sets`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );
      const imgData = await img.json();
      setImg(imgData.data[0]?.attributes.imageSets[0].images[0].externalUrlLarge);
      console.log("imgData", imgData.data[0]?.attributes.imageSets[0].images[0].externalUrlLarge);
    } catch (error) {
      console.error('Error occurred while fetching image:', error);
    }
  }
  console.log("product details", product)
  useEffect(() => {
    if (productId) {
      getProductDetails()
    }
  }, [productId])
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
              <button type="button" onClick={() => setShowBlock('description')} className={`btn btn--rounded ${showBlock === 'description' ? 'btn--active' : ''}`}>Description</button>
              {/* <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Reviews (2)</button> */}
            </div>
            <div>{product?.description}</div>
            <Description show={showBlock === 'description'} />
            {/* <Reviews product={product} show={showBlock === 'reviews'} /> */}
          </div>
        </div>
      </section>

      {/* <div className="product-single-page">
        <ProductsFeatured />
      </div> */}
      <Footer />
    </Layout>
  );
}

export default Product






// import { GetServerSideProps } from 'next'

// import { useState } from 'react';
// import Footer from '../../components/footer';
// import Layout from '../../layouts/Main';
// import Breadcrumb from '../../components/breadcrumb';
// import ProductsFeatured from '../../components/products-featured';
// import Gallery from '../../components/product-single/gallery';
// import Content from '../../components/product-single/content';
// import Description from '../../components/product-single/description';
// import Reviews from '../../components/product-single/reviews';
// import { server } from '../../utils/server';

// // types
// import { ProductType } from 'types';

// type ProductPageType = {
//   product: ProductType;
// }

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const pid = query.pid;
//   const res = await fetch(`${server}/api/product/${pid}`);
//   const product = await res.json();

//   return {
//     props: {
//       product,
//     },
//   }
// }

// const Product = ({ product }: ProductPageType) => {
//   const [showBlock, setShowBlock] = useState('description');

//   return (
//     <Layout>
//       <Breadcrumb />

//       <section className="product-single">
//         <div className="container">
//           <div className="product-single__content">
//             <Gallery images={product.images} />
//             <Content product={product} />
//           </div>

//           <div className="product-single__info">
//             <div className="product-single__info-btns">
//               <button type="button" onClick={() => setShowBlock('description')} className={`btn btn--rounded ${showBlock === 'description' ? 'btn--active' : ''}`}>Description</button>
//               <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Reviews (2)</button>
//             </div>

//             <Description show={showBlock === 'description'} />
//             <Reviews product={product} show={showBlock === 'reviews'} />
//           </div>
//         </div>
//       </section>

//       <div className="product-single-page">
//         <ProductsFeatured />
//       </div>
//       <Footer />
//     </Layout>
//   );
// }

// export default Product
