import Layout from '../layouts/Main';
import Footer from '../components/footer';
import Breadcrumb from '../components/breadcrumb';
import ProductsFilter from '../components/products-filter';
import ProductItem from 'components/bundleProduct-item';
// import ProductsContent from '../components/products-content';

const Bundle = () => (
    <Layout>
        <Breadcrumb />
        <section className="products-page">
            <div className="container">
            <section className="products-content">
      <div className="products-content__intro">
       
      </div>

      <section className="products-list">

      <ProductItem
              id="212"
              name="ASUS Bundle"
              price="€95.00"
              key="212"
              images="https://d2s0ynfc62ej12.cloudfront.net/b2c/product-bundle-asus.jpg"
            />
             <ProductItem
              id="211"
              name="HP Bundle"
              price="€705.00"
              key="211"
              images="https://d2s0ynfc62ej12.cloudfront.net/b2c/product-bundle-hp.jpg"
            />
             <ProductItem
              id="214"
              name="Samsung Bundle"
              price="€950.00"
              key="214"
              images="https://d2s0ynfc62ej12.cloudfront.net/b2c/product-bundle-samsung.jpg"
            />
             <ProductItem
              id="210"
              name="Sony Bundle"
              price="€1,000.00"
              key="210"
              images="https://d2s0ynfc62ej12.cloudfront.net/b2c/product-bundle-sony.jpg"
            />
      </section>
    </section>
            </div>
        </section>
        <Footer />
    </Layout>
)

export default Bundle;
