import React from "react";
import { Card } from "react-bootstrap";

function MarketCard({ item, onClick }) {
  return (
    <Card className="h-100" onClick={onClick}>
      {item.image ? (
        <Card.Img variant="top" src={item.image} alt={item.title} style={{ height: '180px', objectFit: 'cover' }} />
      ) : (
        <div style={{ height: '180px', backgroundColor: '#e0e0e0' }} />
      )}

      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text className="text-truncate">{item.description}</Card.Text>
      </Card.Body>

      <Card.Footer>
        <small className="text-muted">{item.status}</small>
      </Card.Footer>
    </Card>
  );
}

export default MarketCard;