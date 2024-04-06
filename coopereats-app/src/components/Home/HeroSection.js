import CustomImage from './CustomImage';
import img1 from '../../foodImages/img_1.jpg';
import img2 from '../../foodImages/img_2.jpg';
import img3 from '../../foodImages/img_3.jpg';
import img4 from '../../foodImages/img_4.jpg';
import img5 from '../../foodImages/img_5.jpg';
import img6 from '../../foodImages/img_6.jpg';
import img7 from '../../foodImages/img_7.jpg';
import img8 from '../../foodImages/img_8.jpg';
import img9 from '../../foodImages/img_9.jpg';


const HeroSection = () => {
const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
  
  return (
  <div className="sectionn container">
  <div className="coll">
    <h1 className="titlee">What Are We About</h1>
    <p className="infoo">CooperEats is a place where you can please your soul</p>
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