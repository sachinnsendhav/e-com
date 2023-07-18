import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { toNumber } from "lodash";
// import {IS_LOGGEDIN} from '../../../config'

function index(data: any) {
  const [authStatus, setAuthStatus]= useState("false");

  // const [finalData, setFinalData]= useState<any>();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const newData = Array.from(Object.values(data));
  newData.pop();
  // useEffect(() => {
  //   if (newData) {
  //     var temp = newData.slice(0,newData.length-2);
  //     setFinalData(temp)
  //   }
  // }, [newData]);
console.log(newData,"newData",authStatus)

useEffect(() => {
  setAuthStatus(localStorage.getItem("status"));
}, [newData])
  return (
    <div className="containerParent">
      <style>
        {`
          .slick-prev {
            z-index: 22;
            margin-left: 80px;
          }
  
          .slick-next {
            z-index: 22;
            margin-right: 120px;
          }
  
          .slick-prev:before,
          .slick-next:before {
            font-family: 'fantasy';
            font-size: 22px;
            background: #da1e48;
            opacity: 1;
            padding: 22px;
            border-radius: 40px;
            color: #ffffff; /* Added to specify the text color */
          }
        `}
      </style>
      <h1 className="headingTag">Ricoh News</h1>
      <Slider {...settings}>
        {newData?.map((item: any, index: number) => (
          authStatus == (item?.isLoggedIn).toString() ?
          <div className="newscard" key={index}>
            {console.log(authStatus,"hey",item?.isLoggedIn)}
            <div >
              <a href={item?.btnlink}>
                <h3>{item?.description}</h3>
                <h3 style={{ paddingTop: '2rem' }}>{moment(item?.date).format("ddd, DD MMMM YYYY")}</h3>
              </a>
            </div>
          </div>
          :""
        ))}
      </Slider>
    </div>
  );
}

export default index;
