import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, TrendingUp } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-white/10 text-accent-primary border-accent-primary/30'
            : 'text-gray-400 hover:bg-white/5 border-transparent';
    };

    return (
        <nav className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 min-h-screen p-6 hidden md:block">
            <div className="mb-8 flex items-center gap-3">
                <img src="/src/assets/logo.svg" alt="Logo" className="w-10 h-10" />
                <h1 className="text-2xl font-bold text-gradient">Finance App</h1>
            </div>
            <div className="space-y-2">
                <Link
                    to="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${isActive('/')}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                    to="/budget"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${isActive('/budget')}`}
                >
                    <Calculator size={20} />
                    <span className="font-medium">Monthly Budget</span>
                </Link>
                <Link
                    to="/stocks"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${isActive('/stocks')}`}
                >
                    <TrendingUp size={20} />
                    <span className="font-medium">Stocks Tracking</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navigation;

