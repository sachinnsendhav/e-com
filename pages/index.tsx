import Layout from '../layouts/Main';
import PageIntro from '../components/page-intro';
import ProductsFeatured from '../components/products-featured';
import Footer from '../components/footer';
import Subscribe from '../components/subscribe';
import { useEffect, useState } from 'react'
const IndexPage = () => {
  const [cmsData, setCmsData] = useState()
  // const getCmsData = async () => {
  //   const resp = await fetch(
  //     `https://api.contentful.com/spaces/b7hw33ucy3y5/environments/master/entries`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         "Authorization": "Bearer CFPAT-KzYKhO_GOkax642G9p4aKHTTmVCVrqwZg597yLpvXhE",
  //       },
  //     },
  //   );
  //   const result = await resp.json();
  //   result.items.forEach((element: any) => {
  //     if (element.sys.contentType.sys.id === "nextTest") {
  //       setCmsData(element.fields)
  //     }
  //   });
  // }
  console.log("cms-data", cmsData)

  const fetchData = async () => {
    const url = 'https://graphql.contentful.com/content/v1/spaces/b7hw33ucy3y5/environments/master';
    const query = `{
      nextContentfulHeaderImageCollection {
        items {
          description
          heroBanner {
            url
          }
        }
      }
      nextContentfulMidSectionCollection {
        items {
          midSectionImageCollection {
            items {
              url
            }
          }
          midSectionDescription
          midSectionButtonTitle
        }
      }
      nextContentfulBottomCollection {
        items {
          iconClass
          iconTitle
          iconDescription
        }
      }
    }`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1bKW_Ovigequ04fW779NKR1inURdE7FPGRKhIFRMyuM',
      },
      body: JSON.stringify({ query }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('API response:', data);
      setCmsData(data.data)
      // Process the response data as per your requirements
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  // Call the fetchData function to make the API request

  useEffect(() => {
    fetchData();
    // getCmsData()
  }, [])

  return (
    <Layout>
      {cmsData ? <>
        <PageIntro cmsData={cmsData} />

        <section className="featured">
          <div className="container">
            <article style={{ backgroundImage: `url(${cmsData.nextContentfulMidSectionCollection.items[0].midSectionImageCollection.items[0].url})` }} className="featured-item featured-item-large">
              <div className="featured-item__content">
                <h3>{cmsData.nextContentfulMidSectionCollection.items[0].midSectionDescription}</h3>
                <a href="#" className="btn btn--rounded">{cmsData.nextContentfulMidSectionCollection.items[0].midSectionButtonTitle}</a>
              </div>
            </article>
            <article style={{ backgroundImage: `url(${cmsData.nextContentfulMidSectionCollection.items[1].midSectionImageCollection.items[0].url})` }} className="featured-item featured-item-small-first">
              <div className="featured-item__content">
                <h3>{cmsData.nextContentfulMidSectionCollection.items[1].midSectionDescription}</h3>
                <a href="#" className="btn btn--rounded">{cmsData.nextContentfulMidSectionCollection.items[1].midSectionButtonTitle}</a>
              </div>
            </article>

            <article style={{ backgroundImage: `url(${cmsData.nextContentfulMidSectionCollection.items[2].midSectionImageCollection.items[0].url})` }} className="featured-item featured-item-small">
              <div className="featured-item__content">
                <h3>{cmsData.nextContentfulMidSectionCollection.items[2].midSectionDescription}</h3>
                <a href="#" className="btn btn--rounded">{cmsData.nextContentfulMidSectionCollection.items[2].midSectionButtonTitle}</a>
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
              {cmsData.nextContentfulBottomCollection.items.length > 0 ?
                cmsData.nextContentfulBottomCollection.items.map((item: any) => {
                  return (
                    <li>
                      <i className={item.iconClass}></i>
                      <div className="data-item__content">
                        <h4>{item.iconTitle}</h4>
                        <p>{item.iconDescription}</p>
                      </div>
                    </li>
                  )
                }) : null}
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