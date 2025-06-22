import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/HomePage/Home";
import Detail from "./pages/DetailPage/Detail";
import MyPage from "./pages/MyPage/MyPage";
import QnAListPage from "./pages/QnAPage/QnAListPage";
import QnADetailPage from "./pages/QnAPage/QnADetailPage";
import Market from "./pages/MarketPage/Market";
import Chat from "./pages/ChatPage/Chat";
import AdminPage from "./pages/AdminPage/AdminPage";

import LoginModal from "./components/modals/LoginModal";
import SignupModal from "./components/modals/SignupModal";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 
  const [userRole, setUserRole] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  const [redirectPath, setRedirectPath] = useState(null); 

  useEffect(() => { 
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("userRole");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role || "user");
    } else {
    setIsLoggedIn(false);
  }
  }, []);
  if (isLoggedIn === null) return null; 

  const handleRequireLogin = (path) => { 
    setRedirectPath(path);
    setShowLoginModal(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (role = "user") => { 
  setIsLoggedIn(true);
  setUserRole(role);
  setShowLoginModal(false);

  if (redirectPath) {
    navigate(redirectPath); 
    setRedirectPath(null);
  }
};

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");

    window.location.reload(); 
  };

  return (
    <MainLayout
      userRole={userRole}
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
      onLoginClick={handleLoginClick}
    >
      <Routes>
        <Route
          path="/"
          element={
            <Home isLoggedIn={isLoggedIn} onRequireLogin={handleRequireLogin} />
          }
        />
        <Route path="/certificate/:id" element={<Detail />} />
        <Route
          path="/mypage"
          element={
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
            >
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route path="/qna" element={<QnAListPage />} />
        <Route
          path="/qna/:postId"
          element={
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
            >
              <QnADetailPage />
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
        <Route
          path="/chat/:roomId"
          element={
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleRequireLogin}
            >
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onRequireLogin={handleRequireLogin}
            >
              <AdminPage />
            </AdminRoute>
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
