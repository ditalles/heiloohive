// src/config/subscriptionTiers.js
export const SUBSCRIPTION_TIERS = {
    free: {
        name: 'Free',
        price: 0,
        features: [
            'basic_monitoring',
            'simple_alerts',
            'single_hive'
        ],
        limits: {
            hives: 1,
            dataRetention: 30, // days
            alertTypes: ['basic']
        }
    },
    hobbyist: {
        name: 'Hobbyist',
        price: 5, // per month
        features: [
            'basic_monitoring',
            'advanced_alerts',
            'seasonal_calendar',
            'data_export',
            'multiple_hives'
        ],
        limits: {
            hives: 5,
            dataRetention: 365,
            alertTypes: ['basic', 'seasonal', 'weather']
        }
    },
    professional: {
        name: 'Professional', 
        price: 15,
        features: [
            'basic_monitoring',
            'advanced_alerts',
            'seasonal_calendar',
            'smart_recommendations',
            'data_export',
            'api_access',
            'unlimited_hives',
            'varroa_tracking',
            'inspection_logs'
        ],
        limits: {
            hives: Infinity,
            dataRetention: Infinity,
            alertTypes: ['all']
        }
    }
};

export const FEATURE_FLAGS = {
    ENABLE_PREMIUM_CALENDAR: false, // Toggle when ready
    ENABLE_SUBSCRIPTION_UI: false,
    ENABLE_PAYMENT_PROCESSING: false
};