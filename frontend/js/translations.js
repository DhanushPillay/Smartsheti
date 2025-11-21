// Translation dictionaries
const translations = {
    en: {
        // Header
        home: "Home",
        weather: "Weather",
        marketplace: "Marketplace",
        marketDemand: "Market Demand",
        profile: "Profile",
        settings: "Settings",
        dashboard: "Dashboard",
        logout: "Logout",
        notifications: "Notifications",
        
        // General
        search: "Search",
        searchPlaceholder: "Search...",
        noResults: "No results found",
        
        // Crop Suggestion
        getCropSuggestions: "Get Crop Suggestions",
        location: "Location",
        enterLocation: "Enter your location",
        soilType: "Soil Type",
        selectSoilType: "Select soil type",
        landSize: "Land Size (in acres)",
        enterLandSize: "Enter land size",
        irrigationType: "Irrigation Type",
        selectIrrigationType: "Select irrigation type",
        getSuggestions: "Get Suggestions",
        suggestedCrops: "Suggested Crops",
        expectedYield: "Expected Yield",
        profitability: "Profitability",
        growingSeason: "Growing Season",
        high: "High",
        medium: "Medium",
        low: "Low",
        winter: "Winter",
        monsoon: "Monsoon",
        summer: "Summer",
        allYear: "All year",
        wheat: "Wheat",
        rice: "Rice",
        cotton: "Cotton",
        sugarcane: "Sugarcane",
        quintal: "quintal",
        
        // Weather
        currentLocation: "Current Location",
        loadingDate: "Loading date...",
        feelsLike: "Feels like",
        humidity: "Humidity",
        wind: "Wind",
        pressure: "Pressure",
        sunrise: "Sunrise",
        sunset: "Sunset",
        weatherAlerts: "Weather Alerts",
        noAlerts: "No active weather alerts",
        forecastTitle: "7-Day Forecast",
        noForecast: "No forecast data available",
        max: "Max",
        min: "Min",
        currentWeather: "Current Weather",
        pestRiskAnalysis: "Pest Risk Analysis",
        irrigationAdvice: "Irrigation Advice",
        lowRisk: "Low risk of pest attacks due to dry conditions",
        moderateRisk: "Moderate risk - monitor crops regularly",
        highRisk: "High risk - consider preventive measures",
        extremeRisk: "Extreme risk - immediate action required",
        reduceIrrigation: "Reduce irrigation frequency due to recent rainfall",
        normalIrrigation: "Maintain normal irrigation schedule",
        increaseIrrigation: "Increase irrigation - dry conditions detected",
        emergencyIrrigation: "Emergency irrigation needed - extreme heat detected",
        
        // Pest Risk Analysis additional keys
        potentialRisks: "Potential Risks",
        recommendations: "Recommendations",
        regularInspection: "Regular crop inspection",
        preventiveMeasures: "Apply preventive measures",
        monitorWeather: "Monitor weather conditions",
        biologicalControl: "Consider biological control methods",
        noRisks: "No specific risks detected.",
        continueMonitoring: "Continue regular monitoring.",
        
        // Pest-specific risks translations
        aphidRisk: "Aphid risk - Warm + Humid + Cloudy conditions favor aphid reproduction",
        whiteflyRisk: "Whitefly risk - Ideal temperature and humidity range for whitefly development",
        spiderMiteRisk: "Red Spider Mite risk - Hot and dry conditions promote spider mite infestation",
        stemBorerRisk: "Stem Borer risk - Still and cloudy weather increases stem borer activity",
        fungalRisk: "Fungal disease risk - Wet and humid conditions promote fungal growth",
        thripsRisk: "Thrips risk - Hot, dry and windy conditions favor thrips infestation",
        leafhopperRisk: "Leafhopper risk - Moderate temperature with rainfall increases leafhopper activity",
        shootFlyRisk: "Shoot fly risk - Moderate rainfall with dry conditions favor shoot fly breeding",
        bollwormRisk: "Bollworm risk - Warm temperature with high humidity increases bollworm activity",
        armywormRisk: "Armyworm risk - Humid and rainy conditions with moderate temperature favor armyworm outbreaks",
        
        // Irrigation advice translations
        irrigationRecommendation: "Irrigation Recommendation",
        weatherConditions: "Weather Conditions",
        reduceWateringRain: "Reduce irrigation frequency due to recent rainfall",
        maintainRegularWatering: "Maintain regular irrigation schedule",
        increaseWateringHighTemp: "Increase irrigation frequency - high temperature detected",
        considerLightIrrigation: "Consider light irrigation - humid conditions",
        monitorSoilMoisture: "Monitor soil moisture - windy conditions",
        noIrrigationNeeded: "No additional irrigation needed",
        normalWeatherIrrigation: "Follow standard irrigation schedule",
        
        // Detailed pest control recommendations
        aphidControlCheck: "Aphid Control: Check undersides of leaves daily, use yellow sticky traps, apply neem oil spray (3-5ml/L water)",
        aphidPredators: "Introduce ladybugs and lacewings as natural predators",
        aphidFertilizer: "Avoid over-fertilizing with nitrogen as it promotes aphid reproduction",
        aphidWaterSpray: "Use high-pressure water spray to dislodge aphids from plants",
        
        whiteflyTraps: "Whitefly Management: Install yellow sticky traps around plants (10-15 traps per acre)",
        whiteflyMulch: "Apply reflective mulch to confuse whiteflies",
        whiteflyCompanion: "Plant marigold and basil as companion plants to repel whiteflies",
        whiteflySoap: "Spray insecticidal soap solution (2-3% concentration) on affected areas",
        
        spiderMiteMisting: "Spider Mite Prevention: Increase humidity around plants with fine misting",
        spiderMiteCheck: "Use magnifying glass to check for fine webbing on leaves",
        spiderMitePredators: "Apply predatory mites (Phytoseiulus persimilis) as biological control",
        spiderMiteWash: "Wash leaves with mild soap solution to remove mites and eggs",
        spiderMiteClean: "Avoid dusty conditions - keep area clean and well-ventilated",
        
        stemBorerRemoval: "Stem Borer Control: Remove and destroy infested plant parts immediately",
        stemBorerTraps: "Use pheromone traps to monitor and catch adult moths",
        stemBorerWasps: "Release Trichogramma wasps for egg parasitism",
        stemBorerBt: "Apply Bt (Bacillus thuringiensis) based bio-pesticide to growing tips",
        stemBorerRotation: "Practice crop rotation with non-host plants",
        
        fungalAirflow: "Fungal Disease Prevention: Improve air circulation between plants",
        fungalSunlight: "Ensure morning sunlight reaches all plant parts to dry dew quickly",
        fungalWatering: "Water at soil level, avoid wetting leaves especially in evening",
        fungalSpray: "Apply preventive copper sulfate or potassium bicarbonate spray",
        fungalCleanup: "Remove and dispose of infected plant debris properly",
        
        thripsBlueTraps: "Thrips Management: Use blue sticky traps (thrips prefer blue over yellow)",
        thripsDiatomaceous: "Apply diatomaceous earth around plant base",
        thripsPredators: "Encourage predatory mites and minute pirate bugs",
        thripsMoisture: "Maintain adequate soil moisture to reduce stress on plants",
        thripsNeem: "Spray neem oil mixed with pyrethrin for severe infestations",
        
        leafhopperCovers: "Leafhopper Control: Use row covers during peak activity periods",
        leafhopperWeeds: "Remove weeds that serve as alternate hosts",
        leafhopperClay: "Apply kaolin clay spray to make leaves less attractive",
        leafhopperPredators: "Encourage spiders and other natural predators",
        leafhopperTape: "Use reflective tape or aluminum foil strips to confuse leafhoppers",
        
        shootFlyEarly: "Shoot Fly Prevention: Sow crops early to avoid peak fly population",
        shootFlyVarieties: "Use resistant varieties if available",
        shootFlyCarbofuran: "Apply carbofuran granules in soil during sowing",
        shootFlyYellowTraps: "Install yellow sticky traps at plant height",
        shootFlyPlowing: "Practice deep summer plowing to expose pupae to heat",
        
        bollwormEggs: "Bollworm Management: Check for egg masses on upper leaf surfaces",
        bollwormLightTraps: "Use light traps to catch adult moths at night",
        bollwormTrichogramma: "Release Trichogramma cards (2-3 cards per acre)",
        bollwormBt: "Apply Bt-based biopesticides during early larval stages",
        bollwormTrapCrops: "Plant trap crops like castor or sunflower at field borders",
        
        armywormTrenches: "Armyworm Emergency Response: Apply barrier trenches around fields",
        armywormTraps: "Use light traps and pheromone traps for early detection",
        armywormBurn: "Burn stubble and crop residues to destroy overwintering larvae",
        armywormBirds: "Encourage birds by providing perches in the field",
        armywormNPV: "Apply Spodoptera NPV (Nuclear Polyhedrosis Virus) as biological control",
        armywormUrgent: "Act quickly - armyworms can destroy crops within 2-3 days",
        
        monitoringSchedule: "Monitoring Schedule: Inspect crops twice daily (early morning and evening)",
        keepRecords: "Keep detailed records of pest numbers and control measures applied",
        contactOfficer: "Contact local agricultural extension officer for severe infestations",
        monitorWeatherPest: "Monitor weather conditions as they directly affect pest activity",
        
        // Weather Alerts
        heavyRain: "Heavy Rain Warning",
        thunderstorm: "Thunderstorm Alert",
        severeWeather: "Severe Weather Warning",
        flood: "Flood Warning",
        flashFlood: "Flash Flood Alert",
        highWind: "High Wind Warning",
        galeWind: "Gale Force Wind Alert",
        fog: "Dense Fog Warning",
        snowWarning: "Snow Warning",
        blizzard: "Blizzard Alert",
        heatWave: "Heat Wave Warning",
        extremeHeat: "Extreme Heat Alert",
        coldWave: "Cold Wave Warning",
        frost: "Frost Alert",
        freezing: "Freezing Conditions",
        weatherAlertFrom: "From:",
        weatherAlertTo: "To:",
        weatherAlertSource: "Source:",
        
        // Market Demand Page
        marketDemandTitle: "Market Demand & Price Insights",
        searchCrop: "Search Crop",
        searchCropPlaceholder: "Type crop name (e.g., wheat, rice, tomato...)",
        selectCrop: "Select Crop",
        selectState: "Select State",
        selectMarket: "Select Market",
        state: "State",
        market: "Market",
        priceTrendFor: "Price Trend for",
        last60Days: "Last 60 Days",
        demandIndicator: "Demand Indicator",
        currentDemand: "Current Demand",
        highDemand: "High Demand",
        mandiComparison: "Mandi Comparison",
        market: "Market",
        currentPrice: "Current Price",
        changeLastWeek: "Change (Last Week)",
        smartShetiInsight: "SmartSheti Insight",
        marketInsightText: "Market conditions for wheat are currently favorable, with high demand and increasing prices across most markets. Consider selling within the next 2-3 weeks to maximize returns.",
        topDemandedVeggies: "Top 5 Demanded Veggies/Fruits",
        tomatoes: "Tomatoes",
        onions: "Onions",
        potatoes: "Potatoes",
        apples: "Apples",
        bananas: "Bananas",
        veryHigh: "Very High",
        
        // Home Page
        empoweringFarmers: "Empowering Farmers with Smart Solutions",
        smartShetiDescription: "SmartSheti provides personalized crop suggestions, real-time weather updates, and a marketplace for agricultural products, all in one place.",
        getStarted: "Get Started",
        keyFeatures: "Key Features",
        featuresDescription: "Explore the core functionalities of SmartSheti designed to enhance your farming experience.",
        cropSuggestionsTitle: "Personalized Crop Suggestions",
        cropSuggestionsDescription: "Receive tailored crop recommendations based on your location, soil type, and climatic conditions.",
        weatherInformation: "Real-Time Weather Information",
        weatherDescription: "Stay informed with up-to-date weather forecasts and alerts to optimize your farming activities.",
        marketplaceTitle: "Agricultural Marketplace",
        marketplaceDescription: "Buy and sell agricultural products directly with other farmers and suppliers in a trusted marketplace.",
        discoverMarketplace: "Discover the Marketplace",
        marketplaceBrowse: "Browse a wide range of agricultural products, from seeds and fertilizers to equipment and tools.",
        exploreMarketplace: "Explore Marketplace",
        smartShetiDescription: "SmartSheti provides personalized crop suggestions, real-time weather updates, and a marketplace for agricultural products, all in one place.",
        keyFeatures: "Key Features",
        featuresDescription: "Explore the core functionalities of SmartSheti designed to enhance your farming experience.",
        cropSuggestions: "Personalized Crop Suggestions",
        cropSuggestionsDescription: "Receive tailored crop recommendations based on your location, soil type, and climatic conditions.",
        weatherInformation: "Real-Time Weather Information",
        weatherDescription: "Stay informed with up-to-date weather forecasts and alerts to optimize your farming activities.",
        marketplace: "Marketplace",
        marketplaceDescription: "Buy and sell agricultural products directly with other farmers and suppliers in a trusted marketplace.",
        discoverMarketplace: "Discover the Marketplace",
        marketplaceBrowse: "Browse a wide range of agricultural products, from seeds and fertilizers to equipment and tools.",
        exploreMarketplace: "Explore Marketplace",
        
        // Footer
        aboutUs: "About Us",
        contact: "Contact",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        copyright: "© 2024 SmartSheti. All rights reserved."
    },
    hi: {
        // Header
        home: "गृह",
        weather: "मौसम",
        marketplace: "बाजार",
        marketDemand: "बाजार मांग",
        profile: "प्रोफाइल",
        settings: "सेटिंग्स",
        dashboard: "डैशबोर्ड",
        logout: "लॉग आउट",
        notifications: "अधिसूचनाएं",
        
        // General
        search: "खोजें",
        searchPlaceholder: "खोजें...",
        noResults: "कोई परिणाम नहीं मिला",
        
        // Crop Suggestion
        getCropSuggestions: "फसल सुझाव प्राप्त करें",
        location: "स्थान",
        enterLocation: "अपना स्थान दर्ज करें",
        soilType: "मिट्टी का प्रकार",
        selectSoilType: "मिट्टी का प्रकार चुनें",
        landSize: "भूमि का आकार (एकड़ में)",
        enterLandSize: "भूमि का आकार दर्ज करें",
        irrigationType: "सिंचाई का प्रकार",
        selectIrrigationType: "सिंचाई का प्रकार चुनें",
        getSuggestions: "सुझाव प्राप्त करें",
        suggestedCrops: "सुझाई गई फसलें",
        expectedYield: "अपेक्षित उत्पादन",
        profitability: "लाभप्रदता",
        growingSeason: "बढ़ते मौसम",
        high: "उच्च",
        medium: "मध्यम",
        low: "कम",
        winter: "सर्दी",
        monsoon: "मानसून",
        summer: "गर्मी",
        allYear: "सारा साल",
        wheat: "गेहूं",
        rice: "चावल",
        cotton: "कपास",
        sugarcane: "गन्ना",
        quintal: "क्विंटल",
        
        // Weather
        currentLocation: "वर्तमान स्थान",
        loadingDate: "तारीख लोड हो रही है...",
        feelsLike: "ऐसा लग रहा है",
        humidity: "नमी",
        wind: "हवा",
        pressure: "दबाव",
        sunrise: "सूर्योदय",
        sunset: "सूर्यास्त",
        weatherAlerts: "मौसम चेतावनी",
        noAlerts: "कोई सक्रिय मौसम चेतावनी नहीं",
        forecastTitle: "7-दिन का पूर्वानुमान",
        noForecast: "पूर्वानुमान डेटा उपलब्ध नहीं",
        max: "अधिकतम",
        min: "न्यूनतम",
        currentWeather: "वर्तमान मौसम",
        pestRiskAnalysis: "कीट जोखिम विश्लेषण",
        irrigationAdvice: "सिंचाई सलाह",
        lowRisk: "सूखी स्थितियों के कारण कीट हमलों का कम जोखिम",
        moderateRisk: "मध्यम जोखिम - नियमित रूप से फसलों की निगरानी करें",
        highRisk: "उच्च जोखिम - निवारक उपायों पर विचार करें",
        extremeRisk: "अत्यधिक जोखिम - तत्काल कार्रवाई की आवश्यकता",
        reduceIrrigation: "हाल की बारिश के कारण सिंचाई की आवृत्ति कम करें",
        normalIrrigation: "सामान्य सिंचाई कार्यक्रम बनाए रखें",
        increaseIrrigation: "सिंचाई बढ़ाएं - सूखी स्थिति का पता चला",
        emergencyIrrigation: "आपातकालीन सिंचाई की आवश्यकता - अत्यधिक गर्मी का पता चला",
        
        // Pest Risk Analysis additional keys
        potentialRisks: "संभावित जोखिम",
        recommendations: "सिफारिशें",
        regularInspection: "नियमित फसल निरीक्षण",
        preventiveMeasures: "निवारक उपाय लागू करें",
        monitorWeather: "मौसम की स्थिति पर नजर रखें",
        biologicalControl: "जैविक नियंत्रण विधियों पर विचार करें",
        noRisks: "कोई विशिष्ट जोखिम नहीं मिला।",
        continueMonitoring: "नियमित निगरानी जारी रखें।",
        
        // Pest-specific risks translations
        aphidRisk: "एफिड जोखिम - गर्म + नम + बादल वाली स्थितियां एफिड प्रजनन का समर्थन करती हैं",
        whiteflyRisk: "सफेद मक्खी जोखिम - व्हाइटफ्लाई विकास के लिए आदर्श तापमान और आर्द्रता सीमा",
        spiderMiteRisk: "लाल मकड़ी घुन जोखिम - गर्म और सूखी स्थितियां मकड़ी घुन संक्रमण को बढ़ावा देती हैं",
        stemBorerRisk: "तना भेदक जोखिम - स्थिर और बादल मौसम तना भेदक गतिविधि बढ़ाता है",
        fungalRisk: "कवक रोग जोखिम - गीली और नम स्थितियां कवक वृद्धि को बढ़ावा देती हैं",
        thripsRisk: "थ्रिप्स जोखिम - गर्म, सूखी और हवादार स्थितियां थ्रिप्स संक्रमण का समर्थन करती हैं",
        leafhopperRisk: "पत्ती फुदका जोखिम - वर्षा के साथ मध्यम तापमान पत्ती फुदका गतिविधि बढ़ाता है",
        shootFlyRisk: "शूट फ्लाई जोखिम - सूखी स्थितियों के साथ मध्यम वर्षा शूट फ्लाई प्रजनन का समर्थन करती है",
        bollwormRisk: "बॉलवर्म जोखिम - उच्च आर्द्रता के साथ गर्म तापमान बॉलवर्म गतिविधि बढ़ाता है",
        armywormRisk: "आर्मीवर्म जोखिम - मध्यम तापमान के साथ नम और बारिश की स्थिति आर्मीवर्म प्रकोप का समर्थन करती है",
        
        // Irrigation advice translations
        irrigationRecommendation: "सिंचाई सिफारिश",
        weatherConditions: "मौसम की स्थिति",
        reduceWateringRain: "हाल की बारिश के कारण सिंचाई की आवृत्ति कम करें",
        maintainRegularWatering: "नियमित सिंचाई कार्यक्रम बनाए रखें",
        increaseWateringHighTemp: "सिंचाई की आवृत्ति बढ़ाएं - उच्च तापमान का पता चला",
        considerLightIrrigation: "हल्की सिंचाई पर विचार करें - नम स्थितियां",
        monitorSoilMoisture: "मिट्टी की नमी की निगरानी करें - हवादार स्थितियां",
        noIrrigationNeeded: "कोई अतिरिक्त सिंचाई की आवश्यकता नहीं",
        normalWeatherIrrigation: "मानक सिंचाई कार्यक्रम का पालन करें",
        
        // Detailed pest control recommendations
        aphidControlCheck: "एफिड नियंत्रण: प्रतिदिन पत्तों के नीचे की जांच करें, पीले चिपचिपे ट्रैप का उपयोग करें, नीम तेल स्प्रे (3-5मिली/लीटर पानी) लगाएं",
        aphidPredators: "प्राकृतिक शिकारी के रूप में लेडीबग और लेसविंग्स का परिचय दें",
        aphidFertilizer: "नाइट्रोजन के साथ अधिक उर्वरक न डालें क्योंकि यह एफिड प्रजनन को बढ़ावा देता है",
        aphidWaterSpray: "पौधों से एफिड को हटाने के लिए उच्च दबाव वाले पानी के स्प्रे का उपयोग करें",
        
        whiteflyTraps: "सफेद मक्खी प्रबंधन: पौधों के चारों ओर पीले चिपचिपे ट्रैप लगाएं (10-15 ट्रैप प्रति एकड़)",
        whiteflyMulch: "व्हाइटफ्लाई को भ्रमित करने के लिए प्रतिबिंबित मल्च लगाएं",
        whiteflyCompanion: "व्हाइटफ्लाई को दूर भगाने के लिए मैरीगोल्ड और तुलसी को साथी पौधे के रूप में लगाएं",
        whiteflySoap: "प्रभावित क्षेत्रों पर कीटनाशक साबुन समाधान (2-3% सांद्रता) छिड़कें",
        
        spiderMiteMisting: "मकड़ी घुन रोकथाम: बारीक धुंध के साथ पौधों के चारों ओर नमी बढ़ाएं",
        spiderMiteCheck: "पत्तों पर बारीक जाले की जांच के लिए आवर्धक लेंस का उपयोग करें",
        spiderMitePredators: "जैविक नियंत्रण के रूप में शिकारी घुन (फाइटोसीयूलस पर्सिमिलिस) लगाएं",
        spiderMiteWash: "घुन और अंडे हटाने के लिए हल्के साबुन के घोल से पत्तियों को धोएं",
        spiderMiteClean: "धूल भरी स्थितियों से बचें - क्षेत्र को साफ और हवादार रखें",
        
        stemBorerRemoval: "तना भेदक नियंत्रण: संक्रमित पौधे के हिस्सों को तुरंत हटाएं और नष्ट करें",
        stemBorerTraps: "वयस्क पतंगों की निगरानी और पकड़ने के लिए फेरोमोन ट्रैप का उपयोग करें",
        stemBorerWasps: "अंडे परजीवीकरण के लिए ट्राइकोग्रामा ततैया छोड़ें",
        stemBorerBt: "बढ़ते सिरों पर बीटी (बैसिलस थुरिंजेंसिस) आधारित जैव-कीटनाशक लगाएं",
        stemBorerRotation: "गैर-मेजबान पौधों के साथ फसल चक्रण का अभ्यास करें",
        
        fungalAirflow: "कवक रोग रोकथाम: पौधों के बीच हवा की आवाजाही में सुधार करें",
        fungalSunlight: "ओस को जल्दी सुखाने के लिए सुनिश्चित करें कि सुबह की धूप सभी पौधे के हिस्सों तक पहुंचे",
        fungalWatering: "मिट्टी के स्तर पर पानी दें, विशेष रूप से शाम में पत्तियों को गीला करने से बचें",
        fungalSpray: "निवारक कॉपर सल्फेट या पोटेशियम बाइकार्बोनेट स्प्रे लगाएं",
        fungalCleanup: "संक्रमित पौधे के मलबे को उचित तरीके से हटाएं और निपटान करें",
        
        thripsBlueTraps: "थ्रिप्स प्रबंधन: नीले चिपचिपे ट्रैप का उपयोग करें (थ्रिप्स पीले से ज्यादा नीले को पसंद करते हैं)",
        thripsDiatomaceous: "पौधे के आधार के चारों ओर डायटोमेसियस अर्थ लगाएं",
        thripsPredators: "शिकारी घुन और मिनट समुद्री डाकू कीड़ों को प्रोत्साहित करें",
        thripsMoisture: "पौधों पर तनाव कम करने के लिए पर्याप्त मिट्टी की नमी बनाए रखें",
        thripsNeem: "गंभीर संक्रमण के लिए पायरेथ्रिन के साथ मिश्रित नीम तेल का छिड़काव करें",
        
        leafhopperCovers: "पत्ती फुदका नियंत्रण: चरम गतिविधि अवधि के दौरान पंक्ति कवर का उपयोग करें",
        leafhopperWeeds: "वैकल्पिक मेजबान के रूप में काम करने वाले खरपतवार हटाएं",
        leafhopperClay: "पत्तियों को कम आकर्षक बनाने के लिए काओलिन मिट्टी का स्प्रे लगाएं",
        leafhopperPredators: "मकड़ियों और अन्य प्राकृतिक शिकारियों को प्रोत्साहित करें",
        leafhopperTape: "पत्ती फुदका को भ्रमित करने के लिए प्रतिबिंबित टेप या एल्यूमीनियम फॉयल स्ट्रिप्स का उपयोग करें",
        
        shootFlyEarly: "शूट फ्लाई रोकथाम: चरम मक्खी जनसंख्या से बचने के लिए फसलों की जल्दी बुवाई करें",
        shootFlyVarieties: "यदि उपलब्ध हो तो प्रतिरोधी किस्मों का उपयोग करें",
        shootFlyCarbofuran: "बुवाई के दौरान मिट्टी में कार्बोफुरान कण लगाएं",
        shootFlyYellowTraps: "पौधे की ऊंचाई पर पीले चिपचिपे ट्रैप लगाएं",
        shootFlyPlowing: "प्यूपा को गर्मी के संपर्क में लाने के लिए गहरी गर्मी की जुताई करें",
        
        bollwormEggs: "बॉलवर्म प्रबंधन: ऊपरी पत्ती की सतह पर अंडे के समूहों की जांच करें",
        bollwormLightTraps: "रात में वयस्क पतंगों को पकड़ने के लिए प्रकाश ट्रैप का उपयोग करें",
        bollwormTrichogramma: "ट्राइकोग्रामा कार्ड छोड़ें (2-3 कार्ड प्रति एकड़)",
        bollwormBt: "प्रारंभिक लार्वा चरणों के दौरान बीटी-आधारित जैविक कीटनाशक लगाएं",
        bollwormTrapCrops: "खेत की सीमाओं पर अरंडी या सूरजमुखी जैसी ट्रैप फसलें लगाएं",
        
        armywormTrenches: "आर्मीवर्म आपातकालीन प्रतिक्रिया: खेतों के चारों ओर बैरियर खाइयां लगाएं",
        armywormTraps: "जल्दी पता लगाने के लिए प्रकाश ट्रैप और फेरोमोन ट्रैप का उपयोग करें",
        armywormBurn: "सर्दियों में रहने वाले लार्वा को नष्ट करने के लिए ठूंठ और फसल अवशेष जलाएं",
        armywormBirds: "खेत में बैठने की जगह प्रदान करके पक्षियों को प्रोत्साहित करें",
        armywormNPV: "जैविक नियंत्रण के रूप में स्पोडोप्टेरा एनपीवी (न्यूक्लियर पॉलीहेड्रोसिस वायरस) लगाएं",
        armywormUrgent: "जल्दी कार्य करें - आर्मीवर्म 2-3 दिनों में फसलों को नष्ट कर सकते हैं",
        
        monitoringSchedule: "निगरानी कार्यक्रम: दिन में दो बार फसलों का निरीक्षण करें (सुबह जल्दी और शाम)",
        keepRecords: "कीट संख्या और लागू नियंत्रण उपायों का विस्तृत रिकॉर्ड रखें",
        contactOfficer: "गंभीर संक्रमण के लिए स्थानीय कृषि विस्तार अधिकारी से संपर्क करें",
        monitorWeatherPest: "मौसम की स्थिति पर नजर रखें क्योंकि वे कीट गतिविधि को सीधे प्रभावित करती हैं",
        
        // Weather Alerts
        heavyRain: "भारी बारिश चेतावनी",
        thunderstorm: "आंधी-तूफान अलर्ट",
        severeWeather: "गंभीर मौसम चेतावनी",
        flood: "बाढ़ चेतावनी",
        flashFlood: "अचानक बाढ़ अलर्ट",
        highWind: "तेज हवा चेतावनी",
        galeWind: "आंधी बल हवा अलर्ट",
        fog: "घना कोहरा चेतावनी",
        snowWarning: "बर्फबारी चेतावनी",
        blizzard: "बर्फीला तूफान अलर्ट",
        heatWave: "लू की लहर चेतावनी",
        extremeHeat: "अत्यधिक गर्मी अलर्ट",
        coldWave: "शीत लहर चेतावनी",
        frost: "पाला अलर्ट",
        freezing: "जमने वाली स्थितियां",
        weatherAlertFrom: "से:",
        weatherAlertTo: "तक:",
        weatherAlertSource: "स्रोत:",
        
        // Market Demand Page
        marketDemandTitle: "बाजार मांग और मूल्य अंतर्दृष्टि",
        searchCrop: "फसल खोजें",
        searchCropPlaceholder: "फसल का नाम टाइप करें (जैसे गेहूं, चावल, टमाटर...)",
        selectCrop: "फसल चुनें",
        selectState: "राज्य चुनें",
        selectMarket: "बाजार चुनें",
        state: "राज्य",
        market: "बाजार",
        priceTrendFor: "मूल्य प्रवृत्ति के लिए",
        last60Days: "पिछले 60 दिन",
        demandIndicator: "मांग संकेतक",
        currentDemand: "वर्तमान मांग",
        highDemand: "उच्च मांग",
        mandiComparison: "मंडी तुलना",
        market: "बाजार",
        currentPrice: "वर्तमान मूल्य",
        changeLastWeek: "परिवर्तन (पिछला सप्ताह)",
        smartShetiInsight: "स्मार्टशेती अंतर्दृष्टि",
        marketInsightText: "गेहूं के लिए बाजार की स्थिति वर्तमान में अनुकूल है, अधिकांश बाजारों में उच्च मांग और बढ़ती कीमतें हैं। रिटर्न को अधिकतम करने के लिए अगले 2-3 सप्ताह के भीतर बेचने पर विचार करें।",
        topDemandedVeggies: "शीर्ष 5 मांग वाली सब्जियां/फल",
        tomatoes: "टमाटर",
        onions: "प्याज",
        potatoes: "आलू",
        apples: "सेब",
        bananas: "केले",
        veryHigh: "बहुत उच्च",
        
        // Home Page
        empoweringFarmers: "स्मार्ट समाधानों के साथ किसानों को शक्तिशाली बनाना",
        smartShetiDescription: "SmartSheti आपको व्यक्तिगत फसल सुझाव, वास्तविक समय मौसम अपडेट और कृषि उत्पादों के लिए बाजार प्रदान करता है, सब कुछ एक स्थान पर।",
        getStarted: "शुरू करें",
        keyFeatures: "मुख्य विशेषताएं",
        featuresDescription: "अपने कृषि अनुभव को बेहतर बनाने के लिए डिज़ाइन की गई SmartSheti की मुख्य कार्यक्षमताओं का अन्वेषण करें।",
        cropSuggestionsTitle: "व्यक्तिगत फसल सुझाव",
        cropSuggestionsDescription: "अपने स्थान, मिट्टी के प्रकार और जलवायु स्थिति के आधार पर व्यक्तिगत फसल सिफारिशें प्राप्त करें।",
        weatherInformation: "वास्तविक समय मौसम की जानकारी",
        weatherDescription: "अपनी कृषि गतिविधियों को अनुकूलित करने के लिए अप-टू-डेट मौसम पूर्वानुमान और अलर्ट के साथ सूचित रहें।",
        marketplaceTitle: "कृषि बाजार",
        marketplaceDescription: "विश्वसनीय बाजार में अन्य किसानों और आपूर्तिकर्ताओं के साथ सीधे कृषि उत्पाद खरीदें और बेचें।",
        discoverMarketplace: "बाजार की खोज करें",
        marketplaceBrowse: "बीज और उर्वरक से लेकर उपकरण और औजारों तक कृषि उत्पादों की एक विस्तृत श्रृंखला ब्राउज़ करें।",
        exploreMarketplace: "बाजार का अन्वेषण करें",
        smartShetiDescription: "SmartSheti आपको अपने स्थान, मिट्टी के प्रकार और जलवायु स्थिति के आधार पर व्यक्तिगत फसल सुझाव, वास्तविक समय में मौसम की अपडेट और कृषि उत्पादों के लिए बाजार स्थान प्रदान करता है, सब कुछ एक स्थान पर।",
        keyFeatures: "मुख्य विशेषताएं",
        featuresDescription: "किसानों के लिए अपनी कृषि अनुभव को बेहतर बनाने के लिए डिज़ाइन की गई SmartSheti की मूल कार्यक्षमताओं का अनुसन्धान करें।",
        cropSuggestions: "व्यक्तिगत फसल सुझाव",
        cropSuggestionsDescription: "अपने स्थान, मिट्टी के प्रकार और जलवायु स्थिति के आधार पर व्यक्तिगत फसल सुझाव प्राप्त करें।",
        weatherInformation: "वास्तविक समय में मौसम की जानकारी",
        weatherDescription: "अपनी कृषि गतिविधियों को अधिक से अधिक बेहतर बनाने के लिए अपडेट मौसम की अपडेट और चेतावनियों से अपनी जानकारी अपडेट करें।",
        marketplace: "बाजार",
        marketplaceDescription: "विश्वसनीय बाजार में अन्य किसानों और आपूर्तिकर्ताओं के साथ सीधे कृषि उत्पाद खरीदें और बेचें।",
        discoverMarketplace: "बाजार का अन्वेषण करें",
        marketplaceBrowse: "बीज, उर्वरक से उपकरण और उपकरण तक व्यापक श्रृंखला के कृषि उत्पादों का ब्राउज़ करें।",
        exploreMarketplace: "बाजार का अन्वेषण करें",
        
        // Footer
        aboutUs: "हमारे बारे में",
        contact: "संपर्क",
        privacyPolicy: "गोपनीयता नीति",
        termsOfService: "सेवा की शर्तें",
        copyright: "© 2024 SmartSheti. सर्वाधिकार सुरक्षित."
    },
    mr: {
        // Header
        home: "होम",
        weather: "हवामान",
        marketplace: "बाजार",
        marketDemand: "बाजार विनंद",
        profile: "प्रोफाइल",
        settings: "सेटिंग्स",
        dashboard: "डॅशबोर्ड",
        logout: "लॉग आउट",
        notifications: "अधिसूचना",
        
        // General
        search: "शोधा",
        searchPlaceholder: "शोधा...",
        noResults: "कोणतीही निकाल नाही मिळाली",
        
        // Crop Suggestion
        getCropSuggestions: "पीक सूचना मिळवा",
        location: "स्थान",
        enterLocation: "तुमचे स्थान प्रविष्ट करा",
        soilType: "मातीचा प्रकार",
        selectSoilType: "मातीचा प्रकार निवडा",
        landSize: "जमिनीचा आकार (एकरात)",
        enterLandSize: "जमिनीचा आकार प्रविष्ट करा",
        irrigationType: "सिंचनाचा प्रकार",
        selectIrrigationType: "सिंचनाचा प्रकार निवडा",
        getSuggestions: "सूचना मिळवा",
        suggestedCrops: "सूचित पिके",
        expectedYield: "अपेक्षित उत्पादन",
        profitability: "नफा",
        growingSeason: "वाढीचा हंगाम",
        high: "उच्च",
        medium: "मध्यम",
        low: "कमी",
        winter: "हिवाळा",
        monsoon: "पावसाळा",
        summer: "उन्हाळा",
        allYear: "संपूर्ण वर्ष",
        wheat: "गहू",
        rice: "तांदूळ",
        cotton: "कापूस",
        sugarcane: "ऊस",
        quintal: "क्विंटल",
        
        // Weather
        currentLocation: "सध्याचे स्थान",
        loadingDate: "तारीख लोड होत आहे...",
        feelsLike: "जसे वाटते",
        humidity: "आर्द्रता",
        wind: "वारा",
        pressure: "दाब",
        sunrise: "सूर्योदय",
        sunset: "सूर्यास्त",
        weatherAlerts: "हवामान चेतावणी",
        noAlerts: "कोणतीही सक्रिय हवामान चेतावणी नाही",
        forecastTitle: "7-दिवसीय अंदाज",
        noForecast: "अंदाज डेटा उपलब्ध नाही",
        max: "कमाल",
        min: "किमान",
        currentWeather: "सध्याचे हवामान",
        pestRiskAnalysis: "कीड जोखीम विश्लेषण",
        irrigationAdvice: "सिंचन सल्ला",
        lowRisk: "कोरड्या परिस्थितीमुळे कीड हल्ल्याचा कमी धोका",
        moderateRisk: "मध्यम जोखीम - नियमितपणे पिकांचे निरीक्षण करा",
        highRisk: "उच्च जोखीम - प्रतिबंधात्मक उपायांचा विचार करा",
        extremeRisk: "अत्यधिक जोखीम - तत्काळ कारवाई आवश्यक",
        reduceIrrigation: "अलीकडील पावसामुळे सिंचनाची वारंवारता कमी करा",
        normalIrrigation: "सामान्य सिंचन वेळापत्रक राखा",
        increaseIrrigation: "सिंचन वाढवा - कोरडी परिस्थिती आढळली",
        emergencyIrrigation: "आपत्कालीन सिंचन आवश्यक - अत्यधिक उष्णता आढळली",
        
        // Pest Risk Analysis additional keys
        potentialRisks: "संभाव्य जोखीम",
        recommendations: "शिफारसी",
        regularInspection: "नियमित पीक तपासणी",
        preventiveMeasures: "प्रतिबंधात्मक उपाय लागू करा",
        monitorWeather: "हवामानाची परिस्थिती लक्षात ठेवा",
        biologicalControl: "जैविक नियंत्रण पद्धतींचा विचार करा",
        noRisks: "कोणतेही विशिष्ट जोखीम आढळले नाही.",
        continueMonitoring: "नियमित देखरेख सुरू ठेवा.",
        
        // Pest-specific risks translations
        aphidRisk: "एफिड धोका - उबदार + ओलसर + ढगाळ परिस्थिती एफिड प्रजननास अनुकूल",
        whiteflyRisk: "पांढरी मक्खी धोका - व्हाइटफ्लाय विकासासाठी आदर्श तापमान आणि आर्द्रता श्रेणी",
        spiderMiteRisk: "लाल कोळी माइट धोका - गरम आणि कोरडी परिस्थिती कोळी माइट संसर्गास प्रोत्साहन देते",
        stemBorerRisk: "स्टेम बोरर धोका - स्थिर आणि ढगाळ हवामान स्टेम बोरर क्रियाकलाप वाढवते",
        fungalRisk: "बुरशी रोग धोका - ओले आणि ओलसर वातावरण बुरशी वाढीस प्रोत्साहन देते",
        thripsRisk: "थ्रिप्स धोका - गरम, कोरडी आणि वारयुक्त परिस्थिती थ्रिप्स संसर्गास अनुकूल",
        leafhopperRisk: "लीफहॉपर धोका - पावसासह मध्यम तापमान लीफहॉपर क्रियाकलाप वाढवते",
        shootFlyRisk: "शूट फ्लाय धोका - कोरड्या परिस्थितीसह मध्यम पाऊस शूट फ्लाय प्रजननास अनुकूल",
        bollwormRisk: "बॉलवर्म धोका - उच्च आर्द्रतेसह उबदार तापमान बॉलवर्म क्रियाकलाप वाढवते",
        armywormRisk: "आर्मीवर्म धोका - मध्यम तापमानासह ओलसर आणि पावसाळी परिस्थिती आर्मीवर्म प्रादुर्भावास अनुकूल",
        
        // Irrigation advice translations
        irrigationRecommendation: "सिंचन शिफारस",
        weatherConditions: "हवामान परिस्थिती",
        reduceWateringRain: "अलीकडील पावसामुळे सिंचनाची वारंवारता कमी करा",
        maintainRegularWatering: "नियमित सिंचन वेळापत्रक राखा",
        increaseWateringHighTemp: "सिंचनाची वारंवारता वाढवा - उच्च तापमान आढळले",
        considerLightIrrigation: "हलके सिंचन विचारात घ्या - ओलसर परिस्थिती",
        monitorSoilMoisture: "मातीच्या ओलाव्याचे निरीक्षण करा - वारयुक्त परिस्थिती",
        noIrrigationNeeded: "अतिरिक्त सिंचनाची आवश्यकता नाही",
        normalWeatherIrrigation: "मानक सिंचन वेळापत्रकाचे पालन करा",
        
        // Detailed pest control recommendations
        aphidControlCheck: "एफिड नियंत्रण: दररोज पानांच्या खालच्या बाजूची तपासणी करा, पिवळे चिकट सापळे वापरा, कडुनिंब तेल फवारणी (3-5मिली/लीटर पाणी) लावा",
        aphidPredators: "नैसर्गिक भक्षक म्हणून लेडीबग आणि लेसविंग्सचा परिचय करा",
        aphidFertilizer: "नायट्रोजनसह जास्त खत टाकू नका कारण ते एफिड प्रजननास प्रोत्साहन देते",
        aphidWaterSpray: "झाडांवरून एफिड काढून टाकण्यासाठी उच्च दाबाच्या पाण्याच्या फवारणीचा वापर करा",
        
        whiteflyTraps: "पांढरी मक्खी व्यवस्थापन: झाडांभोवती पिवळे चिकट सापळे बसवा (10-15 सापळे प्रति एकर)",
        whiteflyMulch: "व्हाइटफ्लाय गोंधळात टाकण्यासाठी परावर्तक आच्छादन लावा",
        whiteflyCompanion: "व्हाइटफ्लाय दूर ठेवण्यासाठी मॅरीगोल्ड आणि तुळस सोबती वनस्पती म्हणून लावा",
        whiteflySoap: "बाधित भागांवर कीटकनाशक साबण द्रावण (2-3% एकाग्रता) फवारा",
        
        spiderMiteMisting: "कोळी माइट प्रतिबंध: बारीक धुक्याने झाडांभोवती आर्द्रता वाढवा",
        spiderMiteCheck: "पानांवर बारीक जाळ्याच्या तपासणीसाठी भिंग वापरा",
        spiderMitePredators: "जैविक नियंत्रण म्हणून भक्षक माइट (फायटोसियुलस पर्सिमिलिस) लावा",
        spiderMiteWash: "माइट आणि अंडी काढून टाकण्यासाठी हलक्या साबणाच्या द्रावणाने पाने धुवा",
        spiderMiteClean: "धूळ भरलेल्या परिस्थिती टाळा - क्षेत्र स्वच्छ आणि हवादार ठेवा",
        
        stemBorerRemoval: "स्टेम बोरर नियंत्रण: संक्रमित झाडाचे भाग लगेच काढून टाका आणि नष्ट करा",
        stemBorerTraps: "प्रौढ पतंगांच्या देखरेख आणि पकडण्यासाठी फेरोमोन सापळे वापरा",
        stemBorerWasps: "अंडी परजीवीकरणासाठी ट्रायकोग्रामा कुंडी सोडा",
        stemBorerBt: "वाढत्या टोकांवर बीटी (बॅसिलस थुरिंजेन्सिस) आधारित जैव-कीटकनाशक लावा",
        stemBorerRotation: "नॉन-होस्ट झाडांसह पीक आवर्तनाचा सराव करा",
        
        fungalAirflow: "बुरशी रोग प्रतिबंध: झाडांमधील हवा प्रवाह सुधारा",
        fungalSunlight: "दव लवकर सुकवण्यासाठी सकाळची सूर्यप्रकाश सर्व झाडाच्या भागांपर्यंत पोहोचल्याची खात्री करा",
        fungalWatering: "मातीच्या पातळीवर पाणी द्या, विशेषतः संध्याकाळी पाने ओले करणे टाळा",
        fungalSpray: "प्रतिबंधात्मक कॉपर सल्फेट किंवा पोटॅशियम बायकार्बोनेट फवारणी लावा",
        fungalCleanup: "संक्रमित झाडाचा ढिगारा योग्य प्रकारे काढा आणि विल्हेवाट लावा",
        
        thripsBlueTraps: "थ्रिप्स व्यवस्थापन: निळे चिकट सापळे वापरा (थ्रिप्स पिवळ्यापेक्षा निळ्याला प्राधान्य देतात)",
        thripsDiatomaceous: "झाडाच्या पायथ्याभोवती डायटोमेसियस अर्थ लावा",
        thripsPredators: "भक्षक माइट आणि मिनिट पायरेट बग्सना प्रोत्साहन द्या",
        thripsMoisture: "झाडांवरील ताण कमी करण्यासाठी पुरेशी मातीची आर्द्रता राखा",
        thripsNeem: "गंभीर संसर्गासाठी पायरेथ्रिनमध्ये मिसळून कडुनिंब तेल फवारा",
        
        leafhopperCovers: "लीफहॉपर नियंत्रण: शिखर क्रियाकलाप कालावधी दरम्यान पंक्ती आवरण वापरा",
        leafhopperWeeds: "वैकल्पिक यजमान म्हणून काम करणारी तण काढा",
        leafhopperClay: "पाने कमी आकर्षक करण्यासाठी काओलिन मातीचा फवारा लावा",
        leafhopperPredators: "कोळी आणि इतर नैसर्गिक भक्षकांना प्रोत्साहन द्या",
        leafhopperTape: "लीफहॉपर गोंधळात टाकण्यासाठी परावर्तक टेप किंवा अॅल्युमिनियम फॉइल पट्ट्या वापरा",
        
        shootFlyEarly: "शूट फ्लाय प्रतिबंध: शिखर मक्खी लोकसंख्या टाळण्यासाठी पिके लवकर पेरा",
        shootFlyVarieties: "उपलब्ध असल्यास प्रतिरोधक जाती वापरा",
        shootFlyCarbofuran: "पेरणीच्या वेळी मातीत कार्बोफुरान कण लावा",
        shootFlyYellowTraps: "झाडाच्या उंचीवर पिवळे चिकट सापळे बसवा",
        shootFlyPlowing: "प्युपा उष्णतेच्या संपर्कात आणण्यासाठी खोल उन्हाळी नांगरणी करा",
        
        bollwormEggs: "बॉलवर्म व्यवस्थापन: वरच्या पानाच्या पृष्ठभागावर अंड्यांच्या समूहांची तपासणी करा",
        bollwormLightTraps: "रात्री प्रौढ पतंग पकडण्यासाठी प्रकाश सापळे वापरा",
        bollwormTrichogramma: "ट्रायकोग्रामा कार्ड सोडा (2-3 कार्ड प्रति एकर)",
        bollwormBt: "सुरुवातीच्या अळी टप्प्यात बीटी-आधारित जैविक कीटकनाशक लावा",
        bollwormTrapCrops: "शेताच्या सीमेवर एरंड किंवा सूर्यफूल सारख्या सापळा पिके लावा",
        
        armywormTrenches: "आर्मीवर्म आपत्कालीन प्रतिसाद: शेतांभोवती अडथळा खंदक लावा",
        armywormTraps: "लवकर शोधण्यासाठी प्रकाश सापळे आणि फेरोमोन सापळे वापरा",
        armywormBurn: "हिवाळ्यात राहणाऱ्या अळ्या नष्ट करण्यासाठी नाडी आणि पीक अवशेष जाळा",
        armywormBirds: "शेतात बसण्याची जागा देऊन पक्ष्यांना प्रोत्साहन द्या",
        armywormNPV: "जैविक नियंत्रण म्हणून स्पोडोप्टेरा एनपीव्ही (न्यूक्लियर पॉलिहेड्रोसिस व्हायरस) लावा",
        armywormUrgent: "लवकर कृती करा - आर्मीवर्म 2-3 दिवसांत पिके नष्ट करू शकतात",
        
        monitoringSchedule: "देखरेख वेळापत्रक: दिवसातून दोनदा पिकांची तपासणी करा (पहाटे आणि संध्याकाळी)",
        keepRecords: "कीटकांची संख्या आणि लागू केलेल्या नियंत्रण उपायांचा तपशीलवार रेकॉर्ड ठेवा",
        contactOfficer: "गंभीर संसर्गासाठी स्थानिक कृषी विस्तार अधिकाऱ्याशी संपर्क साधा",
        monitorWeatherPest: "हवामान परिस्थितीचे निरीक्षण करा कारण ते कीटक क्रियाकलापांवर थेट परिणाम करतात",
        
        // Weather Alerts
        heavyRain: "मुसळधार पावसाची चेतावणी",
        thunderstorm: "गडगडाटी वादळाचा इशारा",
        severeWeather: "गंभीर हवामान चेतावणी",
        flood: "पूर चेतावणी",
        flashFlood: "अचानक पूराचा इशारा",
        highWind: "जोरदार वाऱ्याची चेतावणी",
        galeWind: "वादळी वाऱ्याचा इशारा",
        fog: "दाट धुक्याची चेतावणी",
        snowWarning: "बर्फवृष्टीची चेतावणी",
        blizzard: "हिमवादळाचा इशारा",
        heatWave: "उष्णतेच्या लाटेची चेतावणी",
        extremeHeat: "अति उष्णतेचा इशारा",
        coldWave: "थंडीच्या लाटेची चेतावणी",
        frost: "कडकी कोसळण्याचा इशारा",
        freezing: "गोठण्याची परिस्थिती",
        weatherAlertFrom: "पासून:",
        weatherAlertTo: "पर्यंत:",
        weatherAlertSource: "स्रोत:",
        
        // Market Demand Page
        marketDemandTitle: "बाजार मागणी आणि किंमत अंतर्दृष्टी",
        searchCrop: "पीक शोधा",
        searchCropPlaceholder: "पिकाचे नाव टाईप करा (उदा. गहू, तांदूळ, टोमॅटो...)",
        selectCrop: "पीक निवडा",
        selectState: "राज्य निवडा",
        selectMarket: "बाजार निवडा",
        state: "राज्य",
        market: "बाजार",
        priceTrendFor: "किंमत ट्रेंड यासाठी",
        last60Days: "गेल्या 60 दिवस",
        demandIndicator: "मागणी सूचक",
        currentDemand: "सध्याची मागणी",
        highDemand: "उच्च मागणी",
        mandiComparison: "मंडी तुलना",
        market: "बाजार",
        currentPrice: "सध्याची किंमत",
        changeLastWeek: "बदल (गेला आठवडा)",
        smartShetiInsight: "स्मार्टशेती अंतर्दृष्टी",
        marketInsightText: "गहूसाठी बाजारातील परिस्थिती सध्या अनुकूल आहे, बहुतेक बाजारांमध्ये उच्च मागणी आणि वाढत्या किमती आहेत. परतावा वाढवण्यासाठी पुढील 2-3 आठवड्यांत विक्री करण्याचा विचार करा.",
        topDemandedVeggies: "टॉप 5 मागणी असलेल्या भाज्या/फळे",
        tomatoes: "टोमॅटो",
        onions: "कांदे",
        potatoes: "बटाटे",
        apples: "सफरचंद",
        bananas: "केळी",
        veryHigh: "खूप जास्त",
        
        // Home Page
        empoweringFarmers: "स्मार्ट सोल्यूशन्ससह शेतकऱ्यांना सक्षम बनवणे",
        smartShetiDescription: "SmartSheti तुमच्या स्थानावर, मातीच्या प्रकारावर आणि हवामान परिस्थितीवर आधारित वैयक्तिक पीक सूचना, रिअल-टाइम हवामान अपडेट आणि कृषी उत्पादनांसाठी बाजारपेठ प्रदान करते, सर्व एकाच ठिकाणी.",
        getStarted: "सुरुवात करा",
        keyFeatures: "मुख्य वैशिष्ट्ये",
        featuresDescription: "तुमच्या शेतीच्या अनुभवाला वाढविण्यासाठी डिझाइन केलेल्या SmartSheti च्या मुख्य कार्यक्षमतांचा शोध घ्या.",
        cropSuggestionsTitle: "वैयक्तिक पीक सूचना",
        cropSuggestionsDescription: "तुमच्या स्थानावर, मातीच्या प्रकारावर आणि हवामान परिस्थितीवर आधारित तयार केलेल्या पीक शिफारसी मिळवा.",
        weatherInformation: "रिअल-टाइम हवामान माहिती",
        weatherDescription: "तुमच्या शेतीच्या क्रियाकलापांना अनुकूल करण्यासाठी अद्ययावत हवामान अंदाज आणि सूचनांसह माहिती घ्या.",
        marketplaceTitle: "कृषी बाजारपेठ",
        marketplaceDescription: "विश्वसनीय बाजारपेठेत इतर शेतकरी आणि पुरवठादारांसह थेट कृषी उत्पादने खरेदी आणि विक्री करा.",
        discoverMarketplace: "बाजारपेठ शोधा",
        marketplaceBrowse: "बियाणे आणि खतांपासून ते उपकरणे आणि साधनांपर्यंत कृषी उत्पादनांची विस्तृत श्रेणी ब्राउझ करा.",
        exploreMarketplace: "बाजारपेठ एक्सप्लोर करा",
        smartShetiDescription: "SmartSheti तुमच्या स्थळात, मिट्टीच्या प्रकारात आणि जलवायु परिस्थितीत आधारित व्यक्तिगत फसल सुचना, वास्तविक काळातील हवामान अपडेट आणि कृषी उत्पादांसाठी बाजारस्थान प्रदान करते, सर्व एक जागीत.",
        keyFeatures: "महत्त्वाची वैशिष्ट्ये",
        featuresDescription: "किसानांसाठी त्यांच्या कृषी अनुभव बेहतर करण्यासाठी डिझाइन केलेल्या SmartSheti च्या मूळ कार्यक्षमता शोधा.",
        cropSuggestions: "व्यक्तिगत फसल सुचना",
        cropSuggestionsDescription: "तुमच्या स्थळात, मिट्टीच्या प्रकारात आणि जलवायु परिस्थितीत आधारित व्यक्तिगत फसल सुचना मिळवा.",
        weatherInformation: "वास्तविक काळातील हवामान माहिती",
        weatherDescription: "तुमच्या कृषी कामकाज अधिक अधिक बेहतर करण्यासाठी अपडेट हवामान अपडेट आणि चेतावणी शिका.",
        marketplace: "बाजार",
        marketplaceDescription: "विश्वसनीय बाजारात इतर किसानां आणि आपूर्तिकर्तांशी सीध्यांना कृषी उत्पाद खरेदी करा आणि विक्री करा.",
        discoverMarketplace: "बाजार शोधा",
        marketplaceBrowse: "बीज, उर्वरक ते उपकरण आणि उपकरण यांच्या व्यापक श्रृंखला कृषी उत्पाद ब्राऊझ करा.",
        exploreMarketplace: "बाजार शोधा",
        
        // Footer
        aboutUs: "आमच्याबद्दल",
        contact: "संपर्क",
        privacyPolicy: "गोपनीयता नीती",
        termsOfService: "सेवा शर्ते",
        copyright: "© 2024 SmartSheti. सर्वाधिकार सुरक्षित."
    }
};

// Current language
let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

// Translation cache for API results
const translationCache = new Map();
const TRANSLATION_API_URL = 'http://localhost:5001/api/translate';
let apiAvailable = false;

// Check if Translation API is available
async function checkTranslationAPI() {
    try {
        const response = await fetch('http://localhost:5001/api/health', { 
            method: 'GET',
            signal: AbortSignal.timeout(1000)
        });
        apiAvailable = response.ok;
        if (apiAvailable) {
            console.log('✅ Translation API is available - new words will be auto-translated');
        }
    } catch (error) {
        apiAvailable = false;
        console.log('ℹ️ Translation API offline - using static translations only');
    }
    return apiAvailable;
}

// Translate using API
async function translateWithAPI(text, targetLang) {
    const cacheKey = `${text}|en|${targetLang}`;
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }
    
    try {
        const response = await fetch(TRANSLATION_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                source: 'en',
                target: targetLang
            }),
            signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.translated) {
                translationCache.set(cacheKey, data.translated);
                return data.translated;
            }
        }
    } catch (error) {
        // Silently fail and return original
    }
    
    return null;
}

// Auto-translate text content by matching English text
async function autoTranslateText(text, targetLang) {
    const t = translations[targetLang] || translations['en'];
    const normalizedText = text.trim().toLowerCase();
    
    // Step 1: Search for exact match in static translations
    for (const [key, value] of Object.entries(translations['en'])) {
        if (value.toLowerCase() === normalizedText) {
            return t[key] || text;
        }
    }
    
    // Step 2: Search for partial match in static translations
    for (const [key, value] of Object.entries(translations['en'])) {
        if (normalizedText.includes(value.toLowerCase()) || value.toLowerCase().includes(normalizedText)) {
            return t[key] || text;
        }
    }
    
    // Step 3: Try API translation for new words (if available)
    if (apiAvailable && targetLang !== 'en') {
        const apiTranslation = await translateWithAPI(text, targetLang);
        if (apiTranslation) {
            console.log(`🌐 API translated: "${text}" → "${apiTranslation}"`);
            return apiTranslation;
        }
    }
    
    return text; // Return original if no translation found
}

// Enhanced translation function with AUTO-TRANSLATION
async function translatePage(lang) {
    try {
        if (lang) {
            currentLanguage = lang;
            localStorage.setItem('preferredLanguage', currentLanguage);
        }
        
        const t = translations[currentLanguage] || translations['en'];
        console.log(`🌐 Translating page to: ${currentLanguage}`);
        
        // Update language indicator
        const currentLangElement = document.getElementById('currentLang');
        if (currentLangElement) {
            currentLangElement.textContent = currentLanguage.toUpperCase();
        }
        
        let translatedCount = 0;
        
        // Translate elements with data-translate attributes
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (t[key]) {
                element.textContent = t[key];
                translatedCount++;
            } else if (key) {
                console.warn(`Translation key not found: "${key}"`);
            }
        });
        
        // Also support data-i18n attributes (for compatibility)
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
                translatedCount++;
            } else if (key) {
                console.warn(`Translation key not found: "${key}"`);
            }
        });
        
        // AUTO-TRANSLATE: Find and translate text without attributes
        if (currentLanguage !== 'en') {
            // Target common text elements
            const textElements = document.querySelectorAll('a, button, h1, h2, h3, h4, h5, h6, p, span, label, td, th, div.text, li');
            
            // Process translations in parallel for better performance
            const translationPromises = [];
            
            textElements.forEach(element => {
                // Skip if already has translation attribute
                if (element.hasAttribute('data-translate') || element.hasAttribute('data-i18n')) {
                    return;
                }
                
                // Skip if marked as no-translate
                if (element.hasAttribute('data-no-translate')) {
                    return;
                }
                
                // Skip if element has children (only translate leaf nodes)
                if (element.children.length > 0) {
                    return;
                }
                
                // Skip empty or very short text
                const text = element.textContent.trim();
                if (!text || text.length < 2) {
                    return;
                }
                
                // Skip if contains numbers only or special characters only
                if (/^[\d\s\-\+\(\)]+$/.test(text) || /^[^\w\s]+$/.test(text)) {
                    return;
                }
                
                // Store original text if not already stored
                if (!element.hasAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', text);
                }
                
                // Try to auto-translate (async)
                const promise = autoTranslateText(text, currentLanguage).then(translated => {
                    if (translated !== text) {
                        element.textContent = translated;
                        translatedCount++;
                    }
                });
                
                translationPromises.push(promise);
            });
            
            // Wait for all translations to complete
            await Promise.all(translationPromises);
        } else {
            // Restore original text when switching back to English
            document.querySelectorAll('[data-original-text]').forEach(element => {
                const originalText = element.getAttribute('data-original-text');
                if (originalText) {
                    element.textContent = originalText;
                }
            });
        }
        
        // Translate placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (t[key]) {
                element.placeholder = t[key];
                translatedCount++;
            } else if (key) {
                console.warn(`Translation placeholder key not found: "${key}"`);
            }
        });
        
        // Auto-translate placeholders
        if (currentLanguage !== 'en') {
            const placeholderPromises = [];
            
            document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(element => {
                if (!element.hasAttribute('data-translate-placeholder')) {
                    const placeholder = element.placeholder;
                    if (!element.hasAttribute('data-original-placeholder')) {
                        element.setAttribute('data-original-placeholder', placeholder);
                    }
                    
                    const promise = autoTranslateText(placeholder, currentLanguage).then(translated => {
                        if (translated !== placeholder) {
                            element.placeholder = translated;
                            translatedCount++;
                        }
                    });
                    
                    placeholderPromises.push(promise);
                }
            });
            
            await Promise.all(placeholderPromises);
        } else {
            // Restore original placeholders
            document.querySelectorAll('[data-original-placeholder]').forEach(element => {
                const original = element.getAttribute('data-original-placeholder');
                if (original) {
                    element.placeholder = original;
                }
            });
        }
        
        // Translate option elements
        document.querySelectorAll('option[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (t[key]) {
                element.textContent = t[key];
                translatedCount++;
            } else if (key) {
                console.warn(`Translation option key not found: "${key}"`);
            }
        });
        
        console.log(`✅ Translated ${translatedCount} elements to ${currentLanguage}`);
        
        // Dispatch custom event to notify other scripts
        window.dispatchEvent(new CustomEvent('pageTranslated', { 
            detail: { language: currentLanguage, translatedCount } 
        }));
        
    } catch (error) {
        console.error('Error in translatePage:', error);
    }
}

// Enhanced pest risk translation function
function getTranslatedPestRisks(temperature, humidity) {
    const t = translations[currentLanguage] || translations['en'];
    
    if (temperature > 35 && humidity > 70) {
        return t.extremeRisk;
    } else if (temperature > 30 && humidity > 60) {
        return t.highRisk;
    } else if (temperature > 25 && humidity > 50) {
        return t.moderateRisk;
    } else {
        return t.lowRisk;
    }
}

// Enhanced irrigation advice translation function
function getTranslatedIrrigationAdvice(temperature, humidity, rainfall) {
    const t = translations[currentLanguage] || translations['en'];
    
    if (temperature > 35) {
        return t.emergencyIrrigation;
    } else if (rainfall > 5) {
        return t.reduceIrrigation;
    } else if (temperature > 25 && humidity < 50) {
        return t.increaseIrrigation;
    } else {
        return t.normalIrrigation;
    }
}

// Setup language dropdown functionality
function setupLanguageDropdown() {
    const translateBtn = document.getElementById('translateBtn');
    const translateBtnMobile = document.getElementById('translateBtnMobile');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentLangElement = document.getElementById('currentLang');
    const currentLangMobileElement = document.getElementById('currentLangMobile');
    
    if (!translateBtn || !languageDropdown) {
        console.warn('⚠️ Translation elements not found. Translation button will not work.');
        return;
    }
    
    console.log('🔧 Setting up language dropdown...');
    
    // Set initial language display
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    if (currentLangElement) {
        currentLangElement.textContent = savedLang.toUpperCase();
        // Prevent this element from being auto-translated
        currentLangElement.setAttribute('data-no-translate', 'true');
    }
    if (currentLangMobileElement) {
        currentLangMobileElement.textContent = savedLang.toUpperCase();
        currentLangMobileElement.setAttribute('data-no-translate', 'true');
    }
    
    // Ensure dropdown is initially hidden
    languageDropdown.classList.add('hidden');
    
    // Toggle language dropdown - prevent event propagation
    translateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🌐 Translation button clicked');
        
        // Toggle visibility
        languageDropdown.classList.toggle('hidden');
        console.log(languageDropdown.classList.contains('hidden') ? '🔼 Dropdown hidden' : '🔽 Dropdown shown');
    });
    
    // Mobile translate button - cycle through languages
    if (translateBtnMobile) {
        translateBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🌐 Mobile translation button clicked');
            
            // Cycle through languages: en -> hi -> mr -> en
            const currentLang = localStorage.getItem('preferredLanguage') || 'en';
            let nextLang = 'en';
            
            if (currentLang === 'en') {
                nextLang = 'hi';
            } else if (currentLang === 'hi') {
                nextLang = 'mr';
            } else {
                nextLang = 'en';
            }
            
            console.log(`🌍 Switching from ${currentLang} to ${nextLang}`);
            translatePage(nextLang);
            
            // Update both language indicators
            if (currentLangElement) {
                currentLangElement.textContent = nextLang.toUpperCase();
            }
            if (currentLangMobileElement) {
                currentLangMobileElement.textContent = nextLang.toUpperCase();
            }
        });
    }

    // Handle language selection
    const languageLinks = languageDropdown.querySelectorAll('a[data-lang]');
    console.log(`Found ${languageLinks.length} language options`);
    
    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const lang = link.getAttribute('data-lang');
            console.log(`🌍 Language selected: ${lang}`);
            
            // Apply translation
            translatePage(lang);
            
            // Hide dropdown
            languageDropdown.classList.add('hidden');
            
            // Update button text (both desktop and mobile)
            const currentLangElement = document.getElementById('currentLang');
            const currentLangMobileElement = document.getElementById('currentLangMobile');
            if (currentLangElement) {
                currentLangElement.textContent = lang.toUpperCase();
            }
            if (currentLangMobileElement) {
                currentLangMobileElement.textContent = lang.toUpperCase();
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!translateBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
            languageDropdown.classList.add('hidden');
        }
    });
    
    console.log('✅ Language dropdown setup complete');
}

// Initialize translation API check on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => checkTranslationAPI());
} else {
    checkTranslationAPI();
}

// Reset to English (useful for debugging)
function resetToEnglish() {
    localStorage.setItem('preferredLanguage', 'en');
    translatePage('en');
    console.log('🔄 Reset to English');
}

// Export functions for global use
window.translations = translations;
window.translatePage = translatePage;
window.getTranslatedPestRisks = getTranslatedPestRisks;
window.getTranslatedIrrigationAdvice = getTranslatedIrrigationAdvice;
window.setupLanguageDropdown = setupLanguageDropdown;
window.getCurrentLanguage = () => currentLanguage;
window.checkTranslationAPI = checkTranslationAPI;
window.resetToEnglish = resetToEnglish;
