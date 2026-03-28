import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // <-- CSS FILE IMPORT KI HAI YAHAN
import config from "../../config";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            
            {/* ── TOP LOGO AREA ── */}
            <div className="logo-wrapper">
                <div className="logo-circle">
                    <img 
                        src="/img/logo.png" 
                        alt="Logo" 
                        className="logo-img" 
                        onError={(e) => { 
                            e.target.style.display='none'; 
                            e.target.parentNode.innerHTML='<span style="color: white; font-weight: 900; font-size: 30px;">CP</span>'; 
                        }} 
                    />
                </div>
            </div>

            {/* ── MAIN LOGIN CARD ── */}
            <div className="login-card">
                
                {/* HEADER */}
                <div className="login-header">
                    <h2 className="login-title">Sign In Access</h2>
                    <p className="login-subtitle">
                        You must become a member to login and access the entire site.
                    </p>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="error-msg">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleLogin} className="login-form">
                    
                    {/* EMAIL INPUT */}
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                            <div className="icon-left">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <div className="icon-left">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field input-field-pass"
                                placeholder="Enter Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                            >
                                {showPassword ? (
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="submit-wrapper">
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Processing...' : 'SIGN IN'}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* BACK TO WEBSITE */}
            <div className="back-wrapper">
                <a href="/" className="back-link">
                    ← Return to Main Site
                </a>
            </div>
        </div>
    );
};

export default Login;