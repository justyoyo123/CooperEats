import Top from './Top/Top.jsx'
import ExploreMenu from './ExploreMenu/ExploreMenu.jsx';
import DailySuggestionsCarousel from './Carousel/Carrouu.js'; // Make sure the path is correct
import Footer from './Footer/Footer.jsx'

const HomePage = () => {
  return (
    <>
      <Top />
      <ExploreMenu />
      <DailySuggestionsCarousel /> {/* Use the carousel component */}
      <Footer/>
    </>

  );
};

export default HomePage;