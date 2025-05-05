import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { resetPassword1 } from '../redux/authSlice';

function NewPasswordPage() {
  const location = useLocation();
  const email = location.state?.email;
  const [form, setForm] = useState({ newPassword: '', otp:'' });
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(resetPassword1({email, newPassword: form.newPassword, otp: form.otp})).unwrap();
      console.log(res);
      alert(res?.message);
      setForm({ newPassword: '', otp: '' });
    } catch (err) {
        alert(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">OTP</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              type="number"
              name="otp"
              id="otp"
              placeholder="Enter your otp"
              value={form.otp}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">New Password</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter your new password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPasswordPage;
