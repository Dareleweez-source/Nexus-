import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import UserProfile from './components/UserProfile';
import Shop from './components/Shop';
import StoreDetail from './components/StoreDetail';
import CreateStore from './components/CreateStore';
import AddProduct from './components/AddProduct';
import SearchPage from './components/SearchPage';
import CreatePost from './components/CreatePost';
import MessagesPage from './components/MessagesPage';
import ChatPage from './components/ChatPage';
import ReelsPage from './components/ReelsPage';
import CreateReel from './components/CreateReel';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/reels/create" element={<CreateReel />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/create" element={<CreateStore />} />
          <Route path="/shop/:storeId" element={<StoreDetail />} />
          <Route path="/shop/:storeId/add-product" element={<AddProduct />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:conversationId" element={<ChatPage />} />
          <Route path="/notifications" element={<div className="pt-24 sm:pt-24 sm:pl-72 p-8 text-center text-gray-400">Notifications Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
