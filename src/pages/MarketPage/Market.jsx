import { useEffect, useState } from "react";
import api from "../../utils/api";
import MarketCard from "../../components/cards/MarketCard";
import MarketWriteModal from "../../components/modals/MarketWriteModal";
import MarketDetailModal from "../../components/modals/MarketDetailModal";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import "./Market.css"
import "../../styles/buttons.css"
import "../../styles/chores.css";

function Market() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("전체");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchUserInfo();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/market");
      setItems(res.data.items);
    } catch (err) {
      console.error("마켓 데이터 로딩 실패:", err);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await api.get("/user/me");
      setCurrentUserId(res.data._id);
    } catch (err) {
      console.error("유저 정보 로딩 실패:", err);
    }
  };

  const handleItemCreated = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    setShowWriteModal(false);
  };

  const handleItemUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
    setShowEditModal(false);
    setShowDetailModal(false);
  };

  const handleItemDeleted = (deletedId) => {
    setItems((prev) => prev.filter((item) => item._id !== deletedId));
    setShowDetailModal(false);
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const filteredItems = items.filter((item) => {
  if (filter === "전체") return true;
  if (filter === "판매중") return item.status === "판매중";
  if (filter === "판매완료") return item.status === "판매완료";
  if (filter === "내 게시글") {
    const userId = typeof item.userId === "string" ? item.userId : item.userId?._id;
    return userId === currentUserId;
  }
  return true;
});

  return (
    <Container className="Main-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="market-title">🛒 Market</h1>
        <div className="d-flex gap-2 align-items-center">

          <Dropdown as={ButtonGroup} className="dropdown">
            <Dropdown.Toggle variant="outline-secondary">
              {filter}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {["전체", "판매중", "판매완료", "내 게시글"].map((type) => (
                <Dropdown.Item key={type} onClick={() => setFilter(type)}>
                  {type}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button className="write-btn" onClick={() => setShowWriteModal(true)}>
            ✏️ 글쓰기
          </Button>
        </div>
      </div>

      <Row>
        {filteredItems.map((item) => (
          <Col key={item._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <MarketCard item={item} onClick={() => handleCardClick(item)} />
          </Col>
        ))}
      </Row>

      <MarketWriteModal
        show={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onItemCreated={handleItemCreated}
      />

      <MarketWriteModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        isEdit={true}
        item={selectedItem}
        onItemUpdated={handleItemUpdated}
      />

      <MarketDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        item={selectedItem}
        currentUserId={currentUserId}
        onEditClick={() => setShowEditModal(true)}
        onDelete={() => handleItemDeleted(selectedItem._id)}
      />
    </Container>
  );
}

export default Market;