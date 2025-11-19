import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Building, TrendingUp, CreditCard, Landmark } from 'lucide-react';

const getIcon = (type) => {
    switch (type) {
        case 'liquid': return Wallet;
        case 'property': return Building;
        case 'investment': return TrendingUp;
        case 'short-term': return CreditCard;
        case 'long-term': return Landmark;
        default: return Wallet;
    }
};

const FinancialList = ({ title, items, type }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="glass-panel p-6 h-full">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <span className={type === 'assets' ? 'text-emerald-400' : 'text-red-400'}>
                    {type === 'assets' ? 'Lo que tengo' : 'Lo que debo'}
                </span>
                <span className="text-gray-500 text-sm font-normal">({title})</span>
            </h3>

            <div className="space-y-4">
                {items.map((category, index) => {
                    const Icon = getIcon(category.type);
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={category.id}
                            className="glass-card p-5"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-2.5 rounded-xl ${type === 'assets' ? 'bg-violet-500/10 text-violet-400' : 'bg-pink-500/10 text-pink-400'}`}>
                                    <Icon size={22} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-white text-lg">{category.label}</h4>
                                    <p className="text-sm text-gray-400">{formatCurrency(category.amount)}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pl-14 border-l border-white/5 ml-5">
                                {category.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm group cursor-default">
                                        <span className="text-gray-400 group-hover:text-white transition-colors duration-200">{item.name}</span>
                                        <span className="font-medium text-white/80 group-hover:text-white transition-colors duration-200">{formatCurrency(item.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default FinancialList;
