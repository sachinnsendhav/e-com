import ReviewsList from './reviews-list';
import Punctuation from './punctuation';


const Reviews = ({ show, product }:any ) => {
  const style = {
    display: show ? 'flex' : 'none',
  }

  return (
    <section style={style} className="product-single__reviews">
      <Punctuation 
        punctuation={product.punctuation.punctuation}
        countOpinions={product.punctuation.countOpinions}
        votes={product.punctuation.votes} 
      />
      <ReviewsList reviews={product.reviews} />
    </section>
  );
};
  
export default Reviews;
    