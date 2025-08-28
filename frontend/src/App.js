import './App.css';
import AuthPage from './components/AuthPage';
import ChatLayout from "./components/ChatLayout";
import {
  HashRouter as Router,
  Routes, Route, Navigate
} from "react-router-dom";
function App() {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <div className="App bg-[#343541] h-screen">
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/chat"
              element={isAuthenticated ? <ChatLayout /> : <Navigate replace to="/auth" />}
            />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </Router>
    </div>

  );
}

export default App;
