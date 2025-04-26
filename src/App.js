import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Mypage from "./pages/Mypage";
import QnA from "./pages/QnA";
import Market from "./pages/Market";
import Chat from "./pages/Chat";
import LoginModal from "./components/modals/LoginModal";
import SignupModal from "./components/modals/SignupModal";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  const handleRequireLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={
            <Home isLoggedIn={isLoggedIn} onRequireLogin={handleRequireLogin} />
          }
        />
        <Route path="/detail" element={<Detail />} />
        <Route
          path="/mypage"
          element={
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
            >
              <Mypage />
            </PrivateRoute>
          }
        />
        <Route
          path="/qna"
          element={
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
            >
              <QnA />
            </PrivateRoute>
          }
        />
        <Route
          path="/market"
          element={
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
            >
              <Market />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
            >
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => {
          setShowLoginModal(false); 
          setShowSignupModal(true); 
        }}
      />

      <SignupModal
        show={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false); 
          setShowLoginModal(true); 
        }}
      />
    </MainLayout>
  );
}

export default App;
