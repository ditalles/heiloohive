HeilooHive - Your Apiary's Command Center
Unleash the Power of Data in Your Beekeeping!

HeilooHive isn't just a dashboard; it's your beehive's personal data scientist, meticulously analyzing every buzz, every gram, and every degree to bring you unparalleled insights into your colony's well-being and productivity. Gone are the days of guesswork – embrace the future of smart beekeeping!

Dive Deep into Your Hives
HeilooHive is a cutting-edge, responsive web application meticulously crafted to empower beekeepers with a commanding view of their apiary. By seamlessly integrating with IoT sensors, this dashboard transforms raw data into actionable intelligence, allowing you to make proactive, data-driven decisions that boost hive health and honey yields.

Key Innovations
Effortless Access: A streamlined login ensures you're always just moments away from your critical hive data.

Scalable Apiary Management: Whether you have one hive or a hundred, easily add, modify, and track each one with precision.

Real-time Intelligence, Always On:

Live Sensor Feed: Connect directly to ThingSpeak to stream vital data including weight, internal and external temperatures, humidity, battery voltage, and even GPS validity.

Intelligent Fallback: Never lose sight of your data. If ThingSpeak credentials are not set or there's a connectivity hiccup, HeilooHive seamlessly switches to simulated data, ensuring continuous functionality and a smooth user experience.

The Big Picture (Dashboard Overview):

Instant Health Checks: Get a bird's-eye view of your entire apiary with the latest sensor readings from each hive.

Critical Alert Flags: Unread notifications are prominently displayed, drawing your attention to issues that demand immediate action.

Unveiling the Hive's Secrets (Advanced Analytics - Hive Detail View):

Colony Health Score: A proprietary algorithm synthesizes brood temperature, weight dynamics, and humidity into an intuitive health score and status, complete with detailed contributing factors – know exactly why your bees are thriving, or struggling.

Swarm Propensity Predictor: Our advanced analytics flag potential swarming indicators, such as sudden weight drops, erratic brood temperatures, and heightened activity, giving you an early warning system to prevent absconding.

Honey Flow Dynamics: Monitor the pulse of your honey production with weekly weight gain analysis, average and peak production metrics, and efficiency ratios – optimize your harvest like never before.

Visual Storytelling with Charts: Explore historical trends for every sensor data point over customizable periods (24 hours, 3 days, 7 days, 30 days) with elegant and interactive line charts.

Granular Data Access: For the data purists, a comprehensive raw data feed is available in an easy-to-digest tabular format.

Proactive Alerting: A centralized alert system keeps you informed. Critical alerts are visually distinguished and can be easily managed, ensuring no urgent situation goes unnoticed.

Seamless Experience: A fluid, responsive design guarantees a perfect display and effortless interaction across all your devices – from your desktop command center to your smartphone in the field.

Your Control Panel: A dedicated Settings page allows you to effortlessly manage your hives and configure your crucial ThingSpeak API credentials.

Unrivaled Compatibility
HeilooHive is engineered as the ultimate frontend for cutting-edge beehive monitoring systems. It is the perfect partner for the robust hardware and software solution found in the Beehive Monitoring System repository:

https://github.com/ditalles/beehive-monitoring

By deploying the advanced hardware and software detailed in the linked repository and setting up your ThingSpeak channel with the correct field assignments, you can unlock the full potential of HeilooHive to visualize and analyze your beehive data in unprecedented real-time detail.

For the quickest and easiest implementation, access the live web application here: https://ditalles.github.io/heiloohive/ and configure it with your ThingSpeak channel. You'll be monitoring your hives in no time!

Built on a Foundation of Excellence
React: Powering a dynamic and responsive user interface.

Tailwind CSS: For lightning-fast and elegant UI development.

Recharts: Bringing your data to life with beautiful, insightful charts.

ThingSpeak API: The backbone for seamless IoT data acquisition.

Get Started: Your Journey to Smarter Beekeeping
Prerequisites
Node.js (LTS version highly recommended)

npm or Yarn

Installation
Clone the HeilooHive repository:

Bash

git clone <this_repository_url>
cd heiloo-hive
Ignite the dependencies:

Bash

npm install
# or, if you prefer Yarn
yarn install
Launch Your Apiary's Command Center:

Bash

npm start
# or
yarn start
Your personalized HeilooHive dashboard will materialize in your browser at http://localhost:3000.

Configuration: Connecting to Your Hives
Upon your very first launch, HeilooHive will gracefully enter "Demo Mode," presenting you with simulated data. To unlock the full power of real-time insights:

Log in using the provided default credentials (username: demo_user, ThingSpeak Channel ID: 123456, ThingSpeak Read API Key: demo_api_key).

Navigate to the Settings page – easily accessible via the prominent button at the bottom right of your dashboard.

In the dedicated "ThingSpeak Integration" section, input your unique ThingSpeak Channel ID and ThingSpeak Read API Key.

Crucial Note: These credentials must precisely match the ThingSpeak channel where your beehive monitoring hardware (especially if you're using the system from https://github.com/ditalles/beehive-monitoring) is actively streaming data.

Click "Save ThingSpeak Credentials" to solidify your connection.

HeilooHive will now dynamically fetch and showcase live data from your ThingSpeak channel. Should there be any interruption in data flow (e.g., incorrect credentials, or no new data), the application will intelligently revert to simulated data, ensuring an uninterrupted and insightful user experience.

Data Schema: Harmonizing Your Inputs
For HeilooHive to deliver precise analyses, ensure your beehive monitoring hardware maps its data to your ThingSpeak channel as follows:

Field 1: Weight (kg)

Field 2: Brood Temperature (°C)

Field 3: Inside Temperature (°C)

Field 4: Outside Temperature (°C)

Field 5: Battery Voltage (V)

Field 6: Humidity (%)

Field 7: DHT Temperature (°C)

Field 8: GPS Valid (1 for valid, 0 for invalid)

Adhering to this schema guarantees the most accurate data visualization and analytical prowess from your HeilooHive dashboard.

Contribute to the Hive!
We invite passionate beekeepers and developers to contribute to the evolution of HeilooHive! Your insights and expertise are invaluable. Feel free to submit issues, propose new features, or contribute code via pull requests. Let's build the future of beekeeping, together!