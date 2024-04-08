import Top from './Top/Top.jsx'
import ExploreMenu from './ExploreMenu/ExploreMenu.jsx';
import DailySuggestionsCarousel from './DailySuggestion/Carrouu.js'; // Make sure the path is correct
import Footer from './Footer/Footer.jsx'
import DailySuggestion from './DailySuggestion/DailySuggestions.js';

const HomePage = () => {
  return (
    <>
      <Top />
      <ExploreMenu />
      <DailySuggestion/>
      <Footer/>
    </>

  );
};

export default HomePage;