import { ProductStoreType } from 'types';
import { CURRENCY_SYMBOLE } from 'config';


const ShoppingCart = ({ thumb, name, pliId, id, avalibility, size, count, price, setProductCount, removeProductFromCart }: ProductStoreType) => {
  console.log(size)

  return (
    <tr style={{border:"8px solid #f5f5f5", background:"#fff"}}>
      <td>
        <div className="cart-product">
          <div className="cart-9g">
            <img src={thumb} alt="" style={{
              width: "80px",
              objectFit: "cover",
              height: "80px",
              margin:"1rem"
            }} />
          </div>

          <div className="cart-product__content">
            <h3>{name}</h3>
            {/* <p>#{id}</p> */}
            {/* <p>{pliId}</p> */}
            <p>{avalibility?.availability ? <span style={{ color: 'green' }}>In Stock</span> : <span style={{ color: 'red' }}>out of stock</span>}</p>
            {/* <p>{avalibility?.isNeverOutOfStock? '':<span style={{color:'red'}}>only {avalibility?.quantity} avalibility</span>}</p> */}
          </div>
        </div>
      </td>
      <td className="cart-item-before" data-label="Color"> </td>
      <td className="cart-item-before" data-label="Size"> </td>
      <td>
        <div className="quantity-button">
          <button type="button" onClick={() => setProductCount(count - 1, pliId, id)} className="quantity-button__btn">
            -
          </button>
          <span>{count}</span>
          <button type="button" onClick={() => setProductCount(count + 1, pliId, id)} className="quantity-button__btn">
            +
          </button>
        </div>
      </td>
      <td>{CURRENCY_SYMBOLE} {price}</td>
      <td className="cart-item-cancel" style={{paddingRight:"1rem"}}><i className="icon-cancel" onClick={() => removeProductFromCart(pliId)}></i></td>
    </tr>
  )
};


export default ShoppingCart