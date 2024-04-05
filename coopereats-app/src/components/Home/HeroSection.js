import CustomImage from './CustomImage';

const HeroSection = () => {
const images = [
    "../../foodImages/img_1.jpg",
    "../../foodImages/img_2.jpg",
    "../../foodImages/img_3.jpg",
    "../../foodImages/img_4.jpg",
    "../../foodImages/img_5.jpg",
    "../../foodImages/img_6.jpg",
    "../../foodImages/img_7.jpg",
    "../../foodImages/img_8.jpg",
    "../../foodImages/img_9.jpg",
  ]

  return (
  <div className="sectionn">
  <div className="coll">
    <h1 className="titlee">What Are We About</h1>
    <p className="infoo">Intro</p>
    <button className="btnn">explore now</button>
  </div>
  <div className="galleryy">
      { images.map((src, index) => (
        <CustomImage key={index} imgSrc={src} pt={"120%"}/>
      ))}


  </div>
</div>
  );
}
  export default HeroSection;