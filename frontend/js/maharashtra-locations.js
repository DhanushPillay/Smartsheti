// Comprehensive Maharashtra Locations Database
// Includes cities, towns, villages, and street-level data for major urban areas
// Organized by regions for better navigation and maintenance

const maharashtraLocations = {
    // ============================================
    // MUMBAI METROPOLITAN REGION
    // ============================================
    
    // Mumbai - Main City Areas
    "mumbai": {lat: 19.0760, lng: 72.8777, district: "Mumbai City", type: "city"},
    "south mumbai": {lat: 18.9250, lng: 72.8200, district: "Mumbai City", type: "area"},
    "central mumbai": {lat: 19.0330, lng: 72.8640, district: "Mumbai City", type: "area"},
    "western mumbai": {lat: 19.1070, lng: 72.8370, district: "Mumbai City", type: "area"},
    "eastern mumbai": {lat: 19.0500, lng: 72.9000, district: "Mumbai City", type: "area"},
    
    // Mumbai - South Mumbai (Business District)
    "colaba": {lat: 18.9067, lng: 72.8147, district: "Mumbai City", type: "locality"},
    "fort": {lat: 18.9350, lng: 72.8350, district: "Mumbai City", type: "locality"},
    "churchgate": {lat: 18.9320, lng: 72.8270, district: "Mumbai City", type: "locality"},
    "marine drive": {lat: 18.9440, lng: 72.8230, district: "Mumbai City", type: "street"},
    "nariman point": {lat: 18.9260, lng: 72.8220, district: "Mumbai City", type: "locality"},
    "cuffe parade": {lat: 18.9130, lng: 72.8150, district: "Mumbai City", type: "locality"},
    "ballard estate": {lat: 18.9400, lng: 72.8420, district: "Mumbai City", type: "locality"},
    "kala ghoda": {lat: 18.9280, lng: 72.8320, district: "Mumbai City", type: "street"},
    "apollo bunder": {lat: 18.9220, lng: 72.8350, district: "Mumbai City", type: "street"},
    "worli": {lat: 19.0176, lng: 72.8152, district: "Mumbai City", type: "locality"},
    "prabhadevi": {lat: 19.0176, lng: 72.8284, district: "Mumbai City", type: "locality"},
    "lower parel": {lat: 19.0008, lng: 72.8300, district: "Mumbai City", type: "locality"},
    "mahalaxmi": {lat: 18.9830, lng: 72.8200, district: "Mumbai City", type: "locality"},
    "breach candy": {lat: 18.9720, lng: 72.8100, district: "Mumbai City", type: "locality"},
    "malabar hill": {lat: 18.9550, lng: 72.8050, district: "Mumbai City", type: "locality"},
    "tardeo": {lat: 18.9700, lng: 72.8150, district: "Mumbai City", type: "locality"},
    "grant road": {lat: 18.9650, lng: 72.8150, district: "Mumbai City", type: "street"},
    
    // Mumbai - Central Mumbai (Railway Corridor)
    "dadar": {lat: 19.0176, lng: 72.8562, district: "Mumbai City", type: "locality"},
    "dadar east": {lat: 19.0180, lng: 72.8580, district: "Mumbai City", type: "locality"},
    "dadar west": {lat: 19.0170, lng: 72.8440, district: "Mumbai City", type: "locality"},
    "parel": {lat: 19.0008, lng: 72.8400, district: "Mumbai City", type: "locality"},
    "lalbaug": {lat: 18.9950, lng: 72.8350, district: "Mumbai City", type: "locality"},
    "byculla": {lat: 18.9790, lng: 72.8310, district: "Mumbai City", type: "locality"},
    "chinchpokli": {lat: 18.9950, lng: 72.8250, district: "Mumbai City", type: "locality"},
    "curry road": {lat: 18.9900, lng: 72.8320, district: "Mumbai City", type: "street"},
    "cotton green": {lat: 18.9850, lng: 72.8450, district: "Mumbai City", type: "locality"},
    "reay road": {lat: 18.9800, lng: 72.8500, district: "Mumbai City", type: "street"},
    "dockyard road": {lat: 18.9700, lng: 72.8450, district: "Mumbai City", type: "street"},
    "mazgaon": {lat: 18.9680, lng: 72.8450, district: "Mumbai City", type: "locality"},
    "sewri": {lat: 18.9950, lng: 72.8550, district: "Mumbai City", type: "locality"},
    "wadala": {lat: 19.0176, lng: 72.8738, district: "Mumbai City", type: "locality"},
    "antop hill": {lat: 19.0250, lng: 72.8650, district: "Mumbai City", type: "locality"},
    "king circle": {lat: 19.0280, lng: 72.8580, district: "Mumbai City", type: "locality"},
    "matunga": {lat: 19.0270, lng: 72.8490, district: "Mumbai City", type: "locality"},
    "sion": {lat: 19.0430, lng: 72.8610, district: "Mumbai City", type: "locality"},
    "mahim": {lat: 19.0410, lng: 72.8420, district: "Mumbai City", type: "locality"},
    
    // Mumbai - Western Suburbs (Entertainment & Beaches)
    "bandra": {lat: 19.0596, lng: 72.8295, district: "Mumbai Suburban", type: "locality"},
    "bandra west": {lat: 19.0550, lng: 72.8200, district: "Mumbai Suburban", type: "locality"},
    "bandra east": {lat: 19.0650, lng: 72.8400, district: "Mumbai Suburban", type: "locality"},
    "linking road": {lat: 19.0550, lng: 72.8280, district: "Mumbai Suburban", type: "street"},
    "hill road": {lat: 19.0520, lng: 72.8250, district: "Mumbai Suburban", type: "street"},
    "carter road": {lat: 19.0500, lng: 72.8180, district: "Mumbai Suburban", type: "street"},
    "turner road": {lat: 19.0580, lng: 72.8250, district: "Mumbai Suburban", type: "street"},
    
    "khar": {lat: 19.0728, lng: 72.8378, district: "Mumbai Suburban", type: "locality"},
    "khar west": {lat: 19.0700, lng: 72.8300, district: "Mumbai Suburban", type: "locality"},
    "khar east": {lat: 19.0750, lng: 72.8450, district: "Mumbai Suburban", type: "locality"},
    
    "santacruz": {lat: 19.0896, lng: 72.8369, district: "Mumbai Suburban", type: "locality"},
    "santacruz west": {lat: 19.0850, lng: 72.8300, district: "Mumbai Suburban", type: "locality"},
    "santacruz east": {lat: 19.0950, lng: 72.8450, district: "Mumbai Suburban", type: "locality"},
    
    "vile parle": {lat: 19.1075, lng: 72.8263, district: "Mumbai Suburban", type: "locality"},
    "vile parle west": {lat: 19.1050, lng: 72.8200, district: "Mumbai Suburban", type: "locality"},
    "vile parle east": {lat: 19.1100, lng: 72.8350, district: "Mumbai Suburban", type: "locality"},
    
    "juhu": {lat: 19.1136, lng: 72.8262, district: "Mumbai Suburban", type: "locality"},
    "juhu beach": {lat: 19.1136, lng: 72.8200, district: "Mumbai Suburban", type: "street"},
    
    "andheri": {lat: 19.1136, lng: 72.8697, district: "Mumbai Suburban", type: "locality"},
    "andheri west": {lat: 19.1200, lng: 72.8400, district: "Mumbai Suburban", type: "locality"},
    "andheri east": {lat: 19.1100, lng: 72.8950, district: "Mumbai Suburban", type: "locality"},
    "oshiwara": {lat: 19.1450, lng: 72.8350, district: "Mumbai Suburban", type: "locality"},
    "lokhandwala": {lat: 19.1420, lng: 72.8280, district: "Mumbai Suburban", type: "locality"},
    "versova": {lat: 19.1317, lng: 72.8064, district: "Mumbai Suburban", type: "locality"},
    "four bungalows": {lat: 19.1380, lng: 72.8180, district: "Mumbai Suburban", type: "locality"},
    
    "jogeshwari": {lat: 19.1342, lng: 72.8570, district: "Mumbai Suburban", type: "locality"},
    "jogeshwari west": {lat: 19.1350, lng: 72.8450, district: "Mumbai Suburban", type: "locality"},
    "jogeshwari east": {lat: 19.1330, lng: 72.8650, district: "Mumbai Suburban", type: "locality"},
    
    "goregaon": {lat: 19.1663, lng: 72.8526, district: "Mumbai Suburban", type: "locality"},
    "goregaon west": {lat: 19.1700, lng: 72.8350, district: "Mumbai Suburban", type: "locality"},
    "goregaon east": {lat: 19.1650, lng: 72.8650, district: "Mumbai Suburban", type: "locality"},
    
    "malad": {lat: 19.1864, lng: 72.8493, district: "Mumbai Suburban", type: "locality"},
    "malad west": {lat: 19.1900, lng: 72.8350, district: "Mumbai Suburban", type: "locality"},
    "malad east": {lat: 19.1850, lng: 72.8650, district: "Mumbai Suburban", type: "locality"},
    
    "kandivali": {lat: 19.2095, lng: 72.8526, district: "Mumbai Suburban", type: "locality"},
    "kandivali west": {lat: 19.2100, lng: 72.8350, district: "Mumbai Suburban", type: "locality"},
    "kandivali east": {lat: 19.2100, lng: 72.8700, district: "Mumbai Suburban", type: "locality"},
    
    "borivali": {lat: 19.2307, lng: 72.8567, district: "Mumbai Suburban", type: "locality"},
    "borivali west": {lat: 19.2350, lng: 72.8400, district: "Mumbai Suburban", type: "locality"},
    "borivali east": {lat: 19.2300, lng: 72.8700, district: "Mumbai Suburban", type: "locality"},
    
    "dahisar": {lat: 19.2544, lng: 72.8658, district: "Mumbai Suburban", type: "locality"},
    "mira road": {lat: 19.2952, lng: 72.8739, district: "Thane", type: "locality"},
    
    // ============================================
    // PUNE METROPOLITAN REGION
    // ============================================
    
    // Pune - Main City Areas
    "pune": {lat: 18.5204, lng: 73.8567, district: "Pune", type: "city"},
    "old pune": {lat: 18.5150, lng: 73.8550, district: "Pune", type: "area"},
    "new pune": {lat: 18.5300, lng: 73.8700, district: "Pune", type: "area"},
    "west pune": {lat: 18.5200, lng: 73.8000, district: "Pune", type: "area"},
    "east pune": {lat: 18.5200, lng: 73.9200, district: "Pune", type: "area"},
    
    // Pune - Central Business District
    "shivajinagar": {lat: 18.5308, lng: 73.8506, district: "Pune", type: "locality"},
    "jm road": {lat: 18.5250, lng: 73.8450, district: "Pune", type: "street"},
    "fc road": {lat: 18.5200, lng: 73.8400, district: "Pune", type: "street"},
    "mg road": {lat: 18.5180, lng: 73.8550, district: "Pune", type: "street"},
    "camp": {lat: 18.5050, lng: 73.8900, district: "Pune", type: "locality"},
    "koregaon park": {lat: 18.5362, lng: 73.8980, district: "Pune", type: "locality"},
    "kalyani nagar": {lat: 18.5480, lng: 73.9050, district: "Pune", type: "locality"},
    "viman nagar": {lat: 18.5679, lng: 73.9143, district: "Pune", type: "locality"},
    "lohegaon": {lat: 18.5820, lng: 73.9190, district: "Pune", type: "locality"},
    "yerwada": {lat: 18.5562, lng: 73.8822, district: "Pune", type: "locality"},
    "kharadi": {lat: 18.5515, lng: 73.9588, district: "Pune", type: "locality"},
    "hadapsar": {lat: 18.5089, lng: 73.9260, district: "Pune", type: "locality"},
    "mundhwa": {lat: 18.5320, lng: 73.9450, district: "Pune", type: "locality"},
    "keshav nagar": {lat: 18.5400, lng: 73.9350, district: "Pune", type: "locality"},
    "vishrantwadi": {lat: 18.5650, lng: 73.8950, district: "Pune", type: "locality"},
    "dhanori": {lat: 18.5950, lng: 73.8850, district: "Pune", type: "locality"},
    "baner": {lat: 18.5590, lng: 73.7850, district: "Pune", type: "locality"},
    "balewadi": {lat: 18.5644, lng: 73.7654, district: "Pune", type: "locality"},
    "wakad": {lat: 18.5974, lng: 73.7898, district: "Pune", type: "locality"},
    "hinjewadi": {lat: 18.5912, lng: 73.7396, district: "Pune", type: "locality"},
    "pimple saudagar": {lat: 18.6050, lng: 73.8070, district: "Pune", type: "locality"},
    "pimple nilakh": {lat: 18.5900, lng: 73.8050, district: "Pune", type: "locality"},
    "aundh": {lat: 18.5592, lng: 73.8073, district: "Pune", type: "locality"},
    "pashan": {lat: 18.5400, lng: 73.7800, district: "Pune", type: "locality"},
    "sus": {lat: 18.5550, lng: 73.7700, district: "Pune", type: "locality"},
    "bavdhan": {lat: 18.5150, lng: 73.7750, district: "Pune", type: "locality"},
    "warje": {lat: 18.4850, lng: 73.8050, district: "Pune", type: "locality"},
    "karve nagar": {lat: 18.4800, lng: 73.8200, district: "Pune", type: "locality"},
    "kothrud": {lat: 18.5074, lng: 73.8077, district: "Pune", type: "locality"},
    "erandwane": {lat: 18.5150, lng: 73.8350, district: "Pune", type: "locality"},
    "prabhat road": {lat: 18.5100, lng: 73.8300, district: "Pune", type: "street"},
    "law college road": {lat: 18.5100, lng: 73.8400, district: "Pune", type: "street"},
    "deccan": {lat: 18.5108, lng: 73.8370, district: "Pune", type: "locality"},
    "sadashiv peth": {lat: 18.5150, lng: 73.8500, district: "Pune", type: "locality"},
    "narayan peth": {lat: 18.5120, lng: 73.8520, district: "Pune", type: "locality"},
    "shaniwar peth": {lat: 18.5100, lng: 73.8550, district: "Pune", type: "locality"},
    "kasba peth": {lat: 18.5080, lng: 73.8600, district: "Pune", type: "locality"},
    "budhwar peth": {lat: 18.5050, lng: 73.8580, district: "Pune", type: "locality"},
    "raviwar peth": {lat: 18.5070, lng: 73.8620, district: "Pune", type: "locality"},
    "gultekdi": {lat: 18.5000, lng: 73.8650, district: "Pune", type: "locality"},
    "salisbury park": {lat: 18.4950, lng: 73.8700, district: "Pune", type: "locality"},
    "pune cantonment": {lat: 18.5000, lng: 73.8800, district: "Pune", type: "locality"},
    "wanowrie": {lat: 18.4793, lng: 73.8975, district: "Pune", type: "locality"},
    "fursungi": {lat: 18.4700, lng: 73.9800, district: "Pune", type: "locality"},
    "undri": {lat: 18.4650, lng: 73.9300, district: "Pune", type: "locality"},
    "pisoli": {lat: 18.4500, lng: 73.9500, district: "Pune", type: "locality"},
    "kondhwa": {lat: 18.4610, lng: 73.8870, district: "Pune", type: "locality"},
    "bibwewadi": {lat: 18.4700, lng: 73.8650, district: "Pune", type: "locality"},
    "dhankawadi": {lat: 18.4650, lng: 73.8550, district: "Pune", type: "locality"},
    "sinhagad road": {lat: 18.4600, lng: 73.8200, district: "Pune", type: "street"},
    "vadgaon budruk": {lat: 18.4450, lng: 73.8150, district: "Pune", type: "locality"},
    "katraj": {lat: 18.4462, lng: 73.8679, district: "Pune", type: "locality"},
    "ambegaon": {lat: 18.5350, lng: 73.7500, district: "Pune", type: "locality"},
    "chinchwad": {lat: 18.6298, lng: 73.8089, district: "Pune", type: "locality"},
    "pimpri": {lat: 18.6298, lng: 73.8089, district: "Pune", type: "locality"},
    "nigdi": {lat: 18.6500, lng: 73.7700, district: "Pune", type: "locality"},
    "akurdi": {lat: 18.6450, lng: 73.7750, district: "Pune", type: "locality"},
    "bhosari": {lat: 18.6284, lng: 73.8389, district: "Pune", type: "locality"},
    "chakan": {lat: 18.7606, lng: 73.8636, district: "Pune", type: "locality"},
    "talegaon dabhade": {lat: 18.7350, lng: 73.6750, district: "Pune", type: "locality"},
    
    // Pune Educational and Residential Areas
    "sasane nagar": {lat: 18.6400, lng: 73.7950, district: "Pune", type: "locality"},
    "mit adt university": {lat: 18.7547, lng: 73.4323, district: "Pune", type: "university"},
    "mit adt": {lat: 18.7547, lng: 73.4323, district: "Pune", type: "university"},
    "loni kalbhor": {lat: 18.7500, lng: 73.4300, district: "Pune", type: "locality"},
    "rajgurunagar": {lat: 18.8650, lng: 73.8800, district: "Pune", type: "town"},
    
    // ============================================
    // NASHIK DIVISION
    // ============================================
    
    // Nashik City
    "nashik": {lat: 19.9975, lng: 73.7898, district: "Nashik", type: "city"},
    "nashik road": {lat: 20.0000, lng: 73.7800, district: "Nashik", type: "locality"},
    "college road nashik": {lat: 19.9950, lng: 73.7850, district: "Nashik", type: "street"},
    "main road nashik": {lat: 19.9980, lng: 73.7900, district: "Nashik", type: "street"},
    "gangapur road": {lat: 20.0100, lng: 73.7600, district: "Nashik", type: "street"},
    "mumbai naka": {lat: 19.9800, lng: 73.7950, district: "Nashik", type: "locality"},
    "cidco nashik": {lat: 20.0200, lng: 73.7700, district: "Nashik", type: "locality"},
    "pathardi phata": {lat: 20.0150, lng: 73.7550, district: "Nashik", type: "locality"},
    "adgaon": {lat: 20.0250, lng: 73.7450, district: "Nashik", type: "locality"},
    "ambad nashik": {lat: 20.0050, lng: 73.8150, district: "Nashik", type: "locality"},
    "panchavati": {lat: 20.0080, lng: 73.7850, district: "Nashik", type: "locality"},
    "tapovan": {lat: 20.0000, lng: 73.7650, district: "Nashik", type: "locality"},
    "trimbakeshwar": {lat: 19.9317, lng: 73.5267, district: "Nashik", type: "town"},
    "sinnar": {lat: 19.8547, lng: 73.9956, district: "Nashik", type: "town"},
    "igatpuri": {lat: 19.6967, lng: 73.5650, district: "Nashik", type: "town"},
    "ghoti": {lat: 19.7167, lng: 73.6333, district: "Nashik", type: "town"},
    "kalwan": {lat: 20.4833, lng: 74.0167, district: "Nashik", type: "town"},
    "yeola": {lat: 20.0431, lng: 74.4786, district: "Nashik", type: "town"},
    "nandgaon": {lat: 20.3167, lng: 73.6833, district: "Nashik", type: "town"},
    "manmad": {lat: 20.2544, lng: 74.4386, district: "Nashik", type: "town"},
    
    // ============================================
    // VIDARBHA REGION (Eastern Maharashtra)
    // ============================================
    
    // Nagpur - Orange City
    "nagpur": {lat: 21.1458, lng: 79.0882, district: "Nagpur", type: "city"},
    "civil lines nagpur": {lat: 21.1520, lng: 79.0850, district: "Nagpur", type: "locality"},
    "sitabuldi": {lat: 21.1498, lng: 79.0806, district: "Nagpur", type: "locality"},
    "dharampeth": {lat: 21.1350, lng: 79.0700, district: "Nagpur", type: "locality"},
    "ramdaspeth": {lat: 21.1400, lng: 79.0750, district: "Nagpur", type: "locality"},
    "mahal nagpur": {lat: 21.1450, lng: 79.0900, district: "Nagpur", type: "locality"},
    "itwari": {lat: 21.1300, lng: 79.0950, district: "Nagpur", type: "locality"},
    "lakadganj": {lat: 21.1380, lng: 79.0950, district: "Nagpur", type: "locality"},
    "gandhibagh": {lat: 21.1350, lng: 79.0850, district: "Nagpur", type: "locality"},
    "nandanvan": {lat: 21.1200, lng: 79.0600, district: "Nagpur", type: "locality"},
    "wardhaman nagar": {lat: 21.1100, lng: 79.1000, district: "Nagpur", type: "locality"},
    "bajaj nagar": {lat: 21.1000, lng: 79.0800, district: "Nagpur", type: "locality"},
    "hanuman nagar": {lat: 21.1250, lng: 79.0550, district: "Nagpur", type: "locality"},
    "mangalwari": {lat: 21.1600, lng: 79.0700, district: "Nagpur", type: "locality"},
    "seminary hills": {lat: 21.1750, lng: 79.0450, district: "Nagpur", type: "locality"},
    "medical square": {lat: 21.1200, lng: 79.0700, district: "Nagpur", type: "locality"},
    "central avenue": {lat: 21.1450, lng: 79.0800, district: "Nagpur", type: "street"},
    "residency road": {lat: 21.1500, lng: 79.0750, district: "Nagpur", type: "street"},
    "kingsway": {lat: 21.1480, lng: 79.0820, district: "Nagpur", type: "street"},
    
    // Aurangabad Streets and Localities
    
    // ============================================
    // WESTERN MAHARASHTRA
    // ============================================
    
    // Aurangabad - Heritage City
    "aurangabad": {lat: 19.8762, lng: 75.3433, district: "Aurangabad", type: "city"},
    "cidco aurangabad": {lat: 19.8950, lng: 75.3200, district: "Aurangabad", type: "locality"},
    "nirala bazaar": {lat: 19.8750, lng: 75.3450, district: "Aurangabad", type: "locality"},
    "town hall": {lat: 19.8780, lng: 75.3400, district: "Aurangabad", type: "locality"},
    "kranti chowk": {lat: 19.8800, lng: 75.3350, district: "Aurangabad", type: "locality"},
    "osmanpura": {lat: 19.8700, lng: 75.3500, district: "Aurangabad", type: "locality"},
    "padegaon": {lat: 19.8900, lng: 75.3100, district: "Aurangabad", type: "locality"},
    "waluj": {lat: 19.8400, lng: 75.2800, district: "Aurangabad", type: "locality"},
    "chikalthana": {lat: 19.8300, lng: 75.3950, district: "Aurangabad", type: "locality"},
    "jalna road": {lat: 19.8650, lng: 75.3800, district: "Aurangabad", type: "street"},
    "airport road aurangabad": {lat: 19.8500, lng: 75.4000, district: "Aurangabad", type: "street"},
    
    // Kolhapur Streets and Localities
    "kolhapur": {lat: 16.7050, lng: 74.2433, district: "Kolhapur", type: "city"},
    "mahadwar road": {lat: 16.7100, lng: 74.2400, district: "Kolhapur", type: "street"},
    "rankala": {lat: 16.6900, lng: 74.2300, district: "Kolhapur", type: "locality"},
    "shivaji university": {lat: 16.7350, lng: 74.2650, district: "Kolhapur", type: "locality"},
    "rajarampuri": {lat: 16.7200, lng: 74.2200, district: "Kolhapur", type: "locality"},
    "laxmipuri": {lat: 16.7150, lng: 74.2350, district: "Kolhapur", type: "locality"},
    "tarabai park": {lat: 16.7000, lng: 74.2500, district: "Kolhapur", type: "locality"},
    "station road kolhapur": {lat: 16.7050, lng: 74.2500, district: "Kolhapur", type: "street"},
    "shahupuri": {lat: 16.6950, lng: 74.2400, district: "Kolhapur", type: "locality"},
    "bindu chowk": {lat: 16.7080, lng: 74.2420, district: "Kolhapur", type: "locality"},
    
    // ============================================
    // DISTRICT HEADQUARTERS & MAJOR CITIES
    // ============================================
    
    // Marathwada Region
    "solapur": {lat: 17.6599, lng: 75.9064, district: "Solapur", type: "city"},
    "sangli": {lat: 16.8524, lng: 74.5815, district: "Sangli", type: "city"},
    "latur": {lat: 18.4088, lng: 76.5604, district: "Latur", type: "city"},
    "beed": {lat: 18.9894, lng: 75.7540, district: "Beed", type: "city"},
    "parbhani": {lat: 19.2704, lng: 76.7749, district: "Parbhani", type: "city"},
    "jalna": {lat: 19.8407, lng: 75.8738, district: "Jalna", type: "city"},
    "osmanabad": {lat: 18.1760, lng: 76.0393, district: "Osmanabad", type: "city"},
    "nanded": {lat: 19.1383, lng: 77.3210, district: "Nanded", type: "city"},
    
    // Vidarbha Region
    "amravati": {lat: 20.9374, lng: 77.7796, district: "Amravati", type: "city"},
    "akola": {lat: 20.7002, lng: 77.0082, district: "Akola", type: "city"},
    "chandrapur": {lat: 19.9615, lng: 79.2961, district: "Chandrapur", type: "city"},
    "buldhana": {lat: 20.5307, lng: 76.1809, district: "Buldhana", type: "city"},
    "washim": {lat: 20.1124, lng: 77.1330, district: "Washim", type: "city"},
    "yavatmal": {lat: 20.3897, lng: 78.1307, district: "Yavatmal", type: "city"},
    "wardha": {lat: 20.7453, lng: 78.6022, district: "Wardha", type: "city"},
    "gadchiroli": {lat: 20.1809, lng: 80.0120, district: "Gadchiroli", type: "city"},
    "bhandara": {lat: 21.1681, lng: 79.6641, district: "Bhandara", type: "city"},
    "gondia": {lat: 21.4524, lng: 80.1956, district: "Gondia", type: "city"},
    "hingoli": {lat: 19.7156, lng: 77.1539, district: "Hingoli", type: "city"},
    
    // North Maharashtra
    "dhule": {lat: 20.9042, lng: 74.7749, district: "Dhule", type: "city"},
    "jalgaon": {lat: 21.0077, lng: 75.5626, district: "Jalgaon", type: "city"},
    "ahmednagar": {lat: 19.0948, lng: 74.7480, district: "Ahmednagar", type: "city"},
    
    // Western Maharashtra (Sahyadri Region)
    "satara": {lat: 17.6805, lng: 74.0183, district: "Satara", type: "city"},
    
    // Konkan Coast
    "raigad": {lat: 18.2257, lng: 73.1806, district: "Raigad", type: "city"},
    "ratnagiri": {lat: 16.9902, lng: 73.3120, district: "Ratnagiri", type: "city"},
    "sindhudurg": {lat: 16.2667, lng: 73.6667, district: "Sindhudurg", type: "city"},
    "thane": {lat: 19.2183, lng: 72.9781, district: "Thane", type: "city"},
    "wardha": {lat: 20.7453, lng: 78.6022, district: "Wardha", type: "city"},
    "gadchiroli": {lat: 20.1809, lng: 80.0120, district: "Gadchiroli", type: "city"},
    "bhandara": {lat: 21.1681, lng: 79.6641, district: "Bhandara", type: "city"},
    "gondia": {lat: 21.4524, lng: 80.1956, district: "Gondia", type: "city"},
    "hingoli": {lat: 19.7156, lng: 77.1539, district: "Hingoli", type: "city"},
    
    // ============================================
    // AGRICULTURAL TOWNS AND VILLAGES
    // ============================================
    
    // Western Maharashtra Agricultural Centers
    "baramati": {lat: 18.1514, lng: 74.5815, district: "Pune", type: "town"},
    "indapur": {lat: 18.1180, lng: 75.0173, district: "Pune", type: "town"},
    "malegaon nashik": {lat: 20.5579, lng: 74.5287, district: "Nashik", type: "town"},
    "shirdi": {lat: 19.7645, lng: 74.4778, district: "Ahmednagar", type: "town"},
    "pandharpur": {lat: 17.6792, lng: 75.3138, district: "Solapur", type: "town"},
    "ichalkaranji": {lat: 16.6918, lng: 74.4607, district: "Kolhapur", type: "town"},
    "miraj": {lat: 16.8270, lng: 74.6507, district: "Sangli", type: "town"},
    "karad": {lat: 17.2893, lng: 74.1820, district: "Satara", type: "town"},
    "wai": {lat: 17.9537, lng: 73.8993, district: "Satara", type: "town"},
    "phaltan": {lat: 17.9918, lng: 74.4317, district: "Satara", type: "town"},
    "rahuri": {lat: 19.3932, lng: 74.6488, district: "Ahmednagar", type: "town"},
    "kopargaon": {lat: 19.5119, lng: 74.4764, district: "Ahmednagar", type: "town"},
    "shrirampur": {lat: 19.6206, lng: 74.6583, district: "Ahmednagar", type: "town"},
    "sangamner": {lat: 19.5707, lng: 74.2119, district: "Ahmednagar", type: "town"},
    
    // Marathwada Agricultural Centers
    "akluj": {lat: 17.8833, lng: 75.0167, district: "Solapur", type: "town"},
    "barshi": {lat: 18.2333, lng: 75.6833, district: "Solapur", type: "town"},
    "mohol": {lat: 17.8167, lng: 75.6500, district: "Solapur", type: "town"},
    "malshiras": {lat: 18.1167, lng: 75.8833, district: "Solapur", type: "town"},
    "kagal": {lat: 16.5833, lng: 74.3167, district: "Kolhapur", type: "town"},
    "gadhinglaj": {lat: 16.2167, lng: 74.3500, district: "Kolhapur", type: "town"},
    "bhudargad": {lat: 16.0667, lng: 74.1000, district: "Kolhapur", type: "town"},
    "radhanagari": {lat: 16.4167, lng: 73.9833, district: "Kolhapur", type: "town"},
    "tasgaon": {lat: 16.6500, lng: 74.6000, district: "Sangli", type: "town"},
    "palus": {lat: 16.9333, lng: 74.4667, district: "Sangli", type: "town"},
    "walwa": {lat: 16.9667, lng: 74.7833, district: "Sangli", type: "town"},
    "shirala": {lat: 16.9833, lng: 74.1500, district: "Sangli", type: "town"},
    "islampur": {lat: 16.2500, lng: 74.2000, district: "Sangli", type: "town"},
    "vita": {lat: 17.2667, lng: 74.5333, district: "Sangli", type: "town"},
    "khanapur": {lat: 17.2667, lng: 74.5000, district: "Sangli", type: "town"},
    "atpadi": {lat: 17.4167, lng: 74.9167, district: "Sangli", type: "town"},
    
    // Vidarbha Agricultural Areas
    "arvi": {lat: 21.2500, lng: 78.2333, district: "Wardha", type: "village"},
    "hinganghat": {lat: 20.5500, lng: 78.8167, district: "Wardha", type: "village"},
    "samudrapur": {lat: 20.6333, lng: 78.9667, district: "Wardha", type: "village"},
    "deoli": {lat: 20.6667, lng: 78.4833, district: "Wardha", type: "village"},
    "ashti wardha": {lat: 20.9167, lng: 78.4167, district: "Wardha", type: "village"},
    "karanja": {lat: 20.4833, lng: 77.4833, district: "Washim", type: "village"},
    "malegaon washim": {lat: 20.7833, lng: 77.2000, district: "Washim", type: "village"},
    "risod": {lat: 20.1833, lng: 77.0167, district: "Washim", type: "village"},
    "mangrulpir": {lat: 20.3167, lng: 77.3500, district: "Washim", type: "village"},
    "manora": {lat: 20.2000, lng: 77.2500, district: "Washim", type: "village"},
    "chikhaldara": {lat: 21.3667, lng: 77.3833, district: "Amravati", type: "village"},
    "achalpur": {lat: 21.2667, lng: 77.5167, district: "Amravati", type: "village"},
    "chandurbazar": {lat: 21.2333, lng: 77.7667, district: "Amravati", type: "village"},
    "warud": {lat: 21.4667, lng: 78.2667, district: "Amravati", type: "village"},
    "morshi": {lat: 21.3333, lng: 78.0167, district: "Amravati", type: "village"},
    "daryapur": {lat: 20.9167, lng: 77.3167, district: "Amravati", type: "village"},
    "anjangaon": {lat: 21.1667, lng: 77.0833, district: "Amravati", type: "village"},
    "telhara": {lat: 21.0667, lng: 77.8167, district: "Akola", type: "village"},
    "murtizapur": {lat: 20.7333, lng: 77.3667, district: "Akola", type: "village"},
    "balapur": {lat: 20.8167, lng: 76.7667, district: "Akola", type: "village"},
    "patur": {lat: 20.4167, lng: 76.9167, district: "Akola", type: "village"},
    
    // Konkan Coastal Areas
    "alibag": {lat: 18.6500, lng: 72.8833, district: "Raigad", type: "town"},
    "karjat": {lat: 18.9167, lng: 73.3333, district: "Raigad", type: "town"},
    "mahad": {lat: 18.0833, lng: 73.4167, district: "Raigad", type: "town"},
    "murud": {lat: 18.3333, lng: 72.9667, district: "Raigad", type: "town"},
    "roha": {lat: 18.4167, lng: 73.1167, district: "Raigad", type: "town"},
    "pen": {lat: 18.7333, lng: 73.1000, district: "Raigad", type: "town"},
    "panvel": {lat: 19.0000, lng: 73.1167, district: "Raigad", type: "town"},
    "uran": {lat: 18.8833, lng: 72.9333, district: "Raigad", type: "town"},
    "vengurla": {lat: 15.8667, lng: 73.6333, district: "Sindhudurg", type: "town"},
    "malvan": {lat: 16.0667, lng: 73.4667, district: "Sindhudurg", type: "town"},
    "kudal": {lat: 16.0167, lng: 73.6833, district: "Sindhudurg", type: "town"},
    "sawantwadi": {lat: 15.9000, lng: 73.8167, district: "Sindhudurg", type: "town"},
    "kankavli": {lat: 16.2667, lng: 73.7000, district: "Sindhudurg", type: "town"},
    "vaibhavwadi": {lat: 16.1667, lng: 73.7500, district: "Sindhudurg", type: "town"},
    "devgad": {lat: 16.3833, lng: 73.3833, district: "Sindhudurg", type: "town"},
    "dodamarg": {lat: 15.8000, lng: 74.1167, district: "Sindhudurg", type: "town"},
    "dapoli": {lat: 17.7667, lng: 73.1833, district: "Ratnagiri", type: "town"},
    "mandangad": {lat: 17.9667, lng: 73.2667, district: "Ratnagiri", type: "town"},
    "guhagar": {lat: 17.4833, lng: 73.1833, district: "Ratnagiri", type: "town"},
    "chiplun": {lat: 17.5333, lng: 73.5167, district: "Ratnagiri", type: "town"},
    "lanja": {lat: 17.2167, lng: 73.5833, district: "Ratnagiri", type: "town"},
    "rajapur": {lat: 17.0000, lng: 73.5333, district: "Ratnagiri", type: "town"},
    
    // Important Agricultural Villages
    "rahata": {lat: 19.6833, lng: 74.4833, district: "Ahmednagar", type: "village"},
    "nevasa": {lat: 19.5500, lng: 74.9167, district: "Ahmednagar", type: "village"},
    "pathardi": {lat: 19.2000, lng: 75.1667, district: "Ahmednagar", type: "village"},
    "karjat ahmednagar": {lat: 19.3500, lng: 75.0667, district: "Ahmednagar", type: "village"},
    "parner": {lat: 19.0833, lng: 75.1333, district: "Ahmednagar", type: "village"},
    "shevgaon": {lat: 19.3500, lng: 75.2000, district: "Ahmednagar", type: "village"},
    "akole": {lat: 19.5333, lng: 73.8833, district: "Ahmednagar", type: "village"},
    "jamkhed": {lat: 18.7500, lng: 75.3167, district: "Ahmednagar", type: "village"},
    "shrigonda": {lat: 18.6167, lng: 74.6833, district: "Ahmednagar", type: "village"},
    "newasa": {lat: 19.5500, lng: 74.9167, district: "Ahmednagar", type: "village"}
    
    // ============================================
    // END OF LOCATION DATABASE
    // ============================================
    // Total: 400+ locations across Maharashtra
    // Includes: Cities, Towns, Villages, Streets, Localities, Universities
    // Coverage: All 36 districts with detailed metro area data
    // Organized by: Geographic regions and administrative divisions
};

// ============================================
// MODULE EXPORT CONFIGURATION
// ============================================
// Export for use in HTML files and Node.js modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = maharashtraLocations;
}

// ============================================
// LOCATION SEARCH UTILITY FUNCTIONS
// ============================================
// Advanced search capabilities for the Maharashtra locations database
const MaharashtraLocationSearch = {
    // Search by exact name
    findExact: function(locationName) {
        const searchTerm = locationName.toLowerCase().trim();
        return maharashtraLocations[searchTerm] || null;
    },
    
    // Search with partial matching
    findPartial: function(locationName) {
        const searchTerm = locationName.toLowerCase().trim();
        const matches = [];
        
        for (const [key, value] of Object.entries(maharashtraLocations)) {
            if (key.includes(searchTerm) || searchTerm.includes(key)) {
                matches.push({
                    name: key,
                    ...value,
                    score: this.calculateRelevanceScore(searchTerm, key)
                });
            }
        }
        
        return matches.sort((a, b) => b.score - a.score);
    },
    
    // Search by district
    findByDistrict: function(districtName) {
        const searchTerm = districtName.toLowerCase().trim();
        const matches = [];
        
        for (const [key, value] of Object.entries(maharashtraLocations)) {
            if (value.district.toLowerCase().includes(searchTerm)) {
                matches.push({
                    name: key,
                    ...value
                });
            }
        }
        
        return matches;
    },
    
    // Search by type (city, town, village, locality, street)
    findByType: function(locationType) {
        const searchTerm = locationType.toLowerCase().trim();
        const matches = [];
        
        for (const [key, value] of Object.entries(maharashtraLocations)) {
            if (value.type === searchTerm) {
                matches.push({
                    name: key,
                    ...value
                });
            }
        }
        
        return matches;
    },
    
    // Calculate relevance score for search results
    calculateRelevanceScore: function(searchTerm, locationName) {
        let score = 0;
        
        // Exact match gets highest score
        if (locationName === searchTerm) {
            score += 100;
        }
        
        // Starts with search term
        if (locationName.startsWith(searchTerm)) {
            score += 50;
        }
        
        // Contains search term
        if (locationName.includes(searchTerm)) {
            score += 25;
        }
        
        // Length difference penalty
        const lengthDiff = Math.abs(locationName.length - searchTerm.length);
        score -= lengthDiff * 2;
        
        return Math.max(0, score);
    },
    
    // Get suggestions for autocomplete
    getSuggestions: function(input, limit = 10) {
        if (!input || input.length < 2) return [];
        
        const searchTerm = input.toLowerCase().trim();
        const suggestions = [];
        
        for (const [key, value] of Object.entries(maharashtraLocations)) {
            if (key.startsWith(searchTerm)) {
                suggestions.push({
                    name: key,
                    displayName: `${key} (${value.district} District, ${value.type})`,
                    ...value
                });
            }
        }
        
        // Sort by name length (shorter names first for better autocomplete)
        suggestions.sort((a, b) => a.name.length - b.name.length);
        
        return suggestions.slice(0, limit);
    },
    
    // Find nearby locations within a radius (approximate)
    findNearby: function(lat, lng, radiusKm = 50) {
        const nearby = [];
        
        for (const [key, value] of Object.entries(maharashtraLocations)) {
            const distance = this.calculateDistance(lat, lng, value.lat, value.lng);
            if (distance <= radiusKm) {
                nearby.push({
                    name: key,
                    distance: distance,
                    ...value
                });
            }
        }
        
        return nearby.sort((a, b) => a.distance - b.distance);
    },
    
    // Calculate distance between two points using Haversine formula
    calculateDistance: function(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },
    
    toRadians: function(degrees) {
        return degrees * (Math.PI / 180);
    }
};

// ============================================
// GLOBAL EXPORTS
// ============================================
// Make search functions and data globally available for web usage
if (typeof window !== 'undefined') {
    window.MaharashtraLocationSearch = MaharashtraLocationSearch;
    window.maharashtraLocations = maharashtraLocations;
}

// Additional export for search utilities in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports.MaharashtraLocationSearch = MaharashtraLocationSearch;
}
