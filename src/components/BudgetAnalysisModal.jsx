import React from 'react';
import { X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const BudgetAnalysisModal = ({ isOpen, onClose, categories }) => {
    if (!isOpen) return null;

    // 1. Data for Main Allocation (Type)
    const typeData = [
        { name: 'Recurrentes', value: categories.filter(c => c.type === 'recurrent').reduce((acc, c) => acc + c.target, 0), color: '#10B981' },
        { name: 'Variables', value: categories.filter(c => c.type === 'variable').reduce((acc, c) => acc + c.target, 0), color: '#F59E0B' },
        { name: 'Ahorro', value: categories.filter(c => c.type === 'savings').reduce((acc, c) => acc + c.target, 0), color: '#8B5CF6' },
    ].filter(d => d.value > 0);

    // 2. Data for Detailed Allocation (Categories per Type)
    const recurrentData = categories.filter(c => c.type === 'recurrent' && c.target > 0);
    const variableData = categories.filter(c => c.type === 'variable' && c.target > 0);
    const savingsData = categories.filter(c => c.type === 'savings' && c.target > 0);

    // 3. Data for Budget vs Spent
    const comparisonData = [
        {
            name: 'Recurrentes',
            Presupuestado: categories.filter(c => c.type === 'recurrent').reduce((acc, c) => acc + c.target, 0),
            Gastado: categories.filter(c => c.type === 'recurrent').reduce((acc, c) => acc + c.spent, 0),
        },
        {
            name: 'Variables',
            Presupuestado: categories.filter(c => c.type === 'variable').reduce((acc, c) => acc + c.target, 0),
            Gastado: categories.filter(c => c.type === 'variable').reduce((acc, c) => acc + c.spent, 0),
        },
        {
            name: 'Ahorro',
            Presupuestado: categories.filter(c => c.type === 'savings').reduce((acc, c) => acc + c.target, 0),
            Gastado: categories.filter(c => c.type === 'savings').reduce((acc, c) => acc + c.spent, 0),
        },
    ];

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0F172A] border border-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-[#0F172A] z-10">
                    <h2 className="text-2xl font-bold text-white">Análisis de Presupuesto</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Main Allocation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 text-center">Distribución por Tipo</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={typeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {typeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => `${value.toLocaleString()}€`}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 text-center">Presupuestado vs Gastado</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={comparisonData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                            cursor={{ fill: '#334155', opacity: 0.2 }}
                                        />
                                        <Legend />
                                        <Bar dataKey="Presupuestado" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Gastado" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Allocations */}
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">Desglose por Categorías</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Recurrent */}
                        {recurrentData.length > 0 && (
                            <div className="glass-panel p-4">
                                <h4 className="text-md font-medium text-green-400 mb-2 text-center">Recurrentes</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={recurrentData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="target"
                                            >
                                                {recurrentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                                formatter={(value) => `${value.toLocaleString()}€`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Variable */}
                        {variableData.length > 0 && (
                            <div className="glass-panel p-4">
                                <h4 className="text-md font-medium text-yellow-400 mb-2 text-center">Variables</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={variableData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="target"
                                            >
                                                {variableData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                                formatter={(value) => `${value.toLocaleString()}€`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Savings */}
                        {savingsData.length > 0 && (
                            <div className="glass-panel p-4">
                                <h4 className="text-md font-medium text-purple-400 mb-2 text-center">Ahorro</h4>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={savingsData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="target"
                                            >
                                                {savingsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                                formatter={(value) => `${value.toLocaleString()}€`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetAnalysisModal;
