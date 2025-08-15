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
    <div className="App">
      <header className="App-header">
        <Router>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/chat" element={isAuthenticated ? <ChatLayout /> : <Navigate replace to="/auth" />}/>
              <Route path="*" element={<Navigate to="/auth"/>} />
            </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
