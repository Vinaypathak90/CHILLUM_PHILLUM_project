import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from "../../config";

const Login = () => {
    // ─── AUTH MODES ───
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [otpMode, setOtpMode] = useState(false); // 🔥 NEW: OTP Screen Toggle

    // ─── FORM STATES ───
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // 🔥 NEW: OTP Input State
    
    // ─── UI STATES ───
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    // ==========================================
    // 1. TRADITIONAL AUTHENTICATION & OTP FLOW
    // ==========================================
    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            // ─── CASE A: FORGOT PASSWORD FLOW ───
            if (isForgotPassword) {
                if (!otpMode) {
                    // Step 1: Request OTP for Password Reset
                    const res = await axios.post(`${config.API_BASE_URL}/auth/forgot-password-otp`, { email });
                    if (res.data.success) {
                        setSuccessMsg('OTP sent to your email!');
                        setOtpMode(true); // Show OTP Input
                    }
                } else {
                    // Step 2: Verify OTP & Reset Password
                    const res = await axios.post(`${config.API_BASE_URL}/auth/reset-password`, { email, otp, newPassword: password });
                    if (res.data.success) {
                        setSuccessMsg('Password reset successful! Please sign in.');
                        setTimeout(() => toggleMode(true), 2000); // Switch to login
                    }
                }
            } 
            // ─── CASE B: SIGNUP FLOW ───
            else if (!isLogin) {
                if (!otpMode) {
                    // Step 1: Request OTP for New Account
                    const res = await axios.post(`${config.API_BASE_URL}/auth/request-otp`, { name, email, password });
                    if (res.data.success) {
                        setSuccessMsg('OTP sent! Please check your email.');
                        setOtpMode(true); // Show OTP input
                    }
                } else {
                    // Step 2: Verify OTP & Create Account
                    const res = await axios.post(`${config.API_BASE_URL}/auth/verify-otp`, { name, email, password, otp });
                    if (res.data.success) {
                        setSuccessMsg('Account created successfully! Redirecting...');
                        // Auto Login after signup
                        localStorage.setItem('accessToken', res.data.accessToken);
                        setTimeout(() => navigate('/dashboard'), 2000);
                    }
                }
            } 
            // ─── CASE C: STANDARD LOGIN FLOW ───
            else {
                const res = await axios.post(`${config.API_BASE_URL}/auth/login`, { email, password }, { withCredentials: true });
                if (res.data.success) {
                    localStorage.setItem('accessToken', res.data.accessToken);
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.response?.data?.message || 'Request Failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 2. GOOGLE LOGIN (Backend OAuth Hook)
    // ==========================================
    const handleGoogleAuth = () => {
        // Redirect to your Node.js Google OAuth Endpoint
        window.location.href = `${config.API_BASE_URL}/auth/google`;
    };

    // ==========================================
    // UI TOGGLES
    // ==========================================
    const toggleMode = (forceLogin = false) => {
        setIsLogin(forceLogin === true ? true : !isLogin);
        setIsForgotPassword(false);
        setOtpMode(false); // Reset OTP Screen
        setError('');
        setSuccessMsg('');
        setName('');
        setPassword('');
        setOtp('');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F9] px-4 font-sans selection:bg-[#292e91] selection:text-white py-12">
            
            {/* ── TOP LOGO AREA ── */}
            <div className="mb-8">
                <div className="w-[84px] h-[84px] bg-[#292e91] rounded-full flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-4 border-white">
                    <img src="/img/logo.png" alt="Logo" className="h-12 w-12 object-contain invert brightness-0" onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='<span class="text-white font-black text-3xl">CP</span>'; }} />
                </div>
            </div>

            {/* ── MAIN AUTH CARD ── */}
            <div className="w-full max-w-[460px] bg-white rounded-[24px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-12 transition-all duration-500 relative overflow-hidden">
                
                {/* HEADER */}
                <div className="text-center mb-8">
                    <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-3">
                        {isForgotPassword ? 'Reset Password' : (isLogin ? 'Sign In Access' : 'Create an Account')}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium px-2 leading-relaxed">
                        {otpMode 
                            ? "We've sent a 6-digit verification code to your email." 
                            : (isForgotPassword 
                                ? "Enter your email and we'll send an OTP to verify your identity."
                                : (isLogin 
                                    ? 'Welcome back! Please enter your details to access your account.' 
                                    : 'Fill in your details below to become a verified member.'))}
                    </p>
                </div>

                {/* ALERTS */}
                {error && <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center font-semibold animate-[fadeIn_0.3s_ease-out]">{error}</div>}
                {successMsg && <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm text-center font-semibold animate-[fadeIn_0.3s_ease-out]">{successMsg}</div>}

                {/* ── GOOGLE AUTH BUTTON (Only on normal Login/Signup screens) ── */}
                {!isForgotPassword && !otpMode && (
                    <div className="mb-6 animate-[fadeIn_0.3s_ease-out]">
                        <button type="button" onClick={handleGoogleAuth} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 active:scale-[0.98] disabled:opacity-50">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Or continue with email</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>
                    </div>
                )}

                {/* ── FORMS ── */}
                <form onSubmit={handleAuth} className="flex flex-col gap-5">
                    
                    {/* STEP 1: INITIAL DETAILS (Hidden if OTP Mode is active) */}
                    {!otpMode && (
                        <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out]">
                            {/* NAME INPUT (Signup Only) */}
                            {!isLogin && !isForgotPassword && (
                                <div className="flex flex-col gap-2">
                                    <label className="block text-gray-900 text-sm font-bold ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full py-3.5 pl-12 pr-4 bg-[#fcfcfc] border border-gray-200 rounded-xl text-[15px] font-medium focus:outline-none focus:border-[#292e91] focus:ring-[3px] focus:ring-[#292e91]/20 transition-all" placeholder="Enter your full name" required={!isLogin && !isForgotPassword} />
                                    </div>
                                </div>
                            )}

                            {/* EMAIL INPUT */}
                            <div className="flex flex-col gap-2">
                                <label className="block text-gray-900 text-sm font-bold ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full py-3.5 pl-12 pr-4 bg-[#fcfcfc] border border-gray-200 rounded-xl text-[15px] font-medium focus:outline-none focus:border-[#292e91] focus:ring-[3px] focus:ring-[#292e91]/20 transition-all" placeholder="your@email.com" required />
                                </div>
                            </div>

                            {/* PASSWORD INPUT (Hidden in Forgot Password Step 1) */}
                            {!isForgotPassword && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="block text-gray-900 text-sm font-bold">Password</label>
                                        {isLogin && <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs font-bold text-[#292e91] hover:underline focus:outline-none">Forgot Password?</button>}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
                                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full py-3.5 pl-12 pr-12 bg-[#fcfcfc] border border-gray-200 rounded-xl text-[15px] font-medium focus:outline-none focus:border-[#292e91] focus:ring-[3px] focus:ring-[#292e91]/20 transition-all" placeholder={isLogin ? "Enter Password" : "Create a secure password"} required={!isForgotPassword} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                                            {showPassword ? <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: OTP VERIFICATION BOX (Shows only in OTP Mode) */}
                    {otpMode && (
                        <div className="flex flex-col gap-5 animate-[fadeIn_0.4s_ease-out]">
                            <div className="flex flex-col gap-2">
                                <label className="block text-gray-900 text-sm font-bold ml-1 text-center">Enter 6-Digit OTP</label>
                                <input 
                                    type="text" 
                                    maxLength="6" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                    className="block w-full py-4 bg-[#fcfcfc] border border-gray-200 rounded-xl text-center text-2xl tracking-[0.5em] font-black focus:outline-none focus:border-[#292e91] focus:ring-[3px] focus:ring-[#292e91]/20 transition-all" 
                                    placeholder="••••••" 
                                    required 
                                />
                            </div>

                            {/* IF FORGOT PASSWORD: Ask for new password during OTP step */}
                            {isForgotPassword && (
                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="block text-gray-900 text-sm font-bold ml-1">New Password</label>
                                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full py-3.5 px-4 bg-[#fcfcfc] border border-gray-200 rounded-xl text-[15px] font-medium focus:outline-none focus:border-[#292e91] focus:ring-[3px] focus:ring-[#292e91]/20 transition-all" placeholder="Create a new password" required />
                                </div>
                            )}
                        </div>
                    )}

                    {/* MAIN SUBMIT BUTTON */}
                    <div className="pt-2">
                        <button type="submit" disabled={loading} className="w-full flex justify-center p-4 border border-transparent rounded-xl shadow-[0_8px_20px_-8px_rgba(41,46,145,0.5)] text-[15px] font-bold text-white bg-[#292e91] hover:bg-[#1e226a] transition-all duration-300 tracking-wide uppercase focus:outline-none focus:ring-4 focus:ring-[#292e91]/30 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...
                                </span>
                            ) : (
                                otpMode 
                                    ? (isForgotPassword ? 'VERIFY & RESET PASSWORD' : 'VERIFY & CREATE ACCOUNT')
                                    : (isForgotPassword ? 'SEND OTP TO EMAIL' : (isLogin ? 'SIGN IN' : 'REQUEST OTP TO SIGNUP'))
                            )}
                        </button>
                    </div>
                </form>

                {/* ── FOOTER TOGGLES ── */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    {(isForgotPassword || otpMode) ? (
                        <button type="button" onClick={() => toggleMode(true)} className="text-[#292e91] font-bold text-sm hover:underline focus:outline-none">
                            ← Cancel and back to Sign In
                        </button>
                    ) : (
                        <p className="text-gray-500 text-sm font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button type="button" onClick={toggleMode} className="ml-2 text-[#292e91] font-bold hover:underline focus:outline-none">
                                {isLogin ? 'Sign up here' : 'Sign in here'}
                            </button>
                        </p>
                    )}
                </div>
            </div>
            
            {/* BACK TO WEBSITE */}
            <div className="mt-8 text-center">
                <a href="/" className="text-sm font-semibold text-gray-400 hover:text-[#292e91] transition-colors duration-300">
                    ← Return to Main Site
                </a>
            </div>

            <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}} />
        </div>
    );
}; 

export default Login;