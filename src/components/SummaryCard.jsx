import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ title, amount, type, icon: Icon }) => {
    const isPositive = type === 'asset' || type === 'net-worth';

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
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
                <div className={`p-1.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <span className="text-xs text-gray-400 font-medium">
                    {isPositive ? 'Balance positivo' : 'Deuda total'}
                </span>
            </div>
        </motion.div>
    );
};

export default SummaryCard;
