import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import UserProfile from './components/UserProfile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
