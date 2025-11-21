import React, { useState } from 'react';
import { Edit2, Check, X, Trash2, Plus, RefreshCw, PiggyBank, ShoppingCart } from 'lucide-react';

const BudgetCategoryList = ({ categories, onUpdateTarget, onAddCategory, onDeleteCategory, onEditCategoryName }) => {
    const [editingTargetId, setEditingTargetId] = useState(null);
    const [editTargetValue, setEditTargetValue] = useState('');

    const [editingNameId, setEditingNameId] = useState(null);
    const [editNameValue, setEditNameValue] = useState('');

    // Target Editing
    const handleEditTargetClick = (category) => {
        setEditingTargetId(category.id);
        setEditTargetValue(category.target);
    };

    const handleSaveTarget = (id) => {
        onUpdateTarget(id, parseFloat(editTargetValue));
        setEditingTargetId(null);
    };

    const handleCancelTarget = () => {
        setEditingTargetId(null);
        setEditTargetValue('');
    };

    // Name Editing
    const handleEditNameClick = (category) => {
        setEditingNameId(category.id);
        setEditNameValue(category.name);
    };

    const handleSaveName = (id) => {
        if (editNameValue.trim()) {
            onEditCategoryName(id, editNameValue.trim());
        }
        setEditingNameId(null);
    };

    const handleCancelName = () => {
        setEditingNameId(null);
        setEditNameValue('');
    };

    const renderCategoryGroup = (title, icon, type, groupCategories) => {
        const totalTarget = groupCategories.reduce((acc, cat) => acc + cat.target, 0);

        return (
            <div className="mb-8 last:mb-0">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-800 text-gray-400">
                            {icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="text-sm text-gray-400 block">Total</span>
                            <span className="text-lg font-bold text-accent-primary">{totalTarget}€</span>
                        </div>
                        <button
                            onClick={() => onAddCategory(type)}
                            className="p-2 rounded-lg bg-gray-800 text-green-400 hover:bg-gray-700 transition-colors"
                            title="Añadir Categoría"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
                <div className="space-y-6">
                    {groupCategories.map((category) => {
                        const percentage = category.target > 0 ? Math.min((category.spent / category.target) * 100, 100) : 0;
                        const isOverBudget = category.spent > category.target;

                        return (
                            <div key={category.id} className="relative group">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>

                                            {editingNameId === category.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editNameValue}
                                                        onChange={(e) => setEditNameValue(e.target.value)}
                                                        className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-white focus:outline-none focus:border-accent-primary text-sm"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveName(category.id)} className="text-green-400 hover:text-green-300">
                                                        <Check size={14} />
                                                    </button>
                                                    <button onClick={handleCancelName} className="text-red-400 hover:text-red-300">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 group/name">
                                                    <h3 className="font-medium text-white">{category.name}</h3>
                                                    <button
                                                        onClick={() => handleEditNameClick(category)}
                                                        className="text-gray-500 hover:text-accent-primary opacity-0 group-hover/name:opacity-100 transition-opacity"
                                                    >
                                                        <Edit2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Gastado: <span className={isOverBudget ? 'text-red-400' : 'text-gray-300'}>{category.spent}€</span>
                                        </p>
                                    </div>

                                    <div className="flex items-end gap-4">
                                        {/* Target Editing */}
                                        <div className="text-right">
                                            {editingTargetId === category.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editTargetValue}
                                                        onChange={(e) => setEditTargetValue(e.target.value)}
                                                        className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-right focus:outline-none focus:border-accent-primary"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveTarget(category.id)} className="text-green-400 hover:text-green-300">
                                                        <Check size={18} />
                                                    </button>
                                                    <button onClick={handleCancelTarget} className="text-red-400 hover:text-red-300">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 group/target">
                                                    <p className="text-lg font-bold text-white">{category.target}€</p>
                                                    <button
                                                        onClick={() => handleEditTargetClick(category)}
                                                        className="text-gray-500 hover:text-accent-primary opacity-0 group-hover/target:opacity-100 transition-opacity"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => onDeleteCategory(category.id)}
                                            className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1"
                                            title="Eliminar Categoría"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : ''}`}
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: isOverBudget ? undefined : category.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const recurrent = categories.filter(c => c.type === 'recurrent');
    const savings = categories.filter(c => c.type === 'savings');
    const variable = categories.filter(c => c.type === 'variable');

    return (
        <div className="glass-panel p-6">
            {renderCategoryGroup('Gastos Recurrentes', <RefreshCw size={20} />, 'recurrent', recurrent)}
            {renderCategoryGroup('Ahorro e Inversión', <PiggyBank size={20} />, 'savings', savings)}
            {renderCategoryGroup('Gastos Variables', <ShoppingCart size={20} />, 'variable', variable)}
        </div>
    );
};

export default BudgetCategoryList;
