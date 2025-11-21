import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, AlertCircle, Edit2, Check, X, Target } from 'lucide-react';

const BudgetSummary = ({ income, categories, expenses, onUpdateIncome, onBudgetClick }) => {
    const [isEditingIncome, setIsEditingIncome] = useState(false);
    const [incomeValue, setIncomeValue] = useState(income);

    const totalBudgeted = categories.reduce((acc, cat) => acc + cat.target, 0);
    const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const leftToBudget = income - totalBudgeted;
    const isZeroBased = leftToBudget === 0;

    const handleSaveIncome = () => {
        onUpdateIncome(parseFloat(incomeValue));
        setIsEditingIncome(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-panel p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                    <DollarSign size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-gray-400 text-sm">Ingresos Esperados</p>
                    {isEditingIncome ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={incomeValue}
                                onChange={(e) => setIncomeValue(e.target.value)}
                                className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:border-accent-primary"
                                autoFocus
                            />
                            <button onClick={handleSaveIncome} className="text-green-400 hover:text-green-300">
                                <Check size={18} />
                            </button>
                            <button onClick={() => setIsEditingIncome(false)} className="text-red-400 hover:text-red-300">
                                <X size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <p className="text-2xl font-bold text-white">{income.toLocaleString()}€</p>
                            <button
                                onClick={() => {
                                    setIsEditingIncome(true);
                                    setIncomeValue(income);
                                }}
                                className="text-gray-500 hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Budgeted Card */}
            <div
                className="glass-panel p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]"
                onClick={onBudgetClick}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={48} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        <Target size={20} />
                    </div>
                    <h3 className="text-gray-400 font-medium">Presupuestado</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                    {totalBudgeted.toLocaleString()}€
                </p>
                <p className="text-sm text-gray-400">
                    {((totalBudgeted / income) * 100).toFixed(1)}% de los ingresos
                </p>
            </div>

            <div className="glass-panel p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-red-500/20 text-red-400">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Gastado</p>
                    <p className="text-2xl font-bold text-white">{totalSpent.toLocaleString()}€</p>
                </div>
            </div>

            <div className={`glass-panel p-6 flex items-center space-x-4 border ${isZeroBased ? 'border-green-500/50' : 'border-yellow-500/50'}`}>
                <div className={`p-3 rounded-full ${isZeroBased ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {isZeroBased ? <DollarSign size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Por Asignar</p>
                    <p className={`text-2xl font-bold ${isZeroBased ? 'text-green-400' : 'text-yellow-400'}`}>
                        {leftToBudget.toLocaleString()}€
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BudgetSummary;
