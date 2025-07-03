import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Enhanced Design System
const colors = {
  primary: { 50: '#f0f9ff', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
  secondary: { 50: '#f8fafc', 500: '#64748b', 600: '#475569', 700: '#334155' },
  accent: { 50: '#fefce8', 500: '#eab308', 600: '#ca8a04', 700: '#a16207' },
  success: { 50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  warning: { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
  danger: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' }
};

// Firebase Context (enhanced)
const FirebaseContext = createContext(null);

// Enhanced Notification System
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
};

// Enhanced Toast Component
const Toast = ({ notification, onClose }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 shadow-lg ${typeStyles[notification.type]} transform transition-all duration-300 ease-in-out animate-slide-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{icons[notification.type]}</span>
          <div>
            <h4 className="font-semibold">{notification.title}</h4>
            <p className="text-sm">{notification.message}</p>
          </div>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Enhanced Loading Skeleton Components
const LoadingHiveCard = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="mt-4 h-10 bg-gray-200 rounded w-full"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

// Enhanced Connection Status Component
const ConnectionStatus = ({ status, lastUpdate, onRetry, debugInfo }) => {
  const [showDebug, setShowDebug] = useState(false);
  
  const statusConfig = {
    thingspeak: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '🟢',
      title: 'Live Data Connected',
      description: 'Receiving real-time data from your ThingSpeak sensors'
    },
    demo: {
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: '🔵',
      title: 'Demo Mode',
      description: 'Displaying simulated data - configure ThingSpeak in settings for live monitoring'
    },
    fallback: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '🟡',
      title: 'Fallback Data',
      description: 'ThingSpeak connection failed - using cached data'
    },
    error: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '🔴',
      title: 'Connection Error',
      description: 'Unable to fetch data - CORS or network issue detected'
    }
  };

  const config = statusConfig[status] || statusConfig.demo;

  return (
    <div className={`p-4 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor} mb-6 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl animate-pulse">{config.icon}</span>
          <div>
            <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-600 mt-1">
                💡 Tip: ThingSpeak requires CORS proxy for browser access. Using fallback data.
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {(status === 'fallback' || status === 'error') && onRetry && (
            <button
              onClick={onRetry}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all duration-200 hover:scale-105"
            >
              Retry
            </button>
          )}
          {debugInfo && (
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-all duration-200 hover:scale-105"
            >
              {showDebug ? 'Hide' : 'Debug'}
            </button>
          )}
        </div>
      </div>
      
      {showDebug && debugInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg border">
          <h4 className="font-semibold text-gray-700 mb-2">Debug Information</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Channel ID:</strong> {debugInfo.channelId || 'Not set'}</div>
            <div><strong>API Key:</strong> {debugInfo.readApiKey ? '*'.repeat(debugInfo.readApiKey.length) : 'Not set'}</div>
            <div><strong>Last Error:</strong> {debugInfo.lastError || 'None'}</div>
            <div><strong>Attempt Count:</strong> {debugInfo.attemptCount || 0}</div>
            <div><strong>Data Points:</strong> {debugInfo.dataPoints || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Empty State Component
const EmptyState = ({ icon, title, description, actionText, onAction }) => (
  <div className="text-center py-12 px-4 bg-white rounded-xl shadow-lg">
    <div className="text-6xl mb-4 animate-bounce">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
      >
        {actionText}
      </button>
    )}
  </div>
);

// Enhanced Button Component
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105";
  
  const variants = {
    primary: "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500 shadow-sm hover:shadow-md",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 shadow-sm hover:shadow-md",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-gray-500 hover:shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : children}
    </button>
  );
};

// Enhanced Alert Badge
const AlertBadge = ({ count, className = "" }) => {
  if (count === 0) return null;
  
  return (
    <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

// Utility function to generate random data for demonstration
const generateSimulatedData = (days = 30) => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.unshift({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: date.getTime(),
      weight: parseFloat((Math.random() * 10 + 30).toFixed(2)),
      broodTemperature: parseFloat((Math.random() * 5 + 32).toFixed(2)),
      insideTemperature: parseFloat((Math.random() * 5 + 28).toFixed(2)),
      outsideTemperature: parseFloat((Math.random() * 15 + 10).toFixed(2)),
      batteryVoltage: parseFloat((Math.random() * 0.5 + 3.5).toFixed(2)),
      humidity: parseFloat((Math.random() * 20 + 60).toFixed(2)),
      dhtTemperature: parseFloat((Math.random() * 5 + 25).toFixed(2)),
      gpsValid: Math.random() > 0.5 ? 1 : 0,
    });
  }
  return data;
};

// Enhanced analytics functions
const calculateSwarmRisk = (data) => {
  if (!data || data.length < 7) return { risk: 'Unknown', score: 0, indicators: ['Not enough data for accurate assessment.'] };
  
  const recent = data.slice(-7);
  const indicators = [];
  let riskScore = 0;
  
  // Check for rapid weight loss
  const weightChange = recent[recent.length - 1].weight - recent[0].weight;
  if (weightChange < -2) {
    indicators.push('Significant recent weight loss detected.');
    riskScore += 30;
  }
  
  // Check for brood temperature instability
  const broodTemps = recent.map(d => d.broodTemperature).filter(t => typeof t === 'number' && !isNaN(t));
  if (broodTemps.length > 1) {
    const tempRange = Math.max(...broodTemps) - Math.min(...broodTemps);
    if (tempRange > 3) {
      indicators.push('High brood temperature variance detected.');
      riskScore += 20;
    }
  }
  
  // Check for high activity
  const dailyWeightChanges = recent.slice(1).map((curr, idx) => 
    Math.abs(curr.weight - recent[idx].weight)
  ).filter(v => !isNaN(v));

  const avgDailyWeightChange = dailyWeightChanges.length > 0 ? dailyWeightChanges.reduce((a, b) => a + b, 0) / dailyWeightChanges.length : 0;
  
  if (avgDailyWeightChange > 0.5) {
    indicators.push('Elevated daily weight fluctuations, indicating high activity.');
    riskScore += 15;
  }
  
  let risk = 'Low';
  if (riskScore > 40) risk = 'High';
  else if (riskScore > 20) risk = 'Medium';
  
  return { risk, score: riskScore, indicators: indicators.length > 0 ? indicators : ['No immediate swarm risk indicators detected.'] };
};

const calculateColonyHealth = (data) => {
  if (!data || data.length === 0) return { score: 'N/A', status: 'Unknown', factors: ['No data to assess health.'] };
  
  const recent = data.slice(-14);
  const factors = [];
  let healthScore = 100;
  
  // Brood Temperature stability
  const broodTemps = recent.map(d => d.broodTemperature).filter(t => typeof t === 'number' && !isNaN(t));
  if (broodTemps.length > 0) {
    const avgBroodTemp = broodTemps.reduce((sum, t) => sum + t, 0) / broodTemps.length;
    if (avgBroodTemp < 32 || avgBroodTemp > 36) {
      factors.push(`Brood temperature (${avgBroodTemp.toFixed(1)}°C) is outside optimal range (32-36°C).`);
      healthScore -= 20;
    } else {
      factors.push(`Brood temperature (${avgBroodTemp.toFixed(1)}°C) is optimal.`);
    }
  }
  
  // Weight trend
  if (recent.length >= 7) {
    const firstWeekWeights = recent.slice(0, Math.floor(recent.length / 2)).map(d => d.weight).filter(w => typeof w === 'number' && !isNaN(w));
    const secondWeekWeights = recent.slice(Math.floor(recent.length / 2)).map(d => d.weight).filter(w => typeof w === 'number' && !isNaN(w));

    if (firstWeekWeights.length > 0 && secondWeekWeights.length > 0) {
      const avgFirstWeekWeight = firstWeekWeights.reduce((s, d) => s + d, 0) / firstWeekWeights.length;
      const avgSecondWeekWeight = secondWeekWeights.reduce((s, d) => s + d, 0) / secondWeekWeights.length;
      const weightTrend = avgSecondWeekWeight - avgFirstWeekWeight;
      
      if (weightTrend > 0.5) {
        factors.push('Positive weight gain trend detected.');
      } else if (weightTrend < -1) {
        factors.push('Concerning weight loss trend detected.');
        healthScore -= 15;
      } else {
        factors.push('Stable weight trend.');
      }
    }
  }
  
  // Humidity levels
  const humidityLevels = recent.map(d => d.humidity).filter(h => typeof h === 'number' && !isNaN(h));
  if (humidityLevels.length > 0) {
    const avgHumidity = humidityLevels.reduce((sum, h) => sum + h, 0) / humidityLevels.length;
    if (avgHumidity < 50 || avgHumidity > 70) {
      factors.push(`Humidity (${avgHumidity.toFixed(1)}%) is outside optimal range (50-70%).`);
      healthScore -= 10;
    } else {
      factors.push(`Humidity (${avgHumidity.toFixed(1)}%) is optimal.`);
    }
  }

  // Battery Voltage
  const batteryVoltages = recent.map(d => d.batteryVoltage).filter(v => typeof v === 'number' && !isNaN(v));
  if (batteryVoltages.length > 0) {
    const minBattery = Math.min(...batteryVoltages);
    if (minBattery < 3.6) {
      factors.push(`Low battery voltage detected (${minBattery}V). Consider charging.`);
      healthScore -= 5;
    }
  }

  let status = 'Excellent';
  if (healthScore < 60) status = 'Poor';
  else if (healthScore < 75) status = 'Fair';
  else if (healthScore < 90) status = 'Good';
  
  return { score: Math.max(0, healthScore).toFixed(0), status, factors };
};

const calculateHoneyFlow = (data) => {
  if (!data || data.length < 2) return { periods: [], total: 'N/A', average: 'N/A', peak: 'N/A' };
  
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const periods = [];
  
  const weeklyDataMap = new Map();
  sortedData.forEach(item => {
    const date = new Date(item.timestamp);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(date.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    const weekKey = weekStart.toISOString().split('T')[0];
    if (!weeklyDataMap.has(weekKey)) {
      weeklyDataMap.set(weekKey, []);
    }
    weeklyDataMap.get(weekKey).push(item);
  });

  let totalOverallGain = 0;
  let maxPeakGain = 0;

  Array.from(weeklyDataMap.keys()).sort().forEach(weekKey => {
    const weekData = weeklyDataMap.get(weekKey).sort((a, b) => a.timestamp - b.timestamp);
    if (weekData.length > 1) {
      const startWeight = weekData[0].weight;
      const endWeight = weekData[weekData.length - 1].weight;
      
      const gain = (endWeight - startWeight);
      const durationDays = (weekData[weekData.length - 1].timestamp - weekData[0].timestamp) / (24 * 60 * 60 * 1000);
      const efficiency = durationDays > 0 ? (gain / durationDays) : 0;

      periods.push({
        period: weekKey,
        gain: parseFloat(gain.toFixed(2)),
        efficiency: parseFloat(efficiency.toFixed(3)),
      });
      totalOverallGain += gain;
      if (gain > maxPeakGain) {
        maxPeakGain = gain;
      }
    }
  });
  
  const averageGain = periods.length > 0 ? (totalOverallGain / periods.length).toFixed(2) : 'N/A';
  
  return { periods, total: parseFloat(totalOverallGain.toFixed(2)), average: averageGain, peak: parseFloat(maxPeakGain.toFixed(2)) };
};

// Enhanced fetch function with better error handling and CORS support
const fetchThingSpeakData = async (channelId, readApiKey, numResults = 100) => {
  // Check for demo mode
  if (!channelId || !readApiKey || channelId === '123456' || readApiKey === 'demo_api_key') {
    console.warn("Using simulated data: ThingSpeak Channel ID or Read API Key is missing or default.");
    return { data: generateSimulatedData(numResults === 1 ? 1 : 30), source: 'demo' };
  }

  try {
    // Use direct connection to ThingSpeak API
    const thingspeakUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=${numResults}`;
    
    console.log(`Fetching ThingSpeak data from channel ${channelId}...`);
    
    const response = await fetch(thingspeakUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ThingSpeak API error: ${response.status} - ${errorText}`);
      throw new Error(`ThingSpeak API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('ThingSpeak response:', data);
    
    if (!data || !data.feeds || data.feeds.length === 0) {
      console.warn("ThingSpeak returned no feeds. Using simulated data.");
      return { data: generateSimulatedData(numResults === 1 ? 1 : 30), source: 'fallback' };
    }

    const processedData = data.feeds.map(feed => ({
      date: new Date(feed.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(feed.created_at).getTime(),
      weight: parseFloat(feed.field1) || 0,
      broodTemperature: parseFloat(feed.field2) || 0,
      insideTemperature: parseFloat(feed.field3) || 0,
      outsideTemperature: parseFloat(feed.field4) || 0,
      batteryVoltage: parseFloat(feed.field5) || 0,
      humidity: parseFloat(feed.field6) || 0,
      dhtTemperature: parseFloat(feed.field7) || 0,
      gpsValid: feed.field8 === '1'
    })).filter(item => item.timestamp && !isNaN(item.timestamp));

    console.log(`Successfully processed ${processedData.length} ThingSpeak data points`);
    return { data: processedData, source: 'thingspeak' };
  } catch (error) {
    console.error("Failed to fetch data from ThingSpeak:", error);
    return { data: generateSimulatedData(numResults === 1 ? 1 : 30), source: 'error' };
  }
};

// Enhanced Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('demo_user');
  const [channelId, setChannelId] = useState('123456');
  const [readApiKey, setReadApiKey] = useState('demo_api_key');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleLogin = async () => {
    if (!username) {
      addNotification({
        type: 'error',
        title: 'Login Error',
        message: 'Please enter a username.'
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onLogin(username, channelId, readApiKey);
    
    addNotification({
      type: 'success',
      title: 'Welcome!',
      message: `Successfully logged in as ${username}`
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🐝</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">HeilooHive</h2>
          <p className="text-gray-600">Professional Beehive Monitoring</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label htmlFor="channelId" className="block text-gray-700 text-sm font-semibold mb-2">
              ThingSpeak Channel ID
            </label>
            <input
              type="text"
              id="channelId"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="e.g., 123456"
            />
          </div>
          
          <div>
            <label htmlFor="readApiKey" className="block text-gray-700 text-sm font-semibold mb-2">
              ThingSpeak Read API Key
            </label>
            <input
              type="password"
              id="readApiKey"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={readApiKey}
              onChange={(e) => setReadApiKey(e.target.value)}
              placeholder="Enter your Read API Key"
            />
            <p className="text-gray-500 text-xs mt-1 italic">
              Leave as default for demo data, or enter your credentials for live monitoring
            </p>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-gray-700 text-sm">
              Remember me
            </label>
          </div>
          
          <Button
            onClick={handleLogin}
            loading={isLoading}
            className="w-full"
            size="lg"
            variant="primary"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Dashboard Component
const Dashboard = ({ user, hives, onSelectHive, onLogout, alerts, onMarkAlertRead, onShowAlertsModal, appVersion }) => {
  const [latestHiveData, setLatestHiveData] = useState({});
  const [isLoadingLatestData, setIsLoadingLatestData] = useState(true);
  const [dataSource, setDataSource] = useState('demo');
  const [debugInfo, setDebugInfo] = useState({});
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchAllLatestData = async () => {
      setIsLoadingLatestData(true);
      const newLatestData = {};
      let currentDataSource = 'demo';
      let attemptCount = 0;
      let lastError = null;
      
      for (const hive of hives) {
        try {
          attemptCount++;
          console.log(`Fetching data for hive: ${hive.name}`);
          
          const result = await fetchThingSpeakData(user.channelId, user.readApiKey, 1);
          newLatestData[hive.id] = result.data.length > 0 ? result.data[0] : null;
          currentDataSource = result.source;
          
          console.log(`Data source for ${hive.name}: ${result.source}`);
          console.log(`Data points received: ${result.data.length}`);
          
        } catch (error) {
          console.error(`Error fetching latest data for hive ${hive.name}:`, error);
          lastError = error.message;
          newLatestData[hive.id] = null;
          currentDataSource = 'error';
        }
      }
      
      setLatestHiveData(newLatestData);
      setDataSource(currentDataSource);
      setDebugInfo({
        channelId: user.channelId,
        readApiKey: user.readApiKey,
        lastError,
        attemptCount,
        dataPoints: Object.values(newLatestData).filter(data => data !== null).length
      });
      setIsLoadingLatestData(false);
      
      // Show notification based on data source
      if (currentDataSource === 'thingspeak') {
        addNotification({
          type: 'success',
          title: 'Live Data Connected',
          message: 'Successfully connected to ThingSpeak sensors'
        });
      } else if (currentDataSource === 'fallback') {
        addNotification({
          type: 'warning',
          title: 'Using Fallback Data',
          message: 'Could not connect to ThingSpeak - check your settings'
        });
      } else if (currentDataSource === 'error') {
        addNotification({
          type: 'error',
          title: 'Connection Failed',
          message: 'ThingSpeak connection failed - likely CORS issue'
        });
      }
    };

    if (hives.length > 0) {
      fetchAllLatestData();
    } else {
      setIsLoadingLatestData(false);
    }
  }, [hives, user, addNotification]);

  const getLatestDataForDisplay = (hiveId) => {
    return latestHiveData[hiveId] || {};
  };

  const unreadAlertCount = alerts.filter(alert => !alert.isRead).length;

  const handleLogout = () => {
    addNotification({
      type: 'info',
      title: 'Goodbye!',
      message: 'You have been successfully logged out'
    });
    onLogout();
  };

  const handleRetryConnection = async () => {
    addNotification({
      type: 'info',
      title: 'Retrying Connection',
      message: 'Attempting to reconnect to ThingSpeak...'
    });
    
    // Set loading state
    setIsLoadingLatestData(true);
    
    // Clear previous data and debug info
    setLatestHiveData({});
    setDebugInfo({});
    
    // Retry the data fetch after a short delay
    setTimeout(async () => {
      const newLatestData = {};
      let currentDataSource = 'demo';
      let attemptCount = 0;
      let lastError = null;
      
      for (const hive of hives) {
        try {
          attemptCount++;
          console.log(`Retrying data fetch for hive: ${hive.name}`);
          
          const result = await fetchThingSpeakData(user.channelId, user.readApiKey, 1);
          newLatestData[hive.id] = result.data.length > 0 ? result.data[0] : null;
          currentDataSource = result.source;
          
          console.log(`Retry result for ${hive.name}: ${result.source}`);
          
        } catch (error) {
          console.error(`Retry error for hive ${hive.name}:`, error);
          lastError = error.message;
          newLatestData[hive.id] = null;
          currentDataSource = 'error';
        }
      }
      
      setLatestHiveData(newLatestData);
      setDataSource(currentDataSource);
      setDebugInfo({
        channelId: user.channelId,
        readApiKey: user.readApiKey,
        lastError,
        attemptCount,
        dataPoints: Object.values(newLatestData).filter(data => data !== null).length
      });
      setIsLoadingLatestData(false);
      
      // Show notification based on retry result
      if (currentDataSource === 'thingspeak') {
        addNotification({
          type: 'success',
          title: 'Connection Restored',
          message: 'Successfully reconnected to ThingSpeak!'
        });
      } else if (currentDataSource === 'fallback') {
        addNotification({
          type: 'warning',
          title: 'Retry Partial Success',
          message: 'Connection attempted but still using fallback data'
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Retry Failed',
          message: 'Still unable to connect to ThingSpeak'
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="text-3xl">🐝</div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">HeilooHive</h1>
            <p className="text-gray-600 text-sm">Professional Beehive Monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 text-sm hidden sm:block">
            Welcome, <strong>{user?.username || 'Guest'}</strong>!
          </span>
          <div className="relative">
            <Button
              onClick={onShowAlertsModal}
              variant="warning"
              size="sm"
              className="flex items-center space-x-2"
            >
              <span>🔔</span>
              <span>Alerts</span>
            </Button>
            <AlertBadge count={unreadAlertCount} />
          </div>
          <Button
            onClick={handleLogout}
            variant="danger"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </header>

      <ConnectionStatus 
        status={dataSource} 
        lastUpdate={Date.now()} 
        onRetry={handleRetryConnection}
        debugInfo={debugInfo}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Hives</h2>
        <Button
          onClick={() => onSelectHive({ id: 'settings', name: 'Settings' })}
          variant="primary"
          size="sm"
        >
          Add Hive
        </Button>
      </div>
      {isLoadingLatestData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingHiveCard />
          <LoadingHiveCard />
          <LoadingHiveCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hives.length > 0 ? (
            hives.map((hive) => {
              const latestData = getLatestDataForDisplay(hive.id);
              const hasAlert = alerts.some(alert => !alert.isRead && alert.hiveId === hive.id);

              return (
                <div
                  key={hive.id}
                  className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-2 ${hasAlert ? 'border-red-500' : 'border-gray-200'}`}
                  onClick={() => onSelectHive(hive)}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    {hive.name}
                    {hasAlert && <span className="ml-2 text-red-500 text-sm">🚨 Alert!</span>}
                  </h3>
                  <div className="text-gray-700 text-sm space-y-2">
                    <p><strong>Last Update:</strong> {latestData.date || 'N/A'}</p>
                    <p><strong>Weight:</strong> {latestData.weight ? `${latestData.weight} kg` : 'N/A'}</p>
                    <p><strong>Brood Temp:</strong> {latestData.broodTemperature ? `${latestData.broodTemperature} °C` : 'N/A'}</p>
                    <p><strong>Inside Temp:</strong> {latestData.insideTemperature ? `${latestData.insideTemperature} °C` : 'N/A'}</p>
                    <p><strong>Battery:</strong> {latestData.batteryVoltage ? `${latestData.batteryVoltage} V` : 'N/A'}</p>
                    <p><strong>Humidity:</strong> {latestData.humidity ? `${latestData.humidity} %` : 'N/A'}</p>
                  </div>
                  <Button
                    onClick={(e) => { e.stopPropagation(); onSelectHive(hive); }}
                    className="mt-4 w-full"
                    variant="secondary"
                    size="md"
                  >
                    View Advanced Analytics
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon="🏡"
                title="No Hives Added Yet"
                description="It looks like you haven't added any beehives to monitor. Click the button below to get started!"
                actionText="Add Your First Hive"
                onAction={() => onSelectHive({ id: 'settings', name: 'Settings' })}
              />
            </div>
          )}
        </div>
      )}
      <div className="text-center text-gray-500 text-xs mt-6">
        App Version: {appVersion}
      </div>
    </div>
  );
};

// Advanced Hive Detail Component with Analytics
const HiveDetail = ({ hive, onBack, channelId, readApiKey }) => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedSensor, setSelectedSensor] = useState('weight');
  const [hiveData, setHiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState('demo');
  const [debugInfo, setDebugInfo] = useState({});
  const { addNotification } = useNotifications();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    let fetchedData = [];
    let currentSource = 'demo';
    let lastError = null;
    let attemptCount = 0;

    if (channelId && readApiKey && channelId !== '123456' && readApiKey !== 'demo_api_key') {
      try {
        attemptCount++;
        const result = await fetchThingSpeakData(channelId, readApiKey, 100);
        fetchedData = result.data;
        currentSource = result.source;
      } catch (error) {
        console.error("Error fetching ThingSpeak data:", error);
        lastError = error.message;
        fetchedData = generateSimulatedData(30);
        currentSource = 'error'; // Indicate a fetch error, leading to fallback
      }
    } else {
      fetchedData = generateSimulatedData(30);
      currentSource = 'demo';
    }
    
    setHiveData(fetchedData);
    setDataSource(currentSource);
    setDebugInfo({
      channelId,
      readApiKey,
      lastError,
      attemptCount,
      dataPoints: fetchedData.length
    });
    setIsLoading(false);
  }, [hive.id, channelId, readApiKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    const periodMs = {
      'today': 24 * 60 * 60 * 1000,
      '3days': 3 * 24 * 60 * 60 * 1000,
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
    }[selectedPeriod];

    if (!periodMs) return hiveData;

    const now = new Date().getTime();
    return hiveData.filter(item => (now - item.timestamp) <= periodMs);
  }, [hiveData, selectedPeriod]);

  // Advanced analytics calculations
  const swarmRisk = useMemo(() => calculateSwarmRisk(hiveData), [hiveData]);
  const honeyFlow = useMemo(() => calculateHoneyFlow(filteredData), [filteredData]);
  const colonyHealth = useMemo(() => calculateColonyHealth(hiveData), [hiveData]);

  const calculateStats = (data, sensorKey) => {
    if (!data || data.length === 0) return { min: 'N/A', max: 'N/A', avg: 'N/A' };
    const values = data.map(d => d[sensorKey]).filter(v => typeof v === 'number' && !isNaN(v) && v > 0);
    if (values.length === 0) return { min: 'N/A', max: 'N/A', avg: 'N/A' };

    const min = Math.min(...values).toFixed(2);
    const max = Math.max(...values).toFixed(2);
    const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
    return { min, max, avg };
  };

  const sensorStats = useMemo(() => calculateStats(filteredData, selectedSensor), [filteredData, selectedSensor]);

  const availableSensors = [
    { key: 'weight', name: 'Weight (kg)', color: '#8884d8' },
    { key: 'broodTemperature', name: 'Brood Temp (°C)', color: '#82ca9d' },
    { key: 'insideTemperature', name: 'Inside Temp (°C)', color: '#ffc658' },
    { key: 'outsideTemperature', name: 'Outside Temp (°C)', color: '#a4de6c' },
    { key: 'batteryVoltage', name: 'Battery Voltage (V)', color: '#d0ed57' },
    { key: 'humidity', name: 'Humidity (%)', color: '#ff7300' },
    { key: 'dhtTemperature', name: 'DHT Temp (°C)', color: '#83a6ed' },
  ];

  const handleRetryConnection = async () => {
    addNotification({
      type: 'info',
      title: 'Retrying Connection',
      message: 'Attempting to reconnect to ThingSpeak...'
    });
    await loadData(); // Reload data
    if (dataSource === 'thingspeak') {
      addNotification({
        type: 'success',
        title: 'Connection Restored',
        message: 'Successfully reconnected to ThingSpeak!'
      });
    } else if (dataSource === 'fallback') {
      addNotification({
        type: 'warning',
        title: 'Retry Partial Success',
        message: 'Connection attempted but still using fallback data'
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Retry Failed',
        message: 'Still unable to connect to ThingSpeak'
      });
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <ConnectionStatus 
        status={dataSource} 
        lastUpdate={hiveData.length > 0 ? hiveData[hiveData.length - 1].timestamp : null} 
        onRetry={handleRetryConnection}
        debugInfo={debugInfo}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">🏥</span> Colony Health Score
          </h3>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${colonyHealth.score >= 90 ? 'text-green-500' : colonyHealth.score >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>
              {colonyHealth.score}
            </div>
            <div className={`text-2xl font-semibold mb-4 ${colonyHealth.score >= 90 ? 'text-green-600' : colonyHealth.score >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
              {colonyHealth.status}
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-700 mb-2">Health Factors:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {colonyHealth.factors.map((factor, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-gray-500">•</span> {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">🐝</span> Swarm Risk Assessment
          </h3>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${swarmRisk.risk === 'High' ? 'text-red-500' : swarmRisk.risk === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
              {swarmRisk.risk}
            </div>
            <div className={`text-2xl font-semibold mb-4 ${swarmRisk.risk === 'High' ? 'text-red-600' : swarmRisk.risk === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>
              (Score: {swarmRisk.score})
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-700 mb-2">Indicators:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {swarmRisk.indicators.map((indicator, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-gray-500">•</span> {indicator}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-3xl mr-2">🍯</span> Honey Flow Analysis (Weekly)
        </h3>
        {honeyFlow.periods.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-700 font-semibold">
              <div className="p-3 bg-blue-50 rounded-lg shadow-sm">Total Gain: {honeyFlow.total} kg</div>
              <div className="p-3 bg-blue-50 rounded-lg shadow-sm">Average Weekly Gain: {honeyFlow.average} kg</div>
              <div className="p-3 bg-blue-50 rounded-lg shadow-sm">Peak Weekly Gain: {honeyFlow.peak} kg</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 text-left text-gray-600 font-medium">Period (Week Start)</th>
                    <th className="py-2 px-3 text-left text-gray-600 font-medium">Weight Gain (kg)</th>
                    <th className="py-2 px-3 text-left text-gray-600 font-medium">Efficiency (kg/day)</th>
                  </tr>
                </thead>
                <tbody>
                  {honeyFlow.periods.map((p, idx) => (
                    <tr key={idx} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                      <td className="py-2 px-3">{p.period}</td>
                      <td className="py-2 px-3">{p.gain}</td>
                      <td className="py-2 px-3">{p.efficiency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon="📊"
            title="No Honey Flow Data"
            description="Not enough historical data to perform honey flow analysis. Ensure your hive is sending weight data consistently."
          />
        )}
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="space-y-6">
      <ConnectionStatus 
        status={dataSource} 
        lastUpdate={hiveData.length > 0 ? hiveData[hiveData.length - 1].timestamp : null} 
        onRetry={handleRetryConnection}
        debugInfo={debugInfo}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {availableSensors.map(sensor => (
          <Button
            key={sensor.key}
            onClick={() => setSelectedSensor(sensor.key)}
            variant={selectedSensor === sensor.key ? 'primary' : 'secondary'}
            size="sm"
          >
            {sensor.name}
          </Button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {availableSensors.find(s => s.key === selectedSensor)?.name} Trend
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {['today', '3days', '7days', '30days'].map(period => (
            <Button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              variant={selectedPeriod === period ? 'success' : 'secondary'}
              size="sm"
            >
              {period === 'today' ? 'Last 24h' : `Last ${period.replace('days', ' Days')}`}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
            <p className="text-sm text-gray-600">Min</p>
            <p className="text-lg font-semibold text-gray-800">{sensorStats.min}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
            <p className="text-sm text-gray-600">Max</p>
            <p className="text-lg font-semibold text-gray-800">{sensorStats.max}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-lg font-semibold text-gray-800">{sensorStats.avg}</p>
          </div>
        </div>
        {isLoading ? (
          <ChartSkeleton />
        ) : filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10, fill: '#666' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#666' }}
                label={{
                  value: availableSensors.find(s => s.key === selectedSensor)?.name,
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#666'
                }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
                itemStyle={{ color: '#555' }}
              />
              <Line
                type="monotone"
                dataKey={selectedSensor}
                stroke={availableSensors.find(s => s.key === selectedSensor)?.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            icon="📈"
            title="No Data Available"
            description="No data points found for the selected period. Try a different time range or check your ThingSpeak connection."
          />
        )}
      </div>
    </div>
  );

  const renderRawData = () => (
    <div className="space-y-6">
      <ConnectionStatus 
        status={dataSource} 
        lastUpdate={hiveData.length > 0 ? hiveData[hiveData.length - 1].timestamp : null} 
        onRetry={handleRetryConnection}
        debugInfo={debugInfo}
      />
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Raw Data Feed</h3>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading raw data...</p>
          </div>
        ) : hiveData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">Date</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">Weight (kg)</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">Brood Temp (°C)</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">Inside Temp (°C)</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">Outside Temp (°C)</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">Battery (V)</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">Humidity (%)</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">DHT Temp (°C)</th>
                  <th className="py-2 px-3 text-left text-gray-600 font-medium">GPS Valid</th>
                </tr>
              </thead>
              <tbody>
                {hiveData.map((dataPoint, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-3">{dataPoint.date}</td>
                    <td className="py-2 px-3">{dataPoint.weight?.toFixed(2) || 'N/A'}</td>
                    <td className="py-2 px-3">{dataPoint.broodTemperature?.toFixed(2) || 'N/A'}</td>
                    <td className="py-2 px-3">{dataPoint.insideTemperature?.toFixed(2) || 'N/A'}</td>
                    <td className="py-2 px-3">{dataPoint.outsideTemperature?.toFixed(2) || 'N/A'}</td>
                    <td className="py-2 px-3">{dataPoint.batteryVoltage?.toFixed(2) || 'N/A'}</td>
                    <td className="py-2 px-3">{dataPoint.humidity?.toFixed(2) || 'N/A'}</td>
                    <td className="py-2 px-3">{dataPoint.dhtTemperature?.toFixed(2) || 'N/A'}</td>
                    <td className="py-2 px-3">{dataPoint.gpsValid ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🗃️"
            title="No Raw Data"
            description="There is no raw data available for this hive. Ensure your ThingSpeak channel is configured correctly and receiving data."
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span>Back to Dashboard</span>
        </Button>
        <h1 className="text-3xl font-extrabold text-gray-900">{hive.name} Analytics</h1>
        <div className="w-32"></div> {/* Spacer to balance header */}
      </header>

      <nav className="bg-white p-3 rounded-xl shadow-md mb-6 flex justify-center space-x-2 sm:space-x-4 border border-gray-100">
        <Button
          onClick={() => setSelectedView('overview')}
          variant={selectedView === 'overview' ? 'primary' : 'ghost'}
          size="md"
        >
          Overview
        </Button>
        <Button
          onClick={() => setSelectedView('charts')}
          variant={selectedView === 'charts' ? 'primary' : 'ghost'}
          size="md"
        >
          Charts
        </Button>
        <Button
          onClick={() => setSelectedView('rawData')}
          variant={selectedView === 'rawData' ? 'primary' : 'ghost'}
          size="md"
        >
          Raw Data
        </Button>
      </nav>

      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'charts' && renderCharts()}
      {selectedView === 'rawData' && renderRawData()}
    </div>
  );
};

// Settings Component
const Settings = ({ onBack, onSaveHives, currentUser, onSaveThingSpeakCredentials }) => {
  const [hives, setHives] = useState([]);
  const [newHiveName, setNewHiveName] = useState('');
  const [channelId, setChannelId] = useState(currentUser.channelId || '');
  const [readApiKey, setReadApiKey] = useState(currentUser.readApiKey || '');
  const { addNotification } = useNotifications();
  const [isSavingHive, setIsSavingHive] = useState(false);
  const [isSavingThingSpeak, setIsSavingThingSpeak] = useState(false);

  useEffect(() => {
    const storedHives = JSON.parse(localStorage.getItem('hives')) || [
      { id: 'hive1', name: 'Heiloo Hive Alpha' },
      { id: 'hive2', name: 'Heiloo Hive Beta' },
    ];
    setHives(storedHives);
  }, []);

  const handleAddHive = async () => {
    if (newHiveName.trim()) {
      setIsSavingHive(true);
      const newHive = { id: `hive${Date.now()}`, name: newHiveName.trim() };
      const updatedHives = [...hives, newHive];
      setHives(updatedHives);
      localStorage.setItem('hives', JSON.stringify(updatedHives));
      setNewHiveName('');
      addNotification({
        type: 'success',
        title: 'Hive Added!',
        message: `${newHive.name} has been successfully added.`
      });
      onSaveHives(updatedHives); // Propagate changes to parent (App component)
      setIsSavingHive(false);
    } else {
      addNotification({
        type: 'error',
        title: 'Invalid Hive Name',
        message: 'Hive name cannot be empty.'
      });
    }
  };

  const handleDeleteHive = (id, name) => {
    const updatedHives = hives.filter(hive => hive.id !== id);
    setHives(updatedHives);
    localStorage.setItem('hives', JSON.stringify(updatedHives));
    addNotification({
      type: 'info',
      title: 'Hive Deleted',
      message: `${name} has been removed.`
    });
    onSaveHives(updatedHives); // Propagate changes to parent (App component)
  };

  const handleSaveThingSpeak = async () => {
    setIsSavingThingSpeak(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onSaveThingSpeakCredentials(channelId, readApiKey);
    addNotification({
      type: 'success',
      title: 'Credentials Saved',
      message: 'ThingSpeak credentials updated successfully!'
    });
    setIsSavingThingSpeak(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span>Back to Dashboard</span>
        </Button>
        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
        <div className="w-32"></div> {/* Spacer */}
      </header>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-3xl mr-2">🏡</span> Manage Hives
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="New Hive Name"
            value={newHiveName}
            onChange={(e) => setNewHiveName(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddHive(); }}
          />
          <Button
            onClick={handleAddHive}
            loading={isSavingHive}
            variant="primary"
            size="md"
          >
            {isSavingHive ? 'Adding...' : 'Add Hive'}
          </Button>
        </div>
        <ul className="space-y-3">
          {hives.length > 0 ? (
            hives.map(hive => (
              <li key={hive.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-gray-800 font-medium">{hive.name}</span>
                <Button
                  onClick={() => handleDeleteHive(hive.id, hive.name)}
                  variant="danger"
                  size="sm"
                >
                  Delete
                </Button>
              </li>
            ))
          ) : (
            <EmptyState
              icon="➕"
              title="No Hives Configured"
              description="Start by adding your first beehive to monitor its data."
            />
          )}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-3xl mr-2">📡</span> ThingSpeak Integration
        </h2>
        <p className="text-gray-600 mb-4">
          Enter your ThingSpeak Channel ID and Read API Key to fetch live data for your hives.
          (If left as default, demo data will be used).
        </p>
        <div className="mb-4">
          <label htmlFor="settingsChannelId" className="block text-gray-700 text-sm font-semibold mb-2">
            ThingSpeak Channel ID
          </label>
          <input
            type="text"
            id="settingsChannelId"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="e.g., 123456"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="settingsReadApiKey" className="block text-gray-700 text-sm font-semibold mb-2">
            ThingSpeak Read API Key
          </label>
          <input
            type="password"
            id="settingsReadApiKey"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={readApiKey}
            onChange={(e) => setReadApiKey(e.target.value)}
            placeholder="Enter your Read API Key"
          />
        </div>
        <Button
          onClick={handleSaveThingSpeak}
          loading={isSavingThingSpeak}
          className="w-full"
          variant="success"
          size="md"
        >
          {isSavingThingSpeak ? 'Saving...' : 'Save ThingSpeak Credentials'}
        </Button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedHive, setSelectedHive] = useState(null);
  const [hives, setHives] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const appVersion = "1.1.0"; // Updated app version
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Load user and ThingSpeak credentials from localStorage on initial load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }

    const storedHives = JSON.parse(localStorage.getItem('hives')) || [
      { id: 'hive1', name: 'Heiloo Hive Alpha' },
      { id: 'hive2', name: 'Heiloo Hive Beta' },
    ];
    setHives(storedHives);

    // Simulate initial alerts
    setAlerts([
      { id: 'alert1', hiveId: 'hive1', message: 'Weight dropped significantly!', type: 'critical', timestamp: Date.now() - 3600000, isRead: false },
      { id: 'alert2', hiveId: 'hive2', message: 'Brood temperature slightly low.', type: 'warning', timestamp: Date.now() - 7200000, isRead: false },
      { id: 'alert3', hiveId: 'hive1', message: 'Battery voltage is at 3.6V.', type: 'info', timestamp: Date.now() - 10800000, isRead: true },
    ]);
  }, []);

  const handleLogin = (username, channelId, readApiKey) => {
    const user = { username, channelId, readApiKey };
    setLoggedInUser(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setSelectedHive(null);
    localStorage.removeItem('loggedInUser');
  };

  const handleSaveThingSpeakCredentials = (channelId, readApiKey) => {
    setLoggedInUser(prevUser => ({
      ...prevUser,
      channelId,
      readApiKey
    }));
    localStorage.setItem('loggedInUser', JSON.stringify({
      ...loggedInUser,
      channelId,
      readApiKey
    }));
  };

  const handleSaveHives = (updatedHives) => {
    setHives(updatedHives);
    localStorage.setItem('hives', JSON.stringify(updatedHives));
  };

  const handleMarkAlertRead = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
    addNotification({
      type: 'info',
      title: 'Alert Marked',
      message: 'Alert has been marked as read.'
    });
  };

  const handleShowAlertsModal = () => {
    setShowAlertsModal(true);
  };

  const [showAlertsModal, setShowAlertsModal] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Custom animation for toast notifications */
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        `}
      </style>
      {!loggedInUser ? (
        <Login onLogin={handleLogin} />
      ) : selectedHive && selectedHive.id === 'settings' ? (
        <Settings
          onBack={() => setSelectedHive(null)}
          onSaveHives={handleSaveHives}
          currentUser={loggedInUser}
          onSaveThingSpeakCredentials={handleSaveThingSpeakCredentials}
        />
      ) : selectedHive ? (
        <HiveDetail
          hive={selectedHive}
          onBack={() => setSelectedHive(null)}
          channelId={loggedInUser.channelId}
          readApiKey={loggedInUser.readApiKey}
        />
      ) : (
        <Dashboard
          user={loggedInUser}
          hives={hives}
          onSelectHive={setSelectedHive}
          onLogout={handleLogout}
          alerts={alerts}
          onMarkAlertRead={handleMarkAlertRead}
          onShowAlertsModal={handleShowAlertsModal}
          appVersion={appVersion}
        />
      )}
      {/* Global Notifications Container */}
      <div className="fixed bottom-4 right-4 z-[100] space-y-3 max-w-sm w-full">
        {notifications.map(notification => (
          <Toast key={notification.id} notification={notification} onClose={removeNotification} />
        ))}
      </div>
      {/* Alerts Modal - Re-using the Modal component if it exists, otherwise a simple div */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Alerts</h3>
            {alerts.length > 0 ? (
              <ul className="space-y-4">
                {alerts.sort((a, b) => b.timestamp - a.timestamp).map(alert => (
                  <li key={alert.id} className={`p-4 rounded-lg border ${alert.isRead ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold ${alert.isRead ? 'text-gray-700' : 'text-red-700'}`}>
                        {alert.hiveId ? `Hive ${hives.find(h => h.id === alert.hiveId)?.name || alert.hiveId}: ` : ''}
                        {alert.message}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {!alert.isRead && (
                      <Button
                        onClick={() => handleMarkAlertRead(alert.id)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon="🎉"
                title="No New Alerts"
                description="All clear! Your hives are happy and healthy."
              />
            )}
            <Button
              onClick={() => setShowAlertsModal(false)}
              className="mt-6 w-full"
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
