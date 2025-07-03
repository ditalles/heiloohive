🐝 HeilooHive - Professional Beehive Monitoring System
A modern, professional-grade IoT beehive monitoring application providing real-time analytics, swarm detection, and honey production tracking. Built with React and integrated with ThingSpeak for seamless, secure sensor data collection and visualization.

Important:
HeilooHive is designed to work together with both ThingSpeak (for cloud data storage and API access) and the beehive-monitoring repository (for sensor data acquisition and hardware integration). This app will not function as intended without these components.

🌟 Features
📊 Real-Time Monitoring
Live sensor data via ThingSpeak integration
Auto-refresh every 5 minutes
Connection status indicators and timestamps
Multi-hive management with individual analytics
🔍 Advanced Analytics
Colony Health Score (0-100) with detailed contributing factors
Swarm Risk Assessment with early warnings
Honey Flow Analysis for production efficiency
Long-term trend analysis with weekly patterns
📈 Professional Charts
Interactive line charts for sensor trends
Bar charts for honey production
Multi-axis plotting (temperature, humidity, weight, etc.)
Statistical summaries (min/max/average)
🚨 Smart Alerts
Real-time notifications for critical thresholds
Configurable alert levels
Swarm detection algorithms
Battery and sensor health tracking
📱 Modern UI/UX
Responsive design (desktop/mobile)
Professional dashboard, intuitive navigation
Four specialized analytics views
Dark/light theme support
🚀 Quick Start
Demo Mode
Try the app instantly—no hardware required!

Open the application
Click "Try Demo Mode"
Explore all features with realistic, simulated beehive data
Production Mode
1. ThingSpeak Setup
bash
# Create a ThingSpeak account at thingspeak.com
# Create a new channel with these 8 fields:
# 1: Weight (kg)
# 2: Brood Temperature (°C)
# 3: Inside Temperature (°C)
# 4: Outside Temperature (°C)
# 5: Battery Voltage (V)
# 6: Humidity (%)
# 7: DHT Temperature (°C)
# 8: GPS Valid (0/1)
2. Hardware Example (from beehive-monitoring repo)
C++
#include <WiFi.h>
#include <ThingSpeak.h>

// ThingSpeak settings
unsigned long channelID = YOUR_CHANNEL_ID;
const char* writeAPIKey = "YOUR_WRITE_API_KEY";

void sendSensorData() {
    ThingSpeak.setField(1, hiveWeight);
    ThingSpeak.setField(2, broodTemperature);
    ThingSpeak.setField(3, insideTemperature);
    ThingSpeak.setField(4, outsideTemperature);
    ThingSpeak.setField(5, batteryVoltage);
    ThingSpeak.setField(6, humidity);
    ThingSpeak.setField(7, dhtTemperature);
    ThingSpeak.setField(8, gpsValid);
    ThingSpeak.writeFields(channelID, writeAPIKey);
}
3. App Setup
Enter your ThingSpeak Channel ID and Read API Key in app settings
Click "Test Connection" to verify
Log in and start monitoring your hives!
📋 Installation
Prerequisites

Node.js 16+ and npm
Modern web browser (ES6+)
ThingSpeak account (for real data)
beehive-monitoring hardware/software sending sensor data to ThingSpeak
Local Development

bash
git clone https://github.com/ditalles/heiloohive.git
cd heiloohive
npm install
npm start
# Visit http://localhost:3000
Production Build

bash
npm run build
# Deploy the /build folder to your preferred hosting (Vercel, Netlify, AWS S3, etc.)
🔧 Configuration
Environment Variables (.env):

env
# Optional: Firebase config
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# Optional: App config
REACT_APP_APP_NAME=HeilooHive
REACT_APP_VERSION=1.0.6
ThingSpeak Field Mapping:

Field	Sensor	Unit	Description
1	Weight	kg	Hive weight from load cell
2	Brood Temp	°C	Internal brood nest temperature
3	Inside Temp	°C	Hive ambient temperature
4	Outside Temp	°C	External weather temperature
5	Battery Voltage	V	Sensor system battery voltage
6	Humidity	%	Relative humidity inside hive
7	DHT Temp	°C	Secondary temperature sensor
8	GPS Valid	0/1	GPS location lock status
📊 Analytics Explained
Colony Health Score
Calculated from:

Temperature stability (35-37°C optimal)
Weight trends (growth vs. decline)
Humidity extremes
Sensor battery status
Swarm Risk Assessment
Monitors for:

Rapid weight loss
Temperature instability
High activity fluctuations
Seasonal patterns
Honey Flow Analysis
Tracks:

Daily/weekly weight gains
Production quality and efficiency
Bloom period patterns
🛠 Hardware Recommendations
Load Cell: HX711 + 50kg
Temperature: DS18B20 sensors
Humidity: DHT22 or BME280
Power: Solar panel + LiPo battery
Microcontroller: ESP32 (WiFi) or Arduino+WiFi/LoRa
Enclosure: Weatherproof box, ventilated, secure mounting
🔒 Security & Privacy
All data stored securely on ThingSpeak
Read-only API access for app
Encrypted local credential storage
No sensitive data sent to third-party servers
HTTPS connections and API key validation
🤝 Contributing
Fork the repo
Create a feature branch (git checkout -b feature/amazing-feature)
Commit changes (git commit -m 'Add amazing feature')
Push and open a Pull Request
Guidelines

React best practices, functional components & hooks
Tailwind CSS for styling
Add tests and update documentation for new features
Bug Reports

Browser/version, steps to reproduce
Expected vs. actual behavior
Console errors and channel config if relevant
📄 License
MIT License — see LICENSE

Acknowledgments:
ThingSpeak for IoT data platform, React, Tailwind CSS, Recharts, and the open source community.
HeilooHive is designed specifically for beekeepers looking for advanced, real-time beehive insight and requires both the beehive-monitoring hardware/software and ThingSpeak integration for full operation.

