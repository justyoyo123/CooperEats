import Carousel from 'react-bootstrap/Carousel';
import beefLasagnaImage from '../../foodImages/beefRasagna.png'; // Ensure this path is correct
import chocoChipImage from '../../foodImages/chocoChip.png';
import grilledSalmonImage from '../../foodImages/grilledSalmon.png';
import chickenWingsImage from '../../foodImages/chickenWing.png';
import vstirFryImage from '../../foodImages/vstirFry.png';
function ExampleCarouselImage({ src, text }) {
    return <img src={src} alt={text} className="d-block w-100 carousel-image" />;
}

function Car() {
    return (
        <div>
            <h2 className="daily-suggestions-header">Daily Suggestions</h2>
        <Carousel fade className="carousel-container">
          <Carousel.Item>
            <ExampleCarouselImage src={beefLasagnaImage} text="First slide" />
            <Carousel.Caption>
              <h3>Beef Lasagna</h3>
              <p>Layers of pasta, seasoned beef, and cheese.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <ExampleCarouselImage src={vstirFryImage} text="Second slide" />
            <Carousel.Caption>
              <h3>Vegetable Stir Fry</h3>
              <p>A mix of fresh vegetables sautéed with soy sauce.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <ExampleCarouselImage src={grilledSalmonImage} text="Third slide" />
            <Carousel.Caption>
              <h3>Grilled Salmon</h3>
              <p>Grilled salmon with a lemon herb seasoning</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        </div>
      );
}

export default Car;
