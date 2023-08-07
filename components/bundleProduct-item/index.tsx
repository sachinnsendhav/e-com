import Link from 'next/link';
import { some } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavProduct } from 'store/reducers/user';
import { RootState } from 'store';
import {API_URL, CURRENCY_SYMBOLE} from '../../config';
import { useEffect, useState } from 'react';
//@ts-ignore
import img from '../../assets/images/colbundle.jpg';

const ProductItem = ({ images, id, name, price, description, skuId }: any) => {

  const dispatch = useDispatch();
  const { favProducts } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState('tutorials');

  const isFavourite = some(favProducts, productId => productId === id);
  const temp = description.split('&')[1]
  const sentences = temp?.split(/\.|<B>/)
    .map((sentence: any) => sentence.replace(/-/g, ' ').replace(/<br\/?>/g, '').replace(/<\/?b>/g, ''));
  //console.log(sentences,"descccc");
  const toggleFav = () => {
    dispatch(toggleFavProduct(
      {
        id,
      }
    ))
  }

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };
  

  return (
    <div className="product-item" style={{height:"auto"}}>
       <button type="button" onClick={toggleFav} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}><i className="icon-heart"></i></button>
      <h3
            style={{
              marginTop: "1rem",
              fontSize: "18px",
            }}
          >
            {name}
          </h3>
          <p style={{ fontSize: ".875rem", marginTop: "1rem" }} className="pid">
            ID: P C311W
          </p>
      <div className="product__image">
       
        
        <Link href={`/bundleProduct/${name}?skuId=${id}&image=${encodeURIComponent(images)}`}>
          <a>
            <img src={img.src} alt="product" />
          </a>
        </Link>
      </div>
      <div className="product__description">
        {/* <h3 style={{fontFamily:"sans-serif"}}>{name}</h3> */}
        {/* <div>
          <span style={{ fontWeight: "bold", color:"black" }}>{CURRENCY_SYMBOLE} {price}</span>
        </div> */}
      </div>
      <div className="product__description">
          {/* <h3 style={{ fontFamily: "sans-serif" }}>Description: </h3> */}
          {sentences?.slice(0, 4).map((item: any, index: number) => (
            <ul>
              {item ? 
              <li style={{ marginTop: "1rem" }} key={index}>
                {item}
              </li>:""}
            </ul>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }} className="product-price">
        <span
          style={{ fontWeight: "bold", color: "rgb(207 18 46)" }}
        >
          {CURRENCY_SYMBOLE}{price}
        </span>
        <button
        
          className="add-to-cart"
          style={{
            padding: "16px 32px",
            color: "rgb(207 18 46)",
            borderRadius: "33px",
            border: "1px solid rgb(207 18 46)",
            fontWeight: "900"
          }}
        >
 



          <a href={`/bundleProduct/${name}?skuId=${id}&image=${encodeURIComponent(images)}`}>
          {" "}
          {"View Details"}
          </a>
        </button>
      </div>
    </div>
  )
};


export default ProductItem