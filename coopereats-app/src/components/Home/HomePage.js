import Top from './Top/Top.jsx'
import ExploreMenu from './ExploreMenu/ExploreMenu.jsx';
import DailySuggestionsCarousel from './DailySuggestion/Carrouu.js'; // Make sure the path is correct
import DailySuggestion from './DailySuggestion/DailySuggestions.js';

const HomePage = () => {
  return (
    <>
      <Top />
      <ExploreMenu />
      <DailySuggestion/>
    </>

  );
};

export default HomePage;