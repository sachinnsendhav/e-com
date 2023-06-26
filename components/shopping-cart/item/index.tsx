import { useState } from 'react';
import { ProductStoreType } from 'types';

const ShoppingCart = ({ thumb, name,pliId, id, avalibility, size, count, price,setProductCount,removeProductFromCart }: ProductStoreType) => {
  var token:any;
  var cartId:any;
  if (typeof window !== 'undefined') {
    // Code running in the browser
     token = localStorage.getItem("token");
     cartId = localStorage.getItem("cartId");
  }

  return (
    <tr>
      <td>
        <div className="cart-product">
          <div className="cart-product__img">
            <img src={thumb} alt="" />
          </div>

          <div className="cart-product__content">
            <h3>{name}</h3>
            {/* <p>#{id}</p> */}
            {/* <p>{pliId}</p> */}
            {/* {console.log(avalibility,"avaaaa_____")} */}
            <p>{avalibility?.availability? <span style={{color:'green'}}>In Stock</span>:<span style={{color:'red'}}>out of stock</span>}</p>
            {/* <p>{avalibility?.isNeverOutOfStock? '':<span style={{color:'red'}}>only {avalibility?.quantity} avalibility</span>}</p> */}
          </div>
        </div>
      </td>
      <td className="cart-item-before" data-label="Color"> </td>
      <td className="cart-item-before" data-label="Size"> </td>
      <td>
        <div className="quantity-button">
          <button type="button" onClick={() => setProductCount(count - 1,pliId,id)} className="quantity-button__btn">
            -
          </button>
          <span>{ count }</span>
          <button type="button" onClick={() => setProductCount(count + 1,pliId,id)} className="quantity-button__btn">
            +
          </button>
        </div>
      </td>
      <td>&euro; {price}</td>
      <td className="cart-item-cancel"><i className="icon-cancel" onClick={() => removeProductFromCart(pliId)}></i></td>
    </tr>
  )
};

  
export default ShoppingCart