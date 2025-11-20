import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ title, amount, type, icon: Icon, percentage }) => {
    const isPositive = type === 'asset' || type === 'net-worth';

    // Determine if the change is "good"
    // For Assets/Net Worth: Positive % is good (Green), Negative % is bad (Red)
    // For Liabilities: Positive % is bad (Red), Negative % is good (Green)
    const isGoodChange = isPositive ? percentage >= 0 : percentage <= 0;

    // Color for the percentage text/icon
    const trendColor = isGoodChange ? 'text-emerald-400' : 'text-red-400';
    const trendBg = isGoodChange ? 'bg-emerald-500/10' : 'bg-red-500/10';
    const TrendIcon = percentage >= 0 ? TrendingUp : TrendingDown;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-panel p-6 flex flex-col justify-between h-full relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                {Icon && <Icon size={120} />}
            </div>

            <div className="z-10 relative">
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold tracking-tight ${type === 'net-worth' ? 'text-gradient' : 'text-white'}`}>
                        {formatCurrency(amount)}
                    </span>
                </div>
            </div>

            <div className="mt-6 z-10 flex items-center gap-2">
                {percentage !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trendBg} ${trendColor}`}>
                        <TrendIcon size={14} />
                        <span className="text-xs font-bold">
                            {Math.abs(percentage).toFixed(1)}% YTD
                        </span>
                    </div>
                )}
                <span className="text-xs text-gray-400 font-medium ml-1">
                    {isPositive ? 'Balance positivo' : 'Deuda total'}
                </span>
            </div>
        </motion.div>
    );
};

export default SummaryCard;
