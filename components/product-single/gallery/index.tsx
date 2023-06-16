

const Gallery = (images: any) => {
  const featImage = images.images;
  return (
    <section className="product-gallery">
      <div className="product-gallery__thumbs">

        <div key={images.images} className="product-gallery__thumb">
          <img src={images.images} alt="" />
        </div>

      </div>

      <div className="product-gallery__image">
        <img src={featImage} alt="" />
      </div>
    </section>
  );
};

export default Gallery;
