import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";

function index(data: any) {
  // const [finalData, setFinalData]= useState<any>();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <button className="slick-prev">Previous</button>,
    nextArrow: <button className="slick-next">Next</button>,
  };
  const newData = Array.from(Object.values(data));
  newData.pop();
  // useEffect(() => {
  //   if (newData) {
  //     var temp = newData.slice(0,newData.length-2);
  //     setFinalData(temp)
  //   }
  // }, [newData]);

  return (
    <div className="containerParent">
      <h1 className="headingTag">Ricoh News</h1>
      <Slider {...settings}>
        {newData?.map((item: any, index: number) => (
          <div className="newscard" key={index}>
          <div >
            <a href={item?.btnlink}>
              <h3>{item?.description}</h3>
              <h3 style={{paddingTop:'2rem'}}>{moment(item?.date).format("ddd, DD MMMM YYYY")}</h3>
            </a>
          </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default index;
