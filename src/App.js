import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Mypage from './pages/Mypage';
import QnA from './pages/QnA';
import Market from './pages/Market';
import Chat from './pages/Chat';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certificate/:id" element={<Detail />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/qna" element={<QnA />} />
        <Route path="/market" element={<Market />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </MainLayout>
  );
}

export default App;