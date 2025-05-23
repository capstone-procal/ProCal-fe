import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import MarketCard from "./component/MarketCard";
import MarketWriteModal from "./component/MarketWriteModal";
import MarketDetailModal from "../../components/modals/MarketDetailModal";
import { Container, Row, Col, Button } from "react-bootstrap";

function Market() {
  const [items, setItems] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);


  useEffect(() => {
    api.get("/market")
      .then((res) => setItems(res.data.items))
      .catch((err) => console.error("마켓 데이터 로딩 실패:", err));
  }, []);

  const handleItemCreated = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    setShowWriteModal(false);
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Market</h1>
        <Button variant="outline-secondary" onClick={() => setShowWriteModal(true)}>
          ✏️ 글쓰기
        </Button>
      </div>

      <Row>
        {items.map((item) => (
          <Col key={item._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <MarketCard item={item} onClick={() => handleCardClick(item)}/>
          </Col>
        ))}
      </Row>

      <MarketWriteModal
        show={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onItemCreated={handleItemCreated}
      />

      <MarketDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        item={selectedItem}
      />
    </Container>
  );
}

export default Market;