import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import InnerCirclePage from "./pages/InnerCircle";
import ReelsGuide from "./pages/ReelsGuide";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<InnerCirclePage />} />
        <Route path="/guides/reels" element={<ReelsGuide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
