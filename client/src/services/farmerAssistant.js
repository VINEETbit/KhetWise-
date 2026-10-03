const KNOWLEDGE_SOURCES = {
  soil: { label: "ICAR soil health guidance", url: "https://www.icar.gov.in/en/icar-mgifri-motihari-and-atma-strengthen-farmer-awareness-soil-health-rice-nursery-management-and" },
  pest: { label: "ICAR integrated pest management", url: "https://www.icar.gov.in/en/integrated-pest-management-sustainable-approach-responsible-pest-management" },
  weather: { label: "ICAR farmer advisories", url: "https://icar.gov.in/en/kharif-agro-advisory-farmers" },
  kvk: { label: "Find an ICAR Krishi Vigyan Kendra", url: "https://www.icar.gov.in/en/krishi-vigyan-kendras-kvks" },
};

const ANSWERS = {
  en: {
    yellow: {
      title: "Yellowing leaves need a quick field check",
      body: "Yellow leaves can come from several causes, including nutrient stress, waterlogging, drought, root damage or disease. The leaf pattern and crop stage help separate them.",
      steps: ["Check whether yellowing starts on older or newer leaves and whether it is uniform or patchy.", "Check soil moisture near the roots and look for standing water, damaged roots or visible pests on both sides of leaves.", "Use a soil test before adding fertilizer; avoid a blanket nitrogen dose until the cause is clearer."],
      source: "soil", action: { label: "Open fertilizer guidance", path: "/dashboard/fertilizer" },
    },
    pest: {
      title: "Start with pest identification and field monitoring",
      body: "Pest control depends on the crop, pest species, crop stage and how widely damage has spread. A symptom alone is not enough to choose a spray.",
      steps: ["Inspect several affected and healthy plants; check leaf undersides, stems and growing points.", "Note the crop, growth stage, affected area and whether live insects or eggs are present. A clear photo can help an expert identify them.", "Use non-chemical and biological controls where suitable. Ask your local KVK for a crop-specific recommendation before using a pesticide; follow its label and safety directions."],
      source: "pest", action: { label: "Check plant symptoms", path: "/dashboard/disease" },
    },
    disease: {
      title: "Let’s narrow down the crop problem",
      body: "Leaf spots, wilting and rot can have different causes, and this assistant cannot diagnose a disease from text alone.",
      steps: ["Record the crop and growth stage, when symptoms began, and whether they are spreading.", "Check affected and healthy plants, leaf undersides, stems and roots. Note recent rain, irrigation and any recent spray.", "Avoid applying a fungicide or mixing products until the problem is identified. Share clear photos with a local agricultural expert or KVK."],
      source: "kvk", action: { label: "Open symptom screening", path: "/dashboard/disease" },
    },
    water: {
      title: "Check root-zone moisture before changing irrigation",
      body: "Water needs depend on crop, growth stage, soil texture, recent rain and the forecast for your farm.",
      steps: ["Check moisture a few centimetres below the surface near the active roots; a dry surface alone may not mean the root zone is dry.", "Look for both signs of water stress and waterlogging. Improve drainage if water is standing around roots.", "Use the local forecast and crop stage to plan the next irrigation; avoid a fixed schedule that ignores rain and soil conditions."],
      source: "weather", action: { label: "View farm weather", path: "/dashboard/weather" },
    },
    fertilizer: {
      title: "Base fertilizer choices on your soil test",
      body: "A suitable nutrient plan depends on the crop, soil test, yield target, crop stage and nutrients already applied.",
      steps: ["Use a recent soil-health or laboratory report for pH and available nutrients.", "Follow crop- and region-specific recommendations from the soil report or local agriculture department.", "Avoid applying a blanket dose based only on leaf colour; excess or poorly timed fertilizer can waste money and harm soil and water."],
      source: "soil", action: { label: "Open fertilizer model", path: "/dashboard/fertilizer" },
    },
    weather: {
      title: "Use the farm forecast to plan field work",
      body: "The dashboard forecast is for the nearest weather grid point, so conditions can differ within your farm.",
      steps: ["Check the forecast date, rain chance and expected rainfall before irrigation or field operations.", "Compare forecast conditions with what you observe in the field, especially after local showers.", "Tell me your crop and the decision you need to make—such as irrigation, sowing or spraying—for more focused guidance."],
      source: "weather", action: { label: "Open 7-day farm forecast", path: "/dashboard/weather" },
    },
    crop: {
      title: "Choose crops using soil and season information",
      body: "Crop suitability depends on your district, sowing season, soil, water availability and local market access.",
      steps: ["Use a soil test and a local seasonal crop calendar where available.", "Consider water availability and the forecast alongside the crop’s growth duration.", "KhetWise can rank crops from the model inputs; confirm the result with a local extension expert before planting."],
      source: "weather", action: { label: "Open crop recommendation", path: "/dashboard/crop" },
    },
    price: {
      title: "Compare market information before deciding when to sell",
      body: "Prices vary by market, grade, arrival volume, date and transport cost. A model estimate is not a guaranteed sale price.",
      steps: ["Check recent prices from nearby mandis for the same crop and grade.", "Compare transport, storage and commission costs with the quoted price.", "Use the KhetWise estimate as one input alongside current market quotes."],
      source: "kvk", action: { label: "Open market model", path: "/dashboard/price" },
    },
    general: {
      title: "I can help narrow down a common farm issue",
      body: "Add a few details so the guidance fits your field instead of giving a generic guess.",
      steps: ["Crop and variety, if known.", "Your district or farm location and the crop growth stage.", "What you see, when it started, how much of the field is affected, and any recent irrigation, rain or input application."],
      source: "kvk", action: { label: "Browse farm tools", path: "/dashboard" },
    },
  },
  hi: {
    yellow: {
      title: "पीली पत्तियों का कारण पहले खेत में जाँचें",
      body: "पत्तियाँ पीली होने के कई कारण हो सकते हैं—पोषक तत्वों की कमी, अधिक या कम पानी, जड़ों की समस्या या रोग। किस उम्र की पत्तियाँ प्रभावित हैं और फसल की अवस्था क्या है, यह देखें।",
      steps: ["देखें कि पहले पुरानी पत्तियाँ पीली हो रही हैं या नई, और पीलापन पूरे पौधे में है या धब्बों में।", "जड़ों के पास मिट्टी की नमी, रुका हुआ पानी, जड़ों की क्षति और पत्तियों के नीचे कीट देखें।", "कारण स्पष्ट होने तक अंदाज़े से यूरिया या अन्य खाद न डालें; पहले मिट्टी की जाँच कराएँ।"],
      source: "soil", action: { label: "खाद संबंधी जानकारी", path: "/dashboard/fertilizer" },
    },
    pest: {
      title: "कीट की पहचान और खेत की निगरानी से शुरू करें",
      body: "उपाय फसल, कीट की प्रजाति, फसल की अवस्था और नुकसान के फैलाव पर निर्भर करता है। केवल लक्षण देखकर दवा चुनना सही नहीं है।",
      steps: ["प्रभावित और स्वस्थ पौधों को देखें; पत्तियों के नीचे, तने और नई बढ़त पर कीट या अंडे जाँचें।", "फसल, अवस्था, प्रभावित क्षेत्र और दिख रहे कीट की जानकारी लिखें; साफ़ फोटो विशेषज्ञ को पहचानने में मदद करेगी।", "उपयुक्त जैविक और गैर-रासायनिक उपाय पहले देखें। दवा से पहले KVK या कृषि अधिकारी से फसल-विशेष सलाह लें और लेबल के निर्देश मानें।"],
      source: "pest", action: { label: "पौधों के लक्षण देखें", path: "/dashboard/disease" },
    },
    disease: {
      title: "लक्षणों से समस्या को समझने के लिए कुछ जानकारी दें",
      body: "धब्बे, मुरझाना और सड़न कई कारणों से हो सकते हैं। केवल लिखे हुए संदेश से यह सहायक रोग की पुष्टि नहीं कर सकता।",
      steps: ["फसल और अवस्था, लक्षण शुरू होने का समय और फैलाव दर्ज करें।", "प्रभावित तथा स्वस्थ पौधों की पत्तियाँ, तना और जड़ें देखें; हाल की बारिश, सिंचाई और छिड़काव नोट करें।", "पहचान से पहले फफूंदनाशक या दवाओं का मिश्रण न करें। साफ़ फोटो स्थानीय कृषि विशेषज्ञ या KVK को दिखाएँ।"],
      source: "kvk", action: { label: "लक्षण जाँच खोलें", path: "/dashboard/disease" },
    },
    water: {
      title: "सिंचाई बदलने से पहले जड़ क्षेत्र की नमी देखें",
      body: "पानी की जरूरत फसल, अवस्था, मिट्टी, हाल की बारिश और खेत के मौसम पूर्वानुमान पर निर्भर करती है।",
      steps: ["जड़ों के पास सतह से कुछ नीचे नमी देखें; केवल सूखी सतह का मतलब यह नहीं कि जड़ क्षेत्र भी सूखा है।", "पानी की कमी और जलभराव दोनों के संकेत देखें। जड़ों के पास पानी रुका हो तो निकास सुधारें।", "अगली सिंचाई की योजना फसल की अवस्था, मिट्टी और बारिश के पूर्वानुमान के अनुसार बनाएँ।"],
      source: "weather", action: { label: "खेत का मौसम देखें", path: "/dashboard/weather" },
    },
    fertilizer: {
      title: "खाद का निर्णय मिट्टी की जाँच पर आधारित करें",
      body: "पोषक तत्वों की सही योजना फसल, मिट्टी की रिपोर्ट, लक्ष्य, फसल की अवस्था और पहले दी गई खाद पर निर्भर करती है।",
      steps: ["मिट्टी की pH और उपलब्ध पोषक तत्वों की हाल की रिपोर्ट देखें।", "रिपोर्ट या स्थानीय कृषि विभाग की फसल-विशेष सलाह मानें।", "सिर्फ पत्तियों के रंग के आधार पर खाद न डालें; इससे खर्च और मिट्टी-पानी को नुकसान हो सकता है।"],
      source: "soil", action: { label: "खाद मॉडल खोलें", path: "/dashboard/fertilizer" },
    },
    weather: {
      title: "खेत के मौसम से काम की योजना बनाएँ",
      body: "डैशबोर्ड का पूर्वानुमान निकटतम मौसम ग्रिड का है; खेत के अलग हिस्सों में स्थिति बदल सकती है।",
      steps: ["सिंचाई या खेत का काम करने से पहले तारीख, बारिश की संभावना और अनुमानित वर्षा देखें।", "पूर्वानुमान की तुलना खेत में दिख रही स्थिति से करें, खासकर स्थानीय बारिश के बाद।", "फसल और निर्णय बताइए—जैसे सिंचाई, बुवाई या छिड़काव—ताकि सलाह अधिक उपयोगी हो।"],
      source: "weather", action: { label: "7 दिन का मौसम देखें", path: "/dashboard/weather" },
    },
    crop: {
      title: "मिट्टी और मौसम के अनुसार फसल चुनें",
      body: "फसल की उपयुक्तता जिले, बुवाई के समय, मिट्टी, पानी और स्थानीय बाजार पर निर्भर करती है।",
      steps: ["जहाँ उपलब्ध हो, मिट्टी की रिपोर्ट और स्थानीय फसल कैलेंडर देखें।", "पानी की उपलब्धता और मौसम के साथ फसल की अवधि पर विचार करें।", "मॉडल के परिणाम को बुवाई से पहले स्थानीय कृषि विशेषज्ञ से मिलाकर देखें।"],
      source: "weather", action: { label: "फसल सुझाव खोलें", path: "/dashboard/crop" },
    },
    price: {
      title: "बेचने का निर्णय लेने से पहले बाजार की तुलना करें",
      body: "भाव मंडी, गुणवत्ता, तारीख, आवक और ढुलाई के खर्च से बदलते हैं। मॉडल का अनुमान पक्का बिक्री भाव नहीं है।",
      steps: ["एक ही फसल और गुणवत्ता के लिए आसपास की मंडियों के हाल के भाव देखें।", "ढुलाई, भंडारण और कमीशन खर्च जोड़कर तुलना करें।", "KhetWise अनुमान को मौजूदा मंडी भाव के साथ एक अतिरिक्त जानकारी की तरह लें।"],
      source: "kvk", action: { label: "बाजार मॉडल खोलें", path: "/dashboard/price" },
    },
    general: {
      title: "मैं आम खेती की समस्या समझने में मदद कर सकता हूँ",
      body: "सलाह आपके खेत के अनुसार देने के लिए कुछ जानकारी साझा करें।",
      steps: ["फसल और किस्म, यदि पता हो।", "जिला या खेत का स्थान और फसल की अवस्था।", "क्या लक्षण दिख रहे हैं, कब शुरू हुए, कितना खेत प्रभावित है और हाल में सिंचाई, बारिश या खाद-दवा दी गई है या नहीं।"],
      source: "kvk", action: { label: "खेती के टूल देखें", path: "/dashboard" },
    },
  },
};

const INTENTS = [
  ["yellow", /\b(yellow|yellowing|pale leaves?)\b|पीली|पीले पत्ते|पत्ता पीला|पत्तियां पीली/iu],
  ["pest", /\b(pest|insect|bug|aphid|worm|caterpillar|whitefly)\b|कीट|इल्ली|माहू|सफेद मक्खी|कीड़ा/iu],
  ["disease", /\b(disease|fungus|fungal|spot|spots|wilt|rot|blight|mildew)\b|रोग|धब्बे|धब्बा|मुरझा|सड़न|फफूंद/iu],
  ["water", /\b(irrigat|water|watering|drainage|dry spell)\w*\b|सिंचाई|पानी|जलभराव|नमी/iu],
  ["fertilizer", /\b(fertilizer|fertiliser|manure|urea|nutrient|soil test)\w*\b|खाद|उर्वरक|मिट्टी की जांच|मिट्टी की जाँच|यूरिया/iu],
  ["weather", /\b(weather|rain|rainfall|forecast|temperature|heat|cold)\w*\b|मौसम|बारिश|वर्षा|तापमान|गर्मी|ठंड/iu],
  ["crop", /\b(which crop|crop recommendation|what to grow|sowing|planting)\b|कौन सी फसल|कौनसी फसल|फसल लगाऊं|क्या बोऊं|बुवाई/iu],
  ["price", /\b(price|market|mandi|sell|selling)\b|भाव|कीमत|मंडी|बेचूं|बाजार/iu],
];

export function getFarmAdvice(message, language = "en") {
  const text = String(message || "").trim();
  const responseLanguage = /[\u0900-\u097f]/u.test(text) ? "hi" : language === "hi-IN" ? "hi" : "en";
  const intent = INTENTS.find(([, pattern]) => pattern.test(text))?.[0] || "general";
  const advice = ANSWERS[responseLanguage][intent];
  return { ...advice, source: KNOWLEDGE_SOURCES[advice.source] };
}

export function getAssistantFarmContext() {
  try {
    const farm = JSON.parse(localStorage.getItem("khetwise_farm") || "null");
    const cached = JSON.parse(localStorage.getItem("khetwise_forecast_cache") || "null");
    const forecast = cached?.data;
    const weatherIsRecent = cached?.savedAt && Date.now() - cached.savedAt < 24 * 60 * 60 * 1000;
    const forecastMatchesFarm = farm?.location && cached?.location?.trim().toLowerCase() === farm.location.trim().toLowerCase();
    return {
      farmName: farm?.name || "",
      location: farm?.location || "",
      soilGuide: forecastMatchesFarm ? forecast?.soilGuide || null : null,
      weather: weatherIsRecent && forecastMatchesFarm && forecast?.current ? {
        location: forecast.location,
        temperature: forecast.current.temperature_2m,
        unit: forecast.unit,
        description: forecast.current.description,
        humidity: forecast.current.relative_humidity_2m,
        rainChance: forecast.daily?.[0]?.precipitationProbability,
      } : null,
    };
  } catch {
    return { farmName: "", location: "", soilGuide: null, weather: null };
  }
}
