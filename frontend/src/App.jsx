import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Welcome from './pages/Welcome';
import OtpVerifyPage from './pages/OtpVerifyPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp-verify" element={<OtpVerifyPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
