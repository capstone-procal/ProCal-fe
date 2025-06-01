import { useState, useRef } from "react";
import { Card } from "react-bootstrap";

function MarketCard({ item, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const images = item.images?.length ? item.images : ["/default-image.png"];

  const startSlide = () => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1000);
  };

  const stopSlide = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(0);
  };

  return (
    <Card
      className="h-100"
      onMouseEnter={startSlide}
      onMouseLeave={stopSlide}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={images[currentIndex]}
        alt={item.title}
        style={{ height: "180px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title className="mb-1">{item.title}</Card.Title>
        <Card.Text className="fw-semibold mb-2">
          {item.price.toLocaleString()}원
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">{item.status}</small>
      </Card.Footer>
    </Card>
  );
}

export default MarketCard;