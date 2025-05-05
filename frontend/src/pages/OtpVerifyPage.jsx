import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '../redux/authSlice';
import { useLocation } from 'react-router-dom';

function OtpVerifyPage() {
    const location = useLocation();
  const email = location.state?.email;
    const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(verifyOTP({email, otp})).unwrap();
      alert(res?.message || 'Verify successful');
      setOtp("")
    } catch (err) {
        alert(err || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">OTP Verification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="otp">Enter Opt</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              type="number"
              name="otp"
              id="otp"
              placeholder="Enter otp"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            {loading ? 'Verifing...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerifyPage;
