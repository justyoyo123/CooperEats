// CustomImage.js
export default function CustomImage({ imgSrc, pt }) {
    return (
      <div className="custom-image" style={{ paddingTop: pt }}>
        {/* Ensure imgSrc is the imported image */}
        <img src={imgSrc} alt="" />
      </div>
    );
  }
  