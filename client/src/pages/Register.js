import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Rwanda Provinces and Districts
const rwandaData = {
  provinces: [
    'Kigali City',
    'Northern Province',
    'Southern Province',
    'Eastern Province',
    'Western Province'
  ],
  districts: {
    'Kigali City': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
    'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
    'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
    'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
    'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro']
  },
  sectors: {
    'Gasabo': ['Bumbogo', 'Gatsata', 'Jari', 'Kacyiru', 'Kimihurura', 'Kimisagara', 'Kinyinya', 'Ndera', 'Nduba', 'Rwezamenyo'],
    'Kicukiro': ['Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Masaka', 'Niboye', 'Nyagatovu', 'Ruhuha'],
    'Nyarugenge': ['Gitega', 'Kigali', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Rwezamenyo']
  }
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    meterNumber: '',
    email: '',
    province: '',
    district: '',
    sector: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset district and sector when province changes
      if (name === 'province') {
        newData.district = '';
        newData.sector = '';
      }
      // Reset sector when district changes
      if (name === 'district') {
        newData.sector = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      window.showToast('Passwords do not match', 'error');
      return;
    }

    if (!formData.province || !formData.district) {
      window.showToast('Please select province and district', 'error');
      return;
    }

    setLoading(true);
    
    const result = await register({
      name: formData.name,
      phone: formData.phone,
      meterNumber: formData.meterNumber,
      email: formData.email || '',
      province: formData.province,
      district: formData.district,
      sector: formData.sector || '',
      password: formData.password
    });
    
    if (result.success) {
      window.showToast('Registration successful!', 'success');
      navigate('/dashboard');
    } else {
      window.showToast(result.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-800 via-secondary-900 to-primary-900 px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-3 shadow-lg shadow-primary-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Smart Power Notify</h1>
          <p className="text-secondary-400 text-sm">Create your account</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="07XXXXXXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">Meter Number</label>
                <input
                  type="text"
                  name="meterNumber"
                  value={formData.meterNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="Your meter number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">Province</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  required
                >
                  <option value="">Select Province</option>
                  {rwandaData.provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.province}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm disabled:opacity-50"
                  required
                >
                  <option value="">Select District</option>
                  {formData.province && rwandaData.districts[formData.province]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="Password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-secondary-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
