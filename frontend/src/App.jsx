import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Welcome from './pages/Welcome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
