import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Building, TrendingUp, CreditCard, Landmark, Plus, Edit2, Trash2 } from 'lucide-react';
import HistoryModal from './HistoryModal';
import AssetModal from './AssetModal';
import { updateCategory, getFinancialData } from '../services/api';

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

const FinancialList = ({ title, items, type, onUpdate }) => {
    const [selectedContext, setSelectedContext] = useState({ item: null, categoryId: null });
    const [assetModal, setAssetModal] = useState({ isOpen: false, type: null, categoryId: null, categoryName: null, item: null });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const handleClose = () => {
        setSelectedContext({ item: null, categoryId: null });
    };

    const handleAddClick = (e, category) => {
        e.stopPropagation();
        setAssetModal({
            isOpen: true,
            type: 'add',
            categoryId: category.id,
            categoryName: category.label,
            item: null
        });
    };

    const handleEditClick = (e, item, category) => {
        e.stopPropagation();
        setAssetModal({
            isOpen: true,
            type: 'edit',
            categoryId: category.id,
            categoryName: category.label,
            item: item
        });
    };

    const handleDeleteClick = async (e, item, categoryId) => {
        e.stopPropagation();
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.name}"?`)) {
            try {
                const data = await getFinancialData();
                const categoryList = type === 'assets' ? data.assets : data.liabilities;
                const currentCategory = categoryList.find(c => c.id === categoryId);

                if (currentCategory) {
                    const updatedItems = currentCategory.items.filter(i => i.id !== item.id);
                    const newAmount = updatedItems.reduce((sum, i) => sum + i.amount, 0);

                    const updatedCategory = {
                        ...currentCategory,
                        amount: newAmount,
                        items: updatedItems
                    };

                    await updateCategory(type, updatedCategory);
                    if (onUpdate) onUpdate();
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Error al eliminar el elemento');
            }
        }
    };

    const handleSaveAsset = async (formData) => {
        try {
            const data = await getFinancialData();
            const categoryList = type === 'assets' ? data.assets : data.liabilities;
            const currentCategory = categoryList.find(c => c.id === assetModal.categoryId);

            if (!currentCategory) return;

            let updatedItems;

            if (assetModal.type === 'edit') {
                // Update existing item
                updatedItems = currentCategory.items.map(i =>
                    i.id === assetModal.item.id
                        ? { ...i, name: formData.name }
                        : i
                );
            } else {
                // Add new item
                const newItem = {
                    id: crypto.randomUUID(),
                    name: formData.name,
                    amount: formData.amount,
                    lastUpdated: new Date().toISOString().split('T')[0],
                    history: [
                        { date: formData.date, amount: formData.amount }
                    ]
                };
                updatedItems = [...currentCategory.items, newItem];
            }

            const newCategoryAmount = updatedItems.reduce((sum, i) => sum + i.amount, 0);

            const updatedCategory = {
                ...currentCategory,
                amount: newCategoryAmount,
                items: updatedItems
            };

            await updateCategory(type, updatedCategory);
            if (onUpdate) onUpdate();
            setAssetModal({ isOpen: false, type: null, categoryId: null, categoryName: null, item: null });

        } catch (error) {
            console.error('Error saving asset:', error);
            alert('Error al guardar');
        }
    };

    return (
        <>
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
                                className="bg-white/5 rounded-xl p-4 border border-white/5"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <div className={`p-2 rounded-lg ${type === 'assets' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <h4 className="font-medium text-white text-lg">{category.label || category.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white font-semibold">
                                            {formatCurrency(category.amount)}
                                        </span>
                                        <button
                                            onClick={(e) => handleAddClick(e, category)}
                                            className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                                            title="Añadir elemento"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {category.items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedContext({ item, categoryId: category.id })}
                                            className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors"
                                        >
                                            <span className="text-gray-300 text-sm">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-white font-medium text-sm">
                                                        {formatCurrency(item.amount)}
                                                    </p>
                                                    {item.lastUpdated && (
                                                        <p className="text-[10px] text-gray-500">
                                                            {new Date(item.lastUpdated).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => handleEditClick(e, item, category)}
                                                        className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                        title="Editar nombre"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, item, category.id)}
                                                        className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <HistoryModal
                isOpen={!!selectedContext.item}
                onClose={handleClose}
                item={selectedContext.item}
                categoryId={selectedContext.categoryId}
                type={type}
                onUpdate={onUpdate}
            />

            <AssetModal
                isOpen={assetModal.isOpen}
                onClose={() => setAssetModal({ ...assetModal, isOpen: false })}
                onSave={handleSaveAsset}
                initialData={assetModal.item}
                type={type}
                categoryName={assetModal.categoryName}
            />
        </>
    );
};


export default FinancialList;
