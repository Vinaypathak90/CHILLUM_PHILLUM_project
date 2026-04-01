import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import config from "../../config";

const Dashboard = () => {
    const [stats, setStats] = useState({ messages: 0, unread: 0, projects: 0, campaigns: 0, team: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [msgRes, projRes, campRes, teamRes] = await Promise.all([
                    axios.get(`${config.API_BASE_URL}/messages`),
                    axios.get(`${config.API_BASE_URL}/projects`),
                    axios.get(`${config.API_BASE_URL}/campaigns`),
                    axios.get(`${config.API_BASE_URL}/team`)
                ]);

                const unreadCount = msgRes.data.data.filter(m => m.status === 'Unread').length;

                setStats({
                    messages: msgRes.data.count || 0,
                    unread: unreadCount || 0,
                    projects: projRes.data.count || 0,
                    campaigns: campRes.data.count || 0,
                    team: teamRes.data.count || 0
                });
                setLoading(false);
            } catch (err) {
                console.error("Dashboard data fetch error:", err);
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const SidebarLink = ({ to, icon, label, badge }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
                <div className="nav-item-left">
                    {icon}
                    <span>{label}</span>
                </div>
                {badge > 0 && <span className="nav-badge">{badge} NEW</span>}
            </Link>
        );
    };

    const getPageTitle = () => {
        if (location.pathname === '/dashboard') return 'Studio Overview';
        const path = location.pathname.split('/').pop();
        return path.replace('-', ' ');
    };

    return (
        <div className="dashboard-container">
            
            {/* ── SIDEBAR ── */}
            {/* Yahan aside ki jagah div kar diya */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo-circle">CP</div>
                    <div>
                        <div className="sidebar-title">ADMIN</div>
                        <div className="sidebar-subtitle">Chillum Phillum</div>
                    </div>
                </div>

                {/* MAIN FIX: <nav> tag ko <div className="sidebar-nav"> kar diya */}
                <div className="sidebar-nav">
                    <SidebarLink to="/dashboard" label="Overview" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
                    <SidebarLink to="/dashboard/content" label="Site Content" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} />
                    <SidebarLink to="/dashboard/projects" label="Projects" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>} />
                    <SidebarLink to="/dashboard/campaigns" label="Campaigns" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>} />
                    <SidebarLink to="/dashboard/team" label="Team Members" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                    <SidebarLink to="/dashboard/messages" label="Inquiries" badge={stats.unread} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                <SidebarLink 
    to="/dashboard/clients" 
    label="Clients" 
    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
/>
                </div>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{width: '20px'}}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        SECURE LOGOUT
                    </button>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            {/* Yahan main ki jagah div kar diya */}
            <div className="main-content">
                
                {/* MAIN FIX: <header> tag ko <div className="dashboard-header"> kar diya */}
                <div className="dashboard-header">
                    <div className="header-title">
                        <h1>{getPageTitle()}</h1>
                        <p>Manage your website content dynamically.</p>
                    </div>
                    
                    <div className="header-actions">
                        <div className="notification-bell" onClick={() => navigate('/dashboard/messages')}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            {stats.unread > 0 && <span className="bell-dot"></span>}
                        </div>
                        <div className="admin-avatar">AD</div>
                    </div>
                </div>

                <Outlet />
                
                {location.pathname === '/dashboard' && (
                    <>
                        {loading ? (
                            <p className="loading-text">Loading Overview Statistics...</p>
                        ) : (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper" style={{backgroundColor: '#eff6ff', color: '#2563eb'}}>📩</div>
                                    <div className="stat-info">
                                        <p>Total Inquiries</p>
                                        <h3>{stats.messages}</h3>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper" style={{backgroundColor: '#f5f3ff', color: '#7c3aed'}}>🎬</div>
                                    <div className="stat-info">
                                        <p>Live Projects</p>
                                        <h3>{stats.projects}</h3>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper" style={{backgroundColor: '#fff7ed', color: '#c2410c'}}>📢</div>
                                    <div className="stat-info">
                                        <p>Active Campaigns</p>
                                        <h3>{stats.campaigns}</h3>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon-wrapper" style={{backgroundColor: '#f0fdf4', color: '#16a34a'}}>👥</div>
                                    <div className="stat-info">
                                        <p>Team Size</p>
                                        <h3>{stats.team}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="quick-actions-panel">
                            <h3>Quick Actions</h3>
                            <div className="actions-buttons">
                                <button onClick={() => navigate('/dashboard/projects')} className="btn-primary">
                                    + Add New Project
                                </button>
                                <button onClick={() => navigate('/dashboard/content')} className="btn-outline">
                                    Edit Homepage Text
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;