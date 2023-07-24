import { ProductStoreType } from 'types';
import { CURRENCY_SYMBOLE } from 'config';

const ShoppingCart = ({ thumb, name, pliId, id, avalibility, size, count, price, setProductCount, removeProductFromCart, grandTotal, subTotal, taxTotal }: ProductStoreType) => {
 
  console.log(grandTotal,"this is the grandTotal");
  console.log(subTotal,"this is the SubTotal");
  console.log(taxTotal,"this is the te")


  


  return (
  
    <div className="cart-item" style={{ marginBottom: "10px",paddingRight:"15px", width: "100%", border: "3px solid rgba(0, 0, 0, 0.05)"}}>
      <div className="cart-item__content" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", height: "200px",width:"8rem", padding: "1rem", marginRight: "1rem" }}>
          <div className="cart-item__left" style={{ width: "100%", marginTop: "2rem", marginRight: "1rem", overflow: "hidden" }}>
            <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "2rem", position: "absolute" }}>
          <div>
            <h3>{name}</h3>
            <p style={{ marginTop: '10px' }}>{avalibility?.availability ? <span style={{ color: 'green' }}>In Stock</span> : <span style={{ color: 'red' }}>Out of stock</span>}</p>
          </div>
        </div>
        <div style={{ alignItems: "right", marginTop: "2rem" }}>
        <div style={{ background: "rgba(0, 0, 0, 0.05)", marginLeft: "28.6rem", padding: "8px", display: "inline-block" }} className="quantity-buttons">
  <span style={{ color: "black", fontSize:"1rem" , fontWeight:"500",  padding: "4px 8px", borderRadius: "4px" }}>Quantity :</span>
  <button type="button" style={{ background: "white", width: "25px" }} onClick={() => setProductCount(count - 1, pliId, id)} className="quantity-button__btn">
    -
  </button>
  <span>{count}</span>
  <button type="button" style={{ background: "white", width: "25px" }} onClick={() => setProductCount(count + 1, pliId, id)} className="quantity-button__btn">
    +
  </button>
</div>
          <div style={{ marginTop: "1rem" }}>
            <div style={{ marginLeft: "29rem", fontSize:"1rem" , fontWeight:"500" ,  color:"#4c4c4c", padding: "0.7rem", background: "rgba(0, 0, 0, 0.05)" }}> Item Total: {CURRENCY_SYMBOLE}  {price / 100}</div>
          </div>
          <div>
          <div
  style={{
    marginLeft: "32rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
  }}
  onClick={() => removeProductFromCart(pliId)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="grey"
    viewBox="0 0 24 24"
    width="20px"
    height="24px"
  >
    <path d="M 9 2 C 7.8954305 2 7 2.8954305 7 4 L 7 5 L 5 5 C 4.4477153 5 4 5.4477153 4 6 L 4 7 L 20 7 L 20 6 C 20 5.4477153 19.552285 5 19 5 L 17 5 L 17 4 C 17 2.8954305 16.104569 2 15 2 L 9 2 z M 5 9 L 5 19 C 5 20.10457 5.8954305 21 7 21 L 17 21 C 18.10457 21 19 20.10457 19 19 L 19 9 L 5 9 z M 7 11 L 9 11 L 9 19 L 7 19 L 7 11 z M 11 11 L 13 11 L 13 19 L 11 19 L 11 11 z M 15 11 L 17 11 L 17 19 L 15 19 L 15 11 z" />
  </svg>
  <span style={{ marginLeft: "0.5rem", color: "grey", fontSize: "0.8125rem" }}>
    Delete
  </span>
</div>

          </div>
        </div>
      </div>

      




      {/* <div className='right_data' style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        

        

       
      </div> */}
      </div>
     
   
  )
};

export default ShoppingCart;

