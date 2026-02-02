import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
        setFormData({
            username: user.name || '',
            email: user.email || '',
            password: '',
            confirmPassword: ''
        });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile updated successfully!');
            // Update the local storage and context with new user data
            // Since role doesn't change here, we can construct the object
            login({ ...user, name: data.name, email: data.email }, token);
        } else {
            alert(`Update failed: ${data.message}`);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while updating profile.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors group">
                 <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                 </svg>
              </button>
              <h1 className="text-3xl font-bold text-slate-800">Edit Profile</h1>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <form className="space-y-8" onSubmit={handleSave}>
                
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-white text-3xl font-bold uppercase shadow-lg">
                        {formData.username ? formData.username.substring(0, 2) : 'US'}
                    </div>
                    {/* Placeholder text removed or changed to static info */}
                    <p className="text-slate-400 text-sm font-medium">Profile Picture</p>
                </div>

                <div className="space-y-6">
                    <Input 
                        label="Username" 
                        name="username"
                        placeholder="Your Name" 
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <Input 
                        label="Email Address" 
                        name="email"
                        type="email" 
                        placeholder="email@example.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="New Password" 
                            name="password"
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={handleInputChange}
                            autoComplete="new-password"
                        />
                        <Input 
                            label="Confirm Password" 
                            name="confirmPassword"
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => navigate(-1)} className="h-12 px-6 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="h-12 px-8 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;