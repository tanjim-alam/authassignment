import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading} = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(signupUser(form)).unwrap();
      alert(res?.message || 'Signup successful');
      navigate('/login');
    } catch (err) {
      alert(err || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
          <div className='flex justify-between items-center'>
            <Link to="/login">Login</Link>
            <Link to="/forget-password">Forget Password</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
