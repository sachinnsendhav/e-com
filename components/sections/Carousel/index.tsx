import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import {IS_LOGGEDIN} from '../../../config'


function index(data: any) {
  const [authStatus, setAuthStatus]= useState<any>("false");

  console.log(data, "data for carousal");
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const newData = Array.from(Object.values(data));
  const imageData: any = newData.pop();
  const updatedArr: any[] = [];
  newData.forEach((element: any) => {
    imageData.forEach((img: any) => {
      if (element.image[0]?.sys?.id === img?.sys?.id) {
        updatedArr.push({
          image: `https:${img.fields.file.url}`,
          btnlink: element.btnlink,
          btntext: element.btntext,
          description: element.description,
          isLoggedIn: element.isLoggedIn,
          title: element.title,
        });
      }
    });
  });



  console.log(updatedArr, "updatedArr");
  useEffect(() => {
    setAuthStatus(localStorage.getItem("status"));
  }, [newData])

  return (
    <>
      <div className="carousalContainer">
        <Slider {...settings}>
          {updatedArr?.map((item: any, index: number) => (
            authStatus == (item?.isLoggedIn).toString() ?

              <>
                <div className="carousalItem" style={{ width: "100%" }} key={index}>
                  <img
                    alt="carousalImg"
                    style={{ height: "35rem", width: "100%" }}
                    src={item?.image}
                  />
                  <div className="carousalDetails">
                    <h3>{item?.title}</h3>
                    <p>{item?.description}</p>
                    <a onClick={() => (window.location.href = item?.btnlink)}>{item?.btntext}</a>
                  </div>
                </div>
              </> : null
          ))}
        </Slider>
      </div>
    </>
  );
}
export default index;
