// src/components/premium/PremiumFeatureGate.js
import React from 'react';

const PremiumFeatureGate = ({ 
    featureName, 
    description, 
    upgradeInfo, 
    onUpgrade, 
    previewComponent 
}) => {
    return (
        <div className="premium-gate bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 rounded-xl text-center">
            <div className="premium-icon mb-6">
                <span className="text-6xl">🔒</span>
                <span className="text-4xl ml-2">👑</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-4">{featureName}</h3>
            <p className="text-lg mb-6 opacity-90">{description}</p>
            
            {previewComponent && (
                <div className="preview-section mb-6">
                    <h4 className="text-lg font-semibold mb-4">Preview:</h4>
                    <div className="relative bg-white bg-opacity-10 p-4 rounded-lg">
                        {previewComponent}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <button 
                                onClick={onUpgrade} 
                                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
                            >
                                🔓 Unlock Full Feature
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="upgrade-info bg-white bg-opacity-10 p-4 rounded-lg">
                <p className="mb-2">Available in <strong>{upgradeInfo?.name}</strong></p>
                <p className="text-2xl font-bold mb-4">${upgradeInfo?.price}/month</p>
                <button 
                    onClick={onUpgrade} 
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-lg font-bold hover:from-green-500 hover:to-green-700 transition"
                >
                    Upgrade to {upgradeInfo?.name}
                </button>
            </div>
        </div>
    );
};

export default PremiumFeatureGate;