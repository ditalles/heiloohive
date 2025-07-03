import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Firebase Context for easy access to auth and db (mocked for this example)
// In a real application, this would provide Firebase instances (auth, firestore)
const FirebaseContext = createContext(null);

// Custom Modal Component
const Modal = ({ show, title, message, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
                {message && <p className="text-gray-700 mb-6">{message}</p>}
                {children}
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Utility function to generate random data for demonstration
const generateSimulatedData = (days = 30) => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.unshift({ // Add to the beginning to keep it sorted ascending by time
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            timestamp: date.getTime(),
            weight: parseFloat((Math.random() * 10 + 30).toFixed(2)), // 30-40 kg
            broodTemperature: parseFloat((Math.random() * 5 + 32).toFixed(2)), // 32-37 °C
            insideTemperature: parseFloat((Math.random() * 5 + 28).toFixed(2)), // 28-33 °C
            outsideTemperature: parseFloat((Math.random() * 15 + 10).toFixed(2)), // 10-25 °C
            batteryVoltage: parseFloat((Math.random() * 0.5 + 3.5).toFixed(2)), // 3.5-4.0 V
            humidity: parseFloat((Math.random() * 20 + 60).toFixed(2)), // 60-80 %
            dhtTemperature: parseFloat((Math.random() * 5 + 25).toFixed(2)), // 25-30 °C
            gpsValid: Math.random() > 0.5 ? 1 : 0,
        });
    }
    return data;
};

// Advanced analytics functions (placeholder logic, extend as needed)
const calculateSwarmRisk = (data) => {
    if (!data || data.length < 7) return { risk: 'Unknown', score: 0, indicators: ['Not enough data for accurate assessment.'] };
    
    const recent = data.slice(-7); // Last 7 data points
    const indicators = [];
    let riskScore = 0;
    
    // Check for rapid weight loss (potential absconding or problem)
    const weightChange = recent[recent.length - 1].weight - recent[0].weight;
    if (weightChange < -2) { // More than 2kg loss in 7 days
        indicators.push('Significant recent weight loss detected.');
        riskScore += 30;
    }
    
    // Check for brood temperature instability
    const broodTemps = recent.map(d => d.broodTemperature).filter(t => typeof t === 'number' && !isNaN(t));
    if (broodTemps.length > 1) {
        const tempRange = Math.max(...broodTemps) - Math.min(...broodTemps);
        if (tempRange > 3) { // Large temperature swings
            indicators.push('High brood temperature variance detected.');
            riskScore += 20;
        }
    }
    
    // Check for high activity (e.g., sudden increase in weight fluctuations)
    const dailyWeightChanges = recent.slice(1).map((curr, idx) => 
        Math.abs(curr.weight - recent[idx].weight)
    ).filter(v => !isNaN(v));

    const avgDailyWeightChange = dailyWeightChanges.length > 0 ? dailyWeightChanges.reduce((a, b) => a + b, 0) / dailyWeightChanges.length : 0;
    
    if (avgDailyWeightChange > 0.5) { // Average daily change > 0.5kg
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
    
    const recent = data.slice(-14); // Consider last 14 days for health
    const factors = [];
    let healthScore = 100;
    
    // Brood Temperature stability and optimal range (32-36°C)
    const broodTemps = recent.map(d => d.broodTemperature).filter(t => typeof t === 'number' && !isNaN(t));
    if (broodTemps.length > 0) {
        const avgBroodTemp = broodTemps.reduce((sum, t) => sum + t, 0) / broodTemps.length;
        if (avgBroodTemp < 32 || avgBroodTemp > 36) {
            factors.push(`Brood temperature (${avgBroodTemp.toFixed(1)}°C) is outside optimal range (32-36°C).`);
            healthScore -= 20;
        } else {
            factors.push(`Brood temperature (${avgBroodTemp.toFixed(1)}°C) is optimal.`);
        }
    } else {
        factors.push('No brood temperature data available.');
    }
    
    // Weight trend over time
    if (recent.length >= 7) {
        const firstWeekWeights = recent.slice(0, Math.floor(recent.length / 2)).map(d => d.weight).filter(w => typeof w === 'number' && !isNaN(w));
        const secondWeekWeights = recent.slice(Math.floor(recent.length / 2)).map(d => d.weight).filter(w => typeof w === 'number' && !isNaN(w));

        if (firstWeekWeights.length > 0 && secondWeekWeights.length > 0) {
            const avgFirstWeekWeight = firstWeekWeights.reduce((s, d) => s + d, 0) / firstWeekWeights.length;
            const avgSecondWeekWeight = secondWeekWeights.reduce((s, d) => s + d, 0) / secondWeekWeights.length;
            const weightTrend = avgSecondWeekWeight - avgFirstWeekWeight;
            
            if (weightTrend > 0.5) {
                factors.push('Positive weight gain trend detected.');
            } else if (weightTrend < -1) { // Significant weight loss
                factors.push('Concerning weight loss trend detected.');
                healthScore -= 15;
            } else {
                factors.push('Stable weight trend.');
            }
        } else {
            factors.push('Insufficient weight data for trend analysis.');
        }
    }
    
    // Humidity levels (optimal usually 50-70%)
    const humidityLevels = recent.map(d => d.humidity).filter(h => typeof h === 'number' && !isNaN(h));
    if (humidityLevels.length > 0) {
        const avgHumidity = humidityLevels.reduce((sum, h) => sum + h, 0) / humidityLevels.length;
        if (avgHumidity < 50 || avgHumidity > 70) {
            factors.push(`Humidity (${avgHumidity.toFixed(1)}%) is outside optimal range (50-70%).`);
            healthScore -= 10;
        } else {
            factors.push(`Humidity (${avgHumidity.toFixed(1)}%) is optimal.`);
        }
    } else {
        factors.push('No humidity data available.');
    }

    // Battery Voltage
    const batteryVoltages = recent.map(d => d.batteryVoltage).filter(v => typeof v === 'number' && !isNaN(v));
    if (batteryVoltages.length > 0) {
        const minBattery = Math.min(...batteryVoltages);
        if (minBattery < 3.6) { // Assuming 3.7V nominal for LiPo
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
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Group data into weekly periods
    const weeklyDataMap = new Map(); // Map: 'YYYY-MM-DD' (start of week) -> array of data points
    sortedData.forEach(item => {
        const date = new Date(item.timestamp);
        // Get the start of the week (e.g., Monday)
        const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday to be end of previous week, Monday start of current
        const weekStart = new Date(date.setDate(diff));
        weekStart.setHours(0, 0, 0, 0); // Normalize to start of day

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
            const durationDays = (weekData[weekData.length - 1].timestamp - weekData[0].timestamp) / oneDayMs;
            const efficiency = durationDays > 0 ? (gain / durationDays) : 0;

            periods.push({
                period: weekKey, // Or format as needed for display
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

// Function to fetch data from ThingSpeak
const fetchThingSpeakData = async (channelId, readApiKey, numResults = 100) => {
    // Check if valid credentials are provided
    if (!channelId || !readApiKey || channelId === '123456' || readApiKey === 'demo_api_key') {
        console.warn("Using simulated data: ThingSpeak Channel ID or Read API Key is missing or default.");
        return generateSimulatedData(numResults === 1 ? 1 : 30);
    }

    try {
        const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=${numResults}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ThingSpeak API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (!data || !data.feeds || data.feeds.length === 0) {
            console.warn("ThingSpeak returned no feeds. Using simulated data.");
            return generateSimulatedData(numResults === 1 ? 1 : 30);
        }

        return data.feeds.map(feed => ({
            date: new Date(feed.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date(feed.created_at).getTime(),
            weight: parseFloat(feed.field1), // Assuming field1 is weight
            broodTemperature: parseFloat(feed.field2), // Assuming field2 is broodTemperature
            insideTemperature: parseFloat(feed.field3), // Assuming field3 is insideTemperature
            outsideTemperature: parseFloat(feed.field4), // Assuming field4 is outsideTemperature
            batteryVoltage: parseFloat(feed.field5), // Assuming field5 is batteryVoltage
            humidity: parseFloat(feed.field6), // Assuming field6 is humidity
            dhtTemperature: parseFloat(feed.field7), // Assuming field7 is dhtTemperature
            gpsValid: feed.field8 === '1' // Assuming field8 is for GPS validity
        })).filter(item => item.timestamp && !isNaN(item.weight)); // Filter out entries with invalid timestamp or weight
    } catch (error) {
        console.error("Failed to fetch data from ThingSpeak:", error);
        // Fallback to simulated data on fetch error
        return generateSimulatedData(numResults === 1 ? 1 : 30);
    }
};

// Login Component
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('demo_user');
    const [channelId, setChannelId] = useState('123456'); // Default to demo values
    const [readApiKey, setReadApiKey] = useState('demo_api_key'); // Default to demo values
    const [rememberMe, setRememberMe] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleLogin = () => {
        if (username) { // Only username is strictly required for demo login flow
            onLogin(username, channelId, readApiKey); // Pass ThingSpeak credentials
        } else {
            setModalMessage('Please enter a username.');
            setShowModal(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">HeilooHive Login</h2>
                <div className="mb-5">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="channelId" className="block text-gray-700 text-sm font-semibold mb-2">
                        ThingSpeak Channel ID:
                    </label>
                    <input
                        type="text"
                        id="channelId"
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder="e.g., 123456"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="readApiKey" className="block text-gray-700 text-sm font-semibold mb-2">
                        ThingSpeak Read API Key:
                    </label>
                    <input
                        type="password"
                        id="readApiKey"
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={readApiKey}
                        onChange={(e) => setReadApiKey(e.target.value)}
                        placeholder="Enter your Read API Key"
                    />
                    <p className="text-gray-600 text-xs italic">
                        (Leave as default for demo data, enter your own for live data)
                    </p>
                </div>
                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-gray-700 text-sm">Remember Me</label>
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Login
                </button>
            </div>
            <Modal
                show={showModal}
                title="Login Error"
                message={modalMessage}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

// Dashboard Component
const Dashboard = ({ user, hives, onSelectHive, onLogout, alerts, onMarkAlertRead, onShowAlertsModal, appVersion }) => {
    const [latestHiveData, setLatestHiveData] = useState({});
    const [isLoadingLatestData, setIsLoadingLatestData] = useState(true);

    useEffect(() => {
        const fetchAllLatestData = async () => {
            setIsLoadingLatestData(true);
            const newLatestData = {};
            for (const hive of hives) {
                try {
                    // Pass user's ThingSpeak credentials to fetch real data
                    const data = await fetchThingSpeakData(user.channelId, user.readApiKey, 1);
                    if (data && data.length > 0) {
                        newLatestData[hive.id] = data[0];
                    } else {
                        newLatestData[hive.id] = null; // No data found
                    }
                } catch (error) {
                    console.error(`Error fetching latest data for hive ${hive.name}:`, error);
                    newLatestData[hive.id] = null; // Indicate error
                }
            }
            setLatestHiveData(newLatestData);
            setIsLoadingLatestData(false);
        };

        if (hives.length > 0 && user?.channelId && user?.readApiKey) { // Only fetch if user is logged in and ThingSpeak credentials exist
            fetchAllLatestData();
        } else {
            console.log("Not fetching live data on dashboard: ThingSpeak credentials missing or no hives.");
            setIsLoadingLatestData(false); // No hives or not logged in, so no data to load
        }
    }, [hives, user]); // Depend on hives and user to re-fetch when they change

    const getLatestDataForDisplay = (hiveId) => {
        return latestHiveData[hiveId] || {};
    };

    const unreadAlertCount = alerts.filter(alert => !alert.isRead).length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 sm:mb-0">HeilooHive Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700 text-sm hidden sm:block">Welcome, {user?.username || 'Guest'}!</span>
                    <button
                        onClick={onShowAlertsModal}
                        className="relative bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-sm flex items-center"
                    >
                        Alerts
                        {unreadAlertCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadAlertCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={onLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Hives</h2>
            {isLoadingLatestData ? (
                <div className="text-center py-8 bg-white rounded-xl shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading latest hive data...</p>
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
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelectHive(hive); }}
                                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-sm"
                                    >
                                        View Advanced Analytics
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="col-span-full text-center text-gray-600 text-lg">No hives found. Add some in settings!</p>
                    )}
                </div>
            )}
            <div className="text-center text-gray-500 text-xs mt-6">
                App Version: {appVersion}
            </div>
            <button
                onClick={() => onSelectHive({ id: 'settings', name: 'Settings' })}
                className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 text-lg"
            >
                Settings
            </button>
        </div>
    );
};

// Advanced Hive Detail Component with Analytics
const HiveDetail = ({ hive, onBack, channelId, readApiKey }) => { // Accept channelId and readApiKey directly
    const [selectedView, setSelectedView] = useState('overview');
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [selectedSensor, setSelectedSensor] = useState('weight');
    const [hiveData, setHiveData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState('demo'); // 'thingspeak', 'demo', 'fallback'

    // Memoize the loadData function to prevent unnecessary re-creations
    const loadData = useCallback(async () => {
        setIsLoading(true);
        let fetchedData = [];
        let currentSource = 'demo'; // Default to demo

        // Use the channelId and readApiKey passed as props
        if (channelId && readApiKey && channelId !== '123456' && readApiKey !== 'demo_api_key') { // Check for actual credentials
            try {
                // Fetch more data for analytics (e.g., 100 results)
                const data = await fetchThingSpeakData(channelId, readApiKey, 100); 
                if (data && data.length > 0) {
                    fetchedData = data;
                    currentSource = 'thingspeak';
                } else {
                    // ThingSpeak returned no data, use fallback
                    fetchedData = generateSimulatedData(30);
                    currentSource = 'fallback';
                }
            } catch (error) {
                console.error("Error fetching ThingSpeak data:", error);
                fetchedData = generateSimulatedData(30); // Fallback to demo
                currentSource = 'fallback';
            }
        } else {
            // No ThingSpeak credentials, use demo data
            fetchedData = generateSimulatedData(30);
            currentSource = 'demo';
        }
        
        setHiveData(fetchedData);
        setDataSource(currentSource);
        setIsLoading(false);
    }, [hive.id, channelId, readApiKey]); // Depend on hive.id, channelId, and readApiKey

    useEffect(() => {
        loadData();
    }, [loadData]); // Call loadData when the component mounts or loadData changes

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
        // Filter out non-numeric or zero values for stats calculation
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

    const getDataSourceDisplay = () => {
        switch (dataSource) {
            case 'thingspeak':
                return { text: '🟢 Live ThingSpeak Data', color: 'text-green-600', bg: 'bg-green-50' };
            case 'demo':
                return { text: '🔵 Demo Mode', color: 'text-blue-600', bg: 'bg-blue-50' };
            case 'fallback':
                return { text: '🟡 Fallback Data', color: 'text-yellow-600', bg: 'bg-yellow-50' };
            default:
                return { text: '⚪ Unknown Source', color: 'text-gray-600', bg: 'bg-gray-50' };
        }
    };

    const sourceDisplay = getDataSourceDisplay();

    const renderDataQualityIndicator = () => (
        <div className={`p-3 rounded-lg mb-4 ${sourceDisplay.bg}`}>
            <div className="flex items-center justify-between">
                <span className={`font-semibold ${sourceDisplay.color}`}>
                    {sourceDisplay.text}
                </span>
                <div className="text-sm text-gray-600">
                    {filteredData.length > 0 && `${filteredData.length} data points`}
                </div>
            </div>
            {dataSource === 'thingspeak' && (
                <p className="text-green-700 text-sm mt-1">
                    ✅ Connected to your ThingSpeak channel - Real-time beehive monitoring active
                </p>
            )}
            {dataSource === 'demo' && (
                <p className="text-blue-700 text-sm mt-1">
                    ℹ️ Displaying demo data. Connect your ThingSpeak channel in settings for live data.
                </p>
            )}
            {dataSource === 'fallback' && (
                <p className="text-yellow-700 text-sm mt-1">
                    ⚠️ Could not retrieve live data. Displaying fallback data. Check ThingSpeak settings.
                </p>
            )}
        </div>
    );

    const renderOverview = () => (
        <div className="space-y-6">
            {renderDataQualityIndicator()}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🏥 Colony Health Score</h3>
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

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🐝 Swarm Risk Assessment</h3>
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

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🍯 Honey Flow Analysis (Weekly)</h3>
                {honeyFlow.periods.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-700 font-semibold">
                            <div>Total Gain: {honeyFlow.total} kg</div>
                            <div>Average Weekly Gain: {honeyFlow.average} kg</div>
                            <div>Peak Weekly Gain: {honeyFlow.peak} kg</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm">
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
                    <p className="text-gray-600 text-center">Not enough data to perform honey flow analysis.</p>
                )}
            </div>
        </div>
    );

    const renderCharts = () => (
        <div className="space-y-6">
            {renderDataQualityIndicator()}

            <div className="flex flex-wrap gap-2 mb-4">
                {availableSensors.map(sensor => (
                    <button
                        key={sensor.key}
                        onClick={() => setSelectedSensor(sensor.key)}
                        className={`py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${selectedSensor === sensor.key ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        {sensor.name}
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {availableSensors.find(s => s.key === selectedSensor)?.name} Trend
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {['today', '3days', '7days', '30days'].map(period => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${selectedPeriod === period ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        >
                            {period === 'today' ? 'Last 24h' : `Last ${period.replace('days', ' Days')}`}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Min</p>
                        <p className="text-lg font-semibold text-gray-800">{sensorStats.min}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Max</p>
                        <p className="text-lg font-semibold text-gray-800">{sensorStats.max}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Average</p>
                        <p className="text-lg font-semibold text-gray-800">{sensorStats.avg}</p>
                    </div>
                </div>
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading chart data...</p>
                    </div>
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
                    <p className="text-center text-gray-600 py-8">No data available for the selected period.</p>
                )}
            </div>
        </div>
    );

    const renderRawData = () => (
        <div className="space-y-6">
            {renderDataQualityIndicator()}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Raw Data Feed</h3>
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading raw data...</p>
                    </div>
                ) : hiveData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm">
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
                    <p className="text-center text-gray-600 py-8">No raw data available.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md mb-6">
                <button
                    onClick={onBack}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300 shadow-sm flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900">{hive.name} Analytics</h1>
                <div className="w-32"></div> {/* Spacer to balance header */}
            </header>

            <nav className="bg-white p-2 rounded-xl shadow-md mb-6 flex justify-center space-x-2 sm:space-x-4">
                <button
                    onClick={() => setSelectedView('overview')}
                    className={`py-2 px-4 rounded-lg font-semibold transition duration-200 ${selectedView === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setSelectedView('charts')}
                    className={`py-2 px-4 rounded-lg font-semibold transition duration-200 ${selectedView === 'charts' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    Charts
                </button>
                <button
                    onClick={() => setSelectedView('rawData')}
                    className={`py-2 px-4 rounded-lg font-semibold transition duration-200 ${selectedView === 'rawData' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    Raw Data
                </button>
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
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const [channelId, setChannelId] = useState(currentUser.channelId || '');
    const [readApiKey, setReadApiKey] = useState(currentUser.readApiKey || '');

    useEffect(() => {
        // Load hives from local storage or a mock source
        const storedHives = JSON.parse(localStorage.getItem('hives')) || [
            { id: 'hive1', name: 'Heiloo Hive Alpha' },
            { id: 'hive2', name: 'Heiloo Hive Beta' },
        ];
        setHives(storedHives);
    }, []);

    const handleAddHive = () => {
        if (newHiveName.trim()) {
            const newHive = { id: `hive${Date.now()}`, name: newHiveName.trim() };
            const updatedHives = [...hives, newHive];
            setHives(updatedHives);
            localStorage.setItem('hives', JSON.stringify(updatedHives));
            setNewHiveName('');
            setModalTitle('Success');
            setModalMessage('New hive added successfully!');
            setShowModal(true);
        } else {
            setModalTitle('Error');
            setModalMessage('Hive name cannot be empty.');
            setShowModal(true);
        }
    };

    const handleDeleteHive = (id) => {
        const updatedHives = hives.filter(hive => hive.id !== id);
        setHives(updatedHives);
        localStorage.setItem('hives', JSON.stringify(updatedHives));
        setModalTitle('Success');
        setModalMessage('Hive deleted successfully!');
        setShowModal(true);
    };

    const handleSaveThingSpeak = () => {
        onSaveThingSpeakCredentials(channelId, readApiKey);
        setModalTitle('Success');
        setModalMessage('ThingSpeak credentials saved!');
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <header className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md mb-6">
                <button
                    onClick={onBack}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300 shadow-sm flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
                <div className="w-32"></div> {/* Spacer */}
            </header>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Hives</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        className="flex-grow shadow-sm appearance-none border border-gray-300 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="New Hive Name"
                        value={newHiveName}
                        onChange={(e) => setNewHiveName(e.target.value)}
                    />
                    <button
                        onClick={handleAddHive}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-sm"
                    >
                        Add Hive
                    </button>
                </div>
                <ul className="space-y-3">
                    {hives.map(hive => (
                        <li key={hive.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <span className="text-gray-800 font-medium">{hive.name}</span>
                            <button
                                onClick={() => handleDeleteHive(hive.id)}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-md transition duration-300"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">ThingSpeak Integration</h2>
                <p className="text-gray-600 mb-4">
                    Enter your ThingSpeak Channel ID and Read API Key to fetch live data for your hives.
                    (If left as default, demo data will be used).
                </p>
                <div className="mb-4">
                    <label htmlFor="settingsChannelId" className="block text-gray-700 text-sm font-semibold mb-2">
                        ThingSpeak Channel ID:
                    </label>
                    <input
                        type="text"
                        id="settingsChannelId"
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder="e.g., 123456"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="settingsReadApiKey" className="block text-gray-700 text-sm font-semibold mb-2">
                        ThingSpeak Read API Key:
                    </label>
                    <input
                        type="password"
                        id="settingsReadApiKey"
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={readApiKey}
                        onChange={(e) => setReadApiKey(e.target.value)}
                        placeholder="Enter your Read API Key"
                    />
                </div>
                <button
                    onClick={handleSaveThingSpeak}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-sm"
                >
                    Save ThingSpeak Credentials
                </button>
            </div>

            <Modal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

// Main App Component
const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [selectedHive, setSelectedHive] = useState(null);
    const [hives, setHives] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const appVersion = "1.0.0"; // Define app version

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
            <Modal
                show={showAlertsModal}
                title="Alerts"
                onClose={() => setShowAlertsModal(false)}
            >
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
                                    <button
                                        onClick={() => handleMarkAlertRead(alert.id)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-center">No new alerts.</p>
                )}
            </Modal>
        </div>
    );
};

export default App;
