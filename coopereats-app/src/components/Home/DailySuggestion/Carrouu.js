import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Example images, ensure paths are correct
import beefLasagnaImage from '../../../foodImages/beefRasagna.png';
import chocoChipImage from '../../../foodImages/chocoChip.png';
import grilledSalmonImage from '../../../foodImages/grilledSalmon.png';
import doubleCMuffinImage from '../../../foodImages/dChocolate.png';
import './Carrouu.css';

function ExampleCarouselImage({ src, text }) {
  return <img src={src} alt={text} className="d-block w-100 carousel-image" />;
}

const DailySuggestionsCarousel = () => {
  const carouselItems = [
    { src: beefLasagnaImage, title: "Beef Lasagna", description: "A delicious Italian dish with layers of cheese and pasta." },
    { src: chocoChipImage, title: "Choco Chip Muffin", description: "Sweet muffins filled with chocolate chips." },
    { src: grilledSalmonImage, title: "Grilled Salmon", description: "Perfectly grilled salmon with a side of vegetables." },
    { src: doubleCMuffinImage, title: "Double Chocolate Muffin", description: "Rich double chocolate delight, every bite full of chips" }
  ];

  return (
    <div>
      <h2 className="daily-suggestions">Daily Suggestions</h2>
      <div className="d-flex justify-content-center">
        <Carousel className="carousel-container">
          {carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <Card style={{ width: '18rem' }}>
                <ExampleCarouselImage src={item.src} text={item.title} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default DailySuggestionsCarousel;