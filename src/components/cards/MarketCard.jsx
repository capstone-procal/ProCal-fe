import React from "react";
import { Card } from "react-bootstrap";
import "./MarketCard.css"

function MarketCard({ item, onClick }) {
  const imageSrc = Array.isArray(item.images) && item.images.length > 0
    ? item.images[0]
    : "/default-image.png";

  const priceText = typeof item.price === "number"
    ? `${item.price.toLocaleString()}원`
    : "가격 미정";

  return (
    <Card className="marketcard h-100" onClick={onClick}>
      <Card.Img
        variant="top"
        src={imageSrc}
        alt={item.title}
        style={{ height: '180px', objectFit: 'cover' }}
      />

      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text className="text-truncate">{item.description}</Card.Text>
      </Card.Body>

      <Card.Footer>
        <small className="text-muted">{item.status} · {priceText}</small>
      </Card.Footer>
    </Card>
  );
}

export default MarketCard;