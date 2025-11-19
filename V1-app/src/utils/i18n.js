/**
 * Internationalization utility for BhaktiBhraman
 * Supports English and Hindi languages
 */

const translations = {
  en: {
    // Navigation
    home: "Home",
    plan: "Plan",
    hotels: "Hotels",
    donate: "Donate",
    profile: "Profile",

    // Home Screen
    searchPlaceholder: "Search temples, places...",
    featuredTemples: "Featured Temples",

    // Plan Trip Screen
    planYourTrip: "Plan Your Trip",
    from: "From",
    toTemple: "To Temple",
    travelMode: "Travel Mode",
    duration: "Duration (Days)",
    travelDate: "Travel Date",
    numberOfTravelers: "Number of Travelers",
    budgetLevel: "Budget Level",
    getCostEstimate: "Get Cost Estimate",

    // Travel Modes
    flight: "Flight",
    train: "Train",
    car: "Car",

    // Budget Levels
    budget: "Budget",
    medium: "Medium",
    luxury: "Luxury",

    // Cost Estimate Screen
    aiPoweredCostBreakdown: "AI-Powered Cost Breakdown",
    transportation: "Transportation",
    accommodation: "Accommodation",
    foodMeals: "Food & Meals",
    templeEntryDarshan: "Temple Entry & Darshan",
    localTransportation: "Local Transportation",
    miscellaneous: "Miscellaneous",
    totalEstimatedCost: "Total Estimated Cost",
    aiTip: "AI Tip:",

    // Hotels Screen
    hotelsNearTemple: "Hotels Near Temple",
    filterByAmenities: "Filter by amenities, price...",
    budgetFriendlyOptions: "Budget-Friendly Options",
    bookNow: "Book Now",

    // Donation Screen
    templeDonation: "Temple Donation",
    verifiedTempleTrust: "Verified Temple Trust",
    selectDonationAmount: "Select Donation Amount",
    customAmount: "Custom Amount (₹)",
    donationPurpose: "Donation Purpose (Optional)",
    generalDonation: "General Donation",
    prasadFood: "Prasad & Food",
    templeMaintenance: "Temple Maintenance",
    festivalCelebration: "Festival Celebration",
    donationSummary: "Donation Summary",
    temple: "Temple",
    amount: "Amount",
    purpose: "Purpose",
    donateAction: "Donate",
    securityNote:
      "Your donation is secure and will be processed through Razorpay",

    // Profile Screen
    welcomeToBhaktiBhraman: "Welcome to BhaktiBhraman",
    signInToAccess: "Sign in to access your profile",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    dontHaveAccount: "Don't have an account? Sign up",
    personalInformation: "Personal Information",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    saveChanges: "Save Changes",
    preferences: "Preferences",
    language: "Language",
    pushNotifications: "Push Notifications",
    activitySummary: "Activity Summary",
    templesVisited: "Temples Visited",
    totalDonations: "Total Donations",
    tripsPlanned: "Trips Planned",
    donationHistory: "Donation History",
    savedTemples: "Saved Temples",
    helpSupport: "Help & Support",
    privacyPolicy: "Privacy Policy",
    logout: "Logout",

    // Common
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    ok: "OK",
    loading: "Loading...",
    retry: "Retry",

    // Messages
    fillAllFields: "Please fill in all fields",
    loginFailed: "Login Failed",
    invalidCredentials: "Invalid credentials",
    profileUpdated: "Profile updated successfully",
    donationSuccessful: "Donation Successful!",
    thankYouDonation: "Thank you for your donation",
    receiptSentEmail: "Your receipt will be sent via email",
    logoutConfirm: "Are you sure you want to logout?",
    enterValidAmount: "Please enter a valid donation amount",
  },

  hi: {
    // Navigation
    home: "होम",
    plan: "योजना",
    hotels: "होटल",
    donate: "दान",
    profile: "प्रोफ़ाइल",

    // Home Screen
    searchPlaceholder: "मंदिर, स्थान खोजें...",
    featuredTemples: "प्रमुख मंदिर",

    // Plan Trip Screen
    planYourTrip: "अपनी यात्रा की योजना बनाएं",
    from: "से",
    toTemple: "मंदिर तक",
    travelMode: "यात्रा का तरीका",
    duration: "अवधि (दिन)",
    travelDate: "यात्रा की तारीख",
    numberOfTravelers: "यात्रियों की संख्या",
    budgetLevel: "बजट स्तर",
    getCostEstimate: "लागत अनुमान प्राप्त करें",

    // Travel Modes
    flight: "हवाई जहाज",
    train: "रेल",
    car: "कार",

    // Budget Levels
    budget: "बजट",
    medium: "मध्यम",
    luxury: "लक्जरी",

    // Cost Estimate Screen
    aiPoweredCostBreakdown: "AI-संचालित लागत विवरण",
    transportation: "परिवहन",
    accommodation: "आवास",
    foodMeals: "भोजन और खाना",
    templeEntryDarshan: "मंदिर प्रवेश और दर्शन",
    localTransportation: "स्थानीय परिवहन",
    miscellaneous: "विविध",
    totalEstimatedCost: "कुल अनुमानित लागत",
    aiTip: "AI सुझाव:",

    // Hotels Screen
    hotelsNearTemple: "मंदिर के पास होटल",
    filterByAmenities: "सुविधाओं, कीमत से फ़िल्टर करें...",
    budgetFriendlyOptions: "बजट-अनुकूल विकल्प",
    bookNow: "अभी बुक करें",

    // Donation Screen
    templeDonation: "मंदिर दान",
    verifiedTempleTrust: "सत्यापित मंदिर ट्रस्ट",
    selectDonationAmount: "दान राशि चुनें",
    customAmount: "कस्टम राशि (₹)",
    donationPurpose: "दान का उद्देश्य (वैकल्पिक)",
    generalDonation: "सामान्य दान",
    prasadFood: "प्रसाद और भोजन",
    templeMaintenance: "मंदिर रखरखाव",
    festivalCelebration: "त्योहार उत्सव",
    donationSummary: "दान सारांश",
    temple: "मंदिर",
    amount: "राशि",
    purpose: "उद्देश्य",
    donateAction: "दान करें",
    securityNote:
      "आपका दान सुरक्षित है और Razorpay के माध्यम से संसाधित किया जाएगा",

    // Profile Screen
    welcomeToBhaktiBhraman: "भक्तिभ्रमण में आपका स्वागत है",
    signInToAccess: "अपनी प्रोफ़ाइल तक पहुंचने के लिए साइन इन करें",
    email: "ईमेल",
    password: "पासवर्ड",
    signIn: "साइन इन",
    dontHaveAccount: "खाता नहीं है? साइन अप करें",
    personalInformation: "व्यक्तिगत जानकारी",
    fullName: "पूरा नाम",
    phoneNumber: "फ़ोन नंबर",
    saveChanges: "परिवर्तन सहेजें",
    preferences: "प्राथमिकताएं",
    language: "भाषा",
    pushNotifications: "पुश नोटिफिकेशन",
    activitySummary: "गतिविधि सारांश",
    templesVisited: "मंदिर दर्शन",
    totalDonations: "कुल दान",
    tripsPlanned: "योजनाबद्ध यात्राएं",
    donationHistory: "दान इतिहास",
    savedTemples: "सहेजे गए मंदिर",
    helpSupport: "सहायता और समर्थन",
    privacyPolicy: "गोपनीयता नीति",
    logout: "लॉगआउट",

    // Common
    error: "त्रुटि",
    success: "सफलता",
    cancel: "रद्द करें",
    ok: "ठीक है",
    loading: "लोड हो रहा है...",
    retry: "पुनः प्रयास करें",

    // Messages
    fillAllFields: "कृपया सभी फ़ील्ड भरें",
    loginFailed: "लॉगिन असफल",
    invalidCredentials: "अमान्य क्रेडेंशियल",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
    donationSuccessful: "दान सफल!",
    thankYouDonation: "आपके दान के लिए धन्यवाद",
    receiptSentEmail: "आपकी रसीद ईमेल के माध्यम से भेजी जाएगी",
    logoutConfirm: "क्या आप वाकई लॉगआउट करना चाहते हैं?",
    enterValidAmount: "कृपया एक वैध दान राशि दर्ज करें",
  },
};

let currentLanguage = "en";

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
  }
};

export const getCurrentLanguage = () => currentLanguage;

export const t = (key) => {
  const keys = key.split(".");
  let value = translations[currentLanguage];

  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && value[fallbackKey]) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found in any language
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
};

export const getAvailableLanguages = () => [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
];

export default {
  t,
  setLanguage,
  getCurrentLanguage,
  getAvailableLanguages,
};
