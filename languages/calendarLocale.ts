import { LocaleConfig } from "react-native-calendars";

// Desteklenen diller için TypeScript tipi
type LocaleType = {
  monthNames: string[];
  monthNamesShort: string[];
  dayNames: string[];
  dayNamesShort: string[];
  today: string;
  firstDay: number;
};

// Desteklenen dilleri burada tanımlıyoruz
const locales: Record<string, LocaleType> = {
  en: {
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    monthNamesShort: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    dayNames: [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    today: "Today",
    firstDay: 0, // first day is sunday
  },
  tr: {
    monthNames: [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
    ],
    monthNamesShort: [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
    ],
    dayNames: [
      "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
    ],
    dayNamesShort: ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cmt"],
    today: "Bugün",
    firstDay: 1, // first day is Monday
  },
};

// Takvim dilini dinamik olarak güncelleyen fonksiyon
export const setupCalendarLocale = (language: string) => {
  if (locales[language]) {
    LocaleConfig.locales[language] = locales[language]; // set up days and months
    LocaleConfig.defaultLocale = language;
  } else {
    console.warn(`Language ${language} is not supported, defaulting to English.`);
    LocaleConfig.defaultLocale = "en";
  }
};
