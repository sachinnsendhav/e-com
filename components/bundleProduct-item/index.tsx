import Link from 'next/link';
import { some } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavProduct } from 'store/reducers/user';
import { RootState } from 'store';
import {CURRENCY_SYMBOLE} from '../../config';

const ProductItem = ({ images, id, name, price }: any) => {
  const dispatch = useDispatch();
  const { favProducts } = useSelector((state: RootState) => state.user);

  const isFavourite = some(favProducts, productId => productId === id);

  const toggleFav = () => {
    dispatch(toggleFavProduct(
      {
        id,
      }
    ))
  }

  return (
    <div className="product-item" style={{height:"auto"}}>
      <div className="product__image">
        <button type="button" onClick={toggleFav} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}><i className="icon-heart"></i></button>

        <Link href={`/bundleProduct/${name}?skuId=${id}&image=${encodeURIComponent(images)}`}>
          <a>
            <img src={images ? images : ''} alt="product" />
          </a>
        </Link>
      </div>
      <div className="product__description">
        <h3 style={{fontFamily:"sans-serif"}}>{name}</h3>
        <div>
          <span style={{ fontWeight: "bold", color:"black" }}>{CURRENCY_SYMBOLE} {price}</span>
        </div>
      </div>
    </div>
  )
};


export default ProductItem