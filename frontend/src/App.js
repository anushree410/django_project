//import logo from './logo.svg';
import './App.css';
import ChatbotUI from './components/ChatbotUI';
import AuthPage from './components/AuthPage';
import {
  HashRouter as Router,
  Routes, Route, Navigate
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/chat" element={<ChatbotUI />} />
              <Route path="*" element={<Navigate to="/auth"/>} />
            </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
