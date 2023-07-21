import Layout from "../layouts/Main";
import Footer from "../components/footer";
import Breadcrumb from "../components/breadcrumb";
import ProductItem from "components/bundleProduct-item";
// import ProductsContent from '../components/products-content';

const Bundle = () => (
  <Layout>
    <Breadcrumb />
    <section className="products-page">
      <div className="container">
        <section className="products-content">
          <div className="products-content__intro"></div>

          <section className="products-list">
            <ProductItem
              id="bundle"
              name="Printer Bundle"
              price="150.00"
              key="bundle"
              description="Support small workgroups, hybrid office environments and mobile teams with secure, high-quality printing in a compact package&
                Prints up to 26 ppm, copy, scan, fax.
                2400x600 dpi max print resolution.
                Paper capacity up to 751 sheets.
                Superior features in an affordable package"
              images="https://www.ricoh-usa.com/_next/image?url=http%3A%2F%2Fimages.salsify.com%2Fimages%2Fsazo66qaseg59pluw10a%2Fricohimages_Equipment_Printers-and-Copiers_eqp-p-c311W-10.png&w=1920&q=75"
            />
            {/* <ProductItem
              id="211"
              name="HP Bundle"
              price="$705.00"
              key="211"
              images="https://d2s0ynfc62ej12.cloudfront.net/b2c/product-bundle-hp.jpg"
            />
            <ProductItem
              id="214"
              name="Samsung Bundle"
              price="$950.00"
              key="214"
              images="https://d2s0ynfc62ej12.cloudfront.net/b2c/product-bundle-samsung.jpg"
            />
            <ProductItem
              id="210"
              name="Sony Bundle"
              price="$1,000.00"
              key="210"
              images="https://d2s0ynfc62ej12.cloudfront.net/b2c/product-bundle-sony.jpg"
            /> */}
          </section>
        </section>
      </div>
    </section>
    <Footer />
  </Layout>
);

export default Bundle;
