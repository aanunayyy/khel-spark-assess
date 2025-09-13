import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'english' | 'hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations object
const translations = {
  english: {
    // App Name
    appName: 'KHELPHEL',
    
    // Common
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Authentication
    signInTitle: 'Sign In to KHELPHEL',
    signUpTitle: 'Join KHELPHEL',
    selectRole: 'Select Your Role',
    athlete: 'Athlete',
    official: 'Sports Official',
    athleteDesc: 'Record and track your fitness performance',
    officialDesc: 'Verify and assess athlete submissions',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    
    // Dashboard
    dashboard: 'Dashboard',
    welcomeBack: 'Welcome Back',
    myTests: 'My Tests',
    achievements: 'Achievements',
    progress: 'Progress',
    profile: 'Profile',
    
    // Fitness Tests
    fitnessTests: 'Fitness Tests',
    verticalJump: 'Vertical Jump',
    pushups: 'Push-ups',
    situps: 'Sit-ups',
    squats: 'Squats',
    shuttleRun: 'Shuttle Run',
    enduranceRun: 'Endurance Run',
    recordVideo: 'Record Video',
    uploadVideo: 'Upload Video',
    
    // Performance
    height: 'Height',
    repetitions: 'Repetitions',
    distance: 'Distance',
    time: 'Time',
    depth: 'Depth',
    
    // Gamification
    levelUp: 'Level Up!',
    newBadge: 'New Badge Unlocked!',
    betterThanPrevious: 'Better than Previous!',
    personalBest: 'Personal Best!',
    firstTime: 'First Time Achievement!',
    
    // Status
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
    
    // Officials
    athleteProfiles: 'Athlete Profiles',
    submissions: 'Submissions',
    verification: 'Verification',
    approveSubmission: 'Approve',
    rejectSubmission: 'Reject',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    logout: 'Logout',
    
    // Messages
    videoUploadSuccess: 'Video uploaded successfully!',
    profileUpdated: 'Profile updated successfully!',
    loginSuccess: 'Login successful!',
    signupSuccess: 'Account created successfully!',
    
    // Error Messages
    invalidCredentials: 'Invalid email or password',
    networkError: 'Network error. Please try again.',
    uploadError: 'Failed to upload video. Please try again.',
  },
  
  hindi: {
    // App Name
    appName: 'खेलफेल',
    
    // Common
    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    phone: 'फोन नंबर',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    back: 'वापस',
    next: 'अगला',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    
    // Authentication
    signInTitle: 'खेलफेल में साइन इन करें',
    signUpTitle: 'खेलफेल में शामिल हों',
    selectRole: 'अपनी भूमिका चुनें',
    athlete: 'एथलीट',
    official: 'खेल अधिकारी',
    athleteDesc: 'अपने फिटनेस प्रदर्शन को रिकॉर्ड और ट्रैक करें',
    officialDesc: 'एथलीट सबमिशन को सत्यापित और मूल्यांकन करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    noAccount: 'कोई खाता नहीं है?',
    hasAccount: 'पहले से खाता है?',
    
    // Dashboard
    dashboard: 'डैशबोर्ड',
    welcomeBack: 'वापसी पर स्वागत है',
    myTests: 'मेरे टेस्ट',
    achievements: 'उपलब्धियां',
    progress: 'प्रगति',
    profile: 'प्रोफाइल',
    
    // Fitness Tests
    fitnessTests: 'फिटनेस टेस्ट',
    verticalJump: 'वर्टिकल जंप',
    pushups: 'पुश-अप्स',
    situps: 'सिट-अप्स',
    squats: 'स्क्वैट्स',
    shuttleRun: 'शटल रन',
    enduranceRun: 'सहनशीलता दौड़',
    recordVideo: 'वीडियो रिकॉर्ड करें',
    uploadVideo: 'वीडियो अपलोड करें',
    
    // Performance
    height: 'ऊंचाई',
    repetitions: 'दोहराव',
    distance: 'दूरी',
    time: 'समय',
    depth: 'गहराई',
    
    // Gamification
    levelUp: 'लेवल अप!',
    newBadge: 'नया बैज अनलॉक!',
    betterThanPrevious: 'पिछले से बेहतर!',
    personalBest: 'व्यक्तिगत सर्वश्रेष्ठ!',
    firstTime: 'पहली बार उपलब्धि!',
    
    // Status
    pending: 'लंबित',
    approved: 'अनुमोदित',
    rejected: 'अस्वीकृत',
    processing: 'प्रसंस्करण',
    
    // Officials
    athleteProfiles: 'एथलीट प्रोफाइल',
    submissions: 'सबमिशन',
    verification: 'सत्यापन',
    approveSubmission: 'अनुमोदन',
    rejectSubmission: 'अस्वीकार',
    
    // Settings
    settings: 'सेटिंग्स',
    language: 'भाषा',
    logout: 'लॉगआउट',
    
    // Messages
    videoUploadSuccess: 'वीडियो सफलतापूर्वक अपलोड हुआ!',
    profileUpdated: 'प्रोफाइल सफलतापूर्वक अपडेट हुआ!',
    loginSuccess: 'लॉगिन सफल!',
    signupSuccess: 'खाता सफलतापूर्वक बनाया गया!',
    
    // Error Messages
    invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
    networkError: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
    uploadError: 'वीडियो अपलोड करने में विफल। कृपया पुनः प्रयास करें।',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('khelphel-language') as Language;
    if (savedLanguage && (savedLanguage === 'english' || savedLanguage === 'hindi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('khelphel-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};