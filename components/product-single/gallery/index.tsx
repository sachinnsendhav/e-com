import React, { useState } from 'react';

const Gallery = ( images:any) => {
  const [selectedImage, setSelectedImage] = useState((typeof(images?.images) == "object")? images?.images[0]:"");

  const handleThumbnailClick = (image:any) => {
    setSelectedImage(image);
  };
  return (
    <section className="product-gallery">
      <div className="product-gallery__thumbs">
        {(typeof(images?.images) == "object") ? images?.images?.map((image:any, index:number) => (
          <div key={index} className="product-gallery__thumb" onClick={() => handleThumbnailClick(image)}>
            <img src={image} alt="" />
          </div>
        )):
        <div className="product-gallery__thumb">
        <img src={images?.images} alt="" />
        </div>

        }
      </div>

      <div className="product-gallery__image">
        {selectedImage ? 
        <img src={selectedImage} alt="" />:
        <img src={images?.images} alt="" />}
      </div>
    </section>
  );
};

export default Gallery;
