import Layout from '../layouts/Main';
import PageIntro from '../components/page-intro';
import ProductsFeatured from '../components/products-featured';
import Footer from '../components/footer';
import Subscribe from '../components/subscribe';
import { useEffect, useState } from 'react'
const IndexPage = () => {
  const [cmsData, setCmsData] = useState()
  const getCmsData = async () => {
    const resp = await fetch(
      `https://api.contentful.com/spaces/b7hw33ucy3y5/environments/master/entries`,
      {
        method: 'GET',
        headers: {
          "Authorization": "Bearer CFPAT-KzYKhO_GOkax642G9p4aKHTTmVCVrqwZg597yLpvXhE",
        },
      },
    );
    const result = await resp.json();
    result.items.forEach((element: any) => {
      if (element.sys.contentType.sys.id === "nextTest") {
        setCmsData(element.fields)
      }
    });
  }
  useEffect(() => {
    getCmsData()
  }, [])

  return (
    <Layout>
      {cmsData ? <>
        <PageIntro cmsData={cmsData}/>

        <section className="featured">
          <div className="container">
            <article style={{ backgroundImage: `url(https://${cmsData?.midSectionImageOne['en-US']})` }} className="featured-item featured-item-large">
              <div className="featured-item__content">
                <h3>{cmsData?.midSectionTextOne['en-US']}</h3>
                <a href="#" className="btn btn--rounded">{cmsData?.midSectionButtonTextOne['en-US']}</a>
              </div>
            </article>

            <article style={{ backgroundImage: `url(https://${cmsData?.midSectionImageTwo['en-US']})` }} className="featured-item featured-item-small-first">
              <div className="featured-item__content">
                <h3>{cmsData?.midSectionTextTwo['en-US']}</h3>
                <a href="#" className="btn btn--rounded">{cmsData?.midSectionButtonTextTwo['en-US']}</a>
              </div>
            </article>

            <article style={{ backgroundImage: `url(https://${cmsData?.midSectionImageThree['en-US']})` }} className="featured-item featured-item-small">
              <div className="featured-item__content">
                <h3>{cmsData?.midSectionTextThree['en-US']}</h3>
                <a href="#" className="btn btn--rounded">{cmsData?.midSectionButtonTextThree['en-US']}</a>
              </div>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <header className="section__intro">
              <h4>Why should you choose us?</h4>
            </header>

            <ul className="shop-data-items">
              <li>
                <i className={cmsData.chooseIconImageOne['en-US']}></i>
                <div className="data-item__content">
                  <h4>{cmsData.chooseIconHeadTextOne['en-US']}</h4>
                  <p>{cmsData.chooseIconDescriptionTextOne['en-US']}</p>
                </div>
              </li>
              <li>
                <i className={cmsData.chooseIconImageTwo['en-US']}></i>
                <div className="data-item__content">
                  <h4>{cmsData.chooseIconHeadTextTwo['en-US']}</h4>
                  <p>{cmsData.chooseIconDescriptionTextTwo['en-US']}</p>
                </div>
              </li>
              <li>
                <i className={cmsData.chooseIconImageThree['en-US']}></i>
                <div className="data-item__content">
                  <h4>{cmsData.chooseIconHeadTextThree['en-US']}</h4>
                  <p>{cmsData.chooseIconDescriptionTextThree['en-US']}</p>
                </div>
              </li>
              <li>
                <i className={cmsData.chooseIconImageFour['en-US']}></i>
                <div className="data-item__content">
                  <h4>{cmsData.chooseIconHeadTextFour['en-US']}</h4>
                  <p>{cmsData.chooseIconDescriptionTextFour['en-US']}</p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </> : null}
      {/* <ProductsFeatured /> */}
      <Subscribe />
      <Footer />
    </Layout>
  )
}


export default IndexPage