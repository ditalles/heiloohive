// src/hooks/useFeatureAccess.js
import { useState, useEffect } from 'react';
import { SUBSCRIPTION_TIERS } from '../config/subscriptionTiers';

export const useFeatureAccess = (userSubscription = { tier: 'free' }) => {
    const checkFeatureAccess = (featureName) => {
        const userTier = userSubscription.tier || 'free';
        const tierFeatures = SUBSCRIPTION_TIERS[userTier]?.features || [];
        return tierFeatures.includes(featureName);
    };

    const requiresUpgrade = (featureName) => {
        if (checkFeatureAccess(featureName)) return null;
        
        // Find the minimum tier that includes this feature
        for (const [tierName, tierConfig] of Object.entries(SUBSCRIPTION_TIERS)) {
            if (tierConfig.features.includes(featureName)) {
                return {
                    requiredTier: tierName,
                    price: tierConfig.price,
                    name: tierConfig.name
                };
            }
        }
        return null;
    };

    const getUserLimits = () => {
        const userTier = userSubscription.tier || 'free';
        return SUBSCRIPTION_TIERS[userTier]?.limits || SUBSCRIPTION_TIERS.free.limits;
    };

    return { 
        checkFeatureAccess, 
        requiresUpgrade, 
        getUserLimits,
        currentTier: userSubscription.tier || 'free'
    };
};