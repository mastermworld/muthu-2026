import React, { useState, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Heart,
  HandHeart,
  ChevronRight,
} from "lucide-react";
import InputField from "../components/form/InputField";
import SelectField from "../components/form/SelectField";
import DateField from "../components/form/DateField";
import TextAreaField from "../components/form/TextAreaField";
import SubmitButton from "../components/form/SubmitButton";
import ImageUpload from "../components/form/ImageUpload";
import LocationDropdowns from "../components/form/LocationDropdowns";
import { translateError } from "../components/form/errorTranslations";
import { useLanguage } from "../components/layout/Navbar";
import { API_URL } from "../config/api";

// ─── Translations ────────────────────────────────────────────────────────────
interface Translations {
  [key: string]: { english: string; tamil: string };
}

const translations: Translations = {
  registrationForm: { english: "Registration Form", tamil: "பதிவு படிவம்" },
  fullName: { english: "Full Name", tamil: "முழு பெயர்" },
  fatherName: { english: "Father's Name", tamil: "தந்தையின் பெயர்" },
  motherName: { english: "Mother's Name", tamil: "தாயின் பெயர்" },
  gender: { english: "Gender", tamil: "பாலினம்" },
  mobile: { english: "Mobile & WhatsApp Number", tamil: "மொபைல் & வாட்ஸ்அப் எண்" },
  altMobile: { english: "Alternative Mobile Number", tamil: "மாற்று மொபைல் எண்" },
  email: { english: "Email Address", tamil: "மின்னஞ்சல் முகவரி" },
  birthdate: { english: "Date of Birth", tamil: "பிறந்த தேதி" },
  maritalStatus: { english: "Marital Status", tamil: "திருமண நிலை" },
  bloodGroup: { english: "Blood Group", tamil: "இரத்த வகை" },
  address: { english: "Address", tamil: "முகவரி" },
  education: { english: "Education Level", tamil: "கல்வித் தகுதி" },
  jobType: { english: "Job Type", tamil: "வேலை வகை" },
  jobDescription: { english: "Job Description", tamil: "வேலை விவரம்" },
  profilePicture: { english: "Profile Picture", tamil: "சுயவிவர படம்" },
  submit: { english: "Submit Registration", tamil: "பதிவு சமர்ப்பிக்கவும்" },
  economicStatus: { english: "Economic Status", tamil: "பொருளாதார நிலை" },
  physicallyChallenged: { english: "Physically Challenged", tamil: "மாற்றுத்திறனாளியா?" },
  orphan: { english: "Orphan", tamil: "பெற்றோர் இறந்த குழந்தை (அனாதை?)" },
  volunteering: { english: "Interested in Volunteering?", tamil: "சமூக சேவையில் ஆர்வமா?" },
  interests: { english: "Are you interested in?", tamil: "நீங்கள் ஆர்வமுள்ளவை?" },
  postalCode: { english: "Postal Code", tamil: "அஞ்சல் குறியீடு" },
};

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const surveySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  gender: z.string().min(1, "You must select an option"),
  mobileAreaCode: z.string().min(1, "You must select an option"),
  mobile: z.string().regex(/^\d{6,15}$/, "Please enter a valid phone number"),
  altMobileAreaCode: z.string().optional(),
  altMobile: z.string().optional().refine(
    (v) => !v || /^\d{6,15}$/.test(v),
    "Please enter a valid phone number"
  ),
  email: z.string().email("Please enter a valid email address"),
  birthdate: z.string()
    .min(1, "Please select your date of birth")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date")
    .refine((v) => {
      const date = new Date(v);
      return !isNaN(date.getTime());
    }, "Please enter a valid date")
    .refine((v) => new Date(v) <= new Date(), "Date of birth cannot be in the future")
    .refine((v) => new Date(v).getFullYear() >= 1900, "Year must be 1900 or later"),
  maritalStatus: z.string().min(1, "You must select an option"),
  bloodGroup: z.string().optional(),
  country: z.string().min(1, "You must select an option"),
  state: z.string().min(1, "You must select an option"),
  district: z.string().optional(),
  taluk: z.string().optional(),
  village: z.string().optional(),
  postalCode: z.string().optional().refine(
    (v) => !v || /^\d{4,10}$/.test(v),
    "Please enter a valid postal code"
  ),
  address: z.string().min(10, "Address must be at least 10 characters"),
  education: z.string().min(1, "You must select an option"),
  jobType: z.string().min(1, "You must select an option"),
  jobDescription: z.string().min(5, "Job description must be at least 5 characters"),
  economicStatus: z.string().min(1, "You must select an option"),
  physicallyChallenged: z.string().min(1, "You must select an option"),
  orphan: z.string().min(1, "You must select an option"),
  volunteering: z.string().min(1, "You must select an option"),
  interests: z.array(z.string()).optional(),
  referrer: z.string().optional(),
  profilePicture: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Profile picture is required.")
    .refine((f) => f.size <= 5 * 1024 * 1024, "File could not be compressed below 5 MB. Please use a smaller image.")
    .optional()
    .nullable(),
});

type SurveyFormData = z.infer<typeof surveySchema>;

// ─── Static Option Lists ──────────────────────────────────────────────────────
const educationLevels = [
  { value: "no-formal-education", english: "No Formal Education", tamil: "முறையான கல்வி இல்லை" },
  { value: "primary", english: "Primary School", tamil: "தொடக்கப்பள்ளி" },
  { value: "secondary", english: "Secondary School", tamil: "இடைநிலைப்பள்ளி" },
  { value: "higher-secondary", english: "Higher Secondary", tamil: "உயர்நிலை" },
  { value: "diploma", english: "Diploma", tamil: "பட்டயம்" },
  { value: "undergraduate", english: "Undergraduate", tamil: "இளங்கலை" },
  { value: "postgraduate", english: "Postgraduate", tamil: "முதுகலை" },
  { value: "doctorate", english: "Doctorate", tamil: "முனைவர்" },
  { value: "professional", english: "Professional Degree", tamil: "தொழிற்கல்வி" },
];

const jobTypes = [
  { value: "state-government", english: "State Government", tamil: "மாநில அரசு" },
  { value: "central-government", english: "Central Government", tamil: "மத்திய அரசு" },
  { value: "military", english: "Military", tamil: "இராணுவம்" },
  { value: "private", english: "Private Employee", tamil: "தனியார் ஊழியர்" },
  { value: "self-employed", english: "Self Employed", tamil: "சுயதொழில்" },
  { value: "software", english: "Software", tamil: "மென்பொருள்" },
  { value: "business", english: "Business", tamil: "வணிகம்" },
  { value: "farmer", english: "Farmer", tamil: "விவசாயி" },
  { value: "student", english: "Student", tamil: "மாணவர்" },
  { value: "housewife-homemaker", english: "Housewife / Homemaker", tamil: "இல்லத்தரசி" },
  { value: "teacher-professor", english: "Teacher / Professor", tamil: "ஆசிரியர் / பேராசிரியர்" },
  { value: "doctor", english: "Doctor", tamil: "மருத்துவர்" },
  { value: "lawyer", english: "Lawyer", tamil: "வழக்கறிஞர்" },
  { value: "industrialist", english: "Industrialist", tamil: "தொழிலதிபர்" },
  { value: "driver", english: "Driver", tamil: "ஓட்டுநர்" },
  { value: "broker", english: "Broker", tamil: "தரகர்" },
  { value: "consultant", english: "Consultant", tamil: "ஆலோசகர்" },
  { value: "retired", english: "Retired", tamil: "ஓய்வு பெற்றவர்" },
  { value: "unemployed", english: "Unemployed", tamil: "வேலையில்லாதவர்" },
  { value: "freelancer", english: "Freelancer", tamil: "சுதந்திர பணியாளர்" },
  { value: "other", english: "Other", tamil: "மற்றவை" },
];

const maritalStatuses = [
  { value: "single", english: "Single", tamil: "தனி" },
  { value: "married", english: "Married", tamil: "திருமணமானவர்" },
  { value: "divorced", english: "Divorced", tamil: "விவாகரத்து பெற்றவர்" },
  { value: "widowed", english: "Widowed", tamil: "விதவை (பெண்)" },
  { value: "widower", english: "Widower", tamil: "மனைவி இழந்தவர் (ஆண்)" },
];

const genderOptions = [
  { value: "male", english: "Male", tamil: "ஆண்" },
  { value: "female", english: "Female", tamil: "பெண்" },
  { value: "transgender", english: "Transgender", tamil: "திருநங்கை" },
];

const bloodGroupOptions = [
  { value: "A+", english: "A+", tamil: "A+" },
  { value: "A-", english: "A-", tamil: "A-" },
  { value: "B+", english: "B+", tamil: "B+" },
  { value: "B-", english: "B-", tamil: "B-" },
  { value: "AB+", english: "AB+", tamil: "AB+" },
  { value: "AB-", english: "AB-", tamil: "AB-" },
  { value: "O+", english: "O+", tamil: "O+" },
  { value: "O-", english: "O-", tamil: "O-" },
];

const economicStatusOptions = [
  { value: "poor", english: "Poor", tamil: "ஏழை" },
  { value: "below-middle-class", english: "Below Middle Class", tamil: "கீழ் நடுத்தர வர்க்கம்" },
  { value: "middle-class", english: "Middle Class", tamil: "நடுத்தர வர்க்கம்" },
  { value: "upper-middle-class", english: "Upper Middle Class", tamil: "மேல் நடுத்தர வர்க்கம்" },
  { value: "rich", english: "Rich", tamil: "செல்வந்தர்" },
];

const yesNoOptions = [
  { value: "yes", english: "Yes", tamil: "ஆம்" },
  { value: "no", english: "No", tamil: "இல்லை" },
];

const volunteeringOptions = [
  { value: "full-time", english: "Full-time", tamil: "முழு நேரம்" },
  { value: "part-time", english: "Part-time", tamil: "பகுதி நேரம்" },
  { value: "no", english: "Not Interested", tamil: "ஆர்வமில்லை" },
];

const interestsOptions = [
  { value: "not-interested", english: "Not Interested", tamil: "ஆர்வமில்லை" },
  { value: "job", english: "Job", tamil: "வேலை" },
  { value: "work-from-home", english: "Work from Home", tamil: "வீட்டிலிருந்து பணி" },
  { value: "business", english: "Business", tamil: "வணிகம்" },
  { value: "business-from-home", english: "Business from Home", tamil: "வீட்டிலிருந்து வணிகம்" },
  { value: "money-earn", english: "Money Earn", tamil: "பண சம்பாத்தியம்" },
  { value: "investment", english: "Investment", tamil: "முதலீடு" },
  { value: "marketing", english: "Marketing", tamil: "சந்தைப்படுத்தல்" },
];

const countryCodeOptions = [
  { value: "+91", english: "+91  India", tamil: "+91  இந்தியா" },
  { value: "+1", english: "+1   USA / Canada", tamil: "+1   அமெரிக்கா" },
  { value: "+44", english: "+44  UK", tamil: "+44  இங்கிலாந்து" },
  { value: "+61", english: "+61  Australia", tamil: "+61  ஆஸ்திரேலியா" },
  { value: "+65", english: "+65  Singapore", tamil: "+65  சிங்கப்பூர்" },
  { value: "+971", english: "+971 UAE", tamil: "+971 ஐக்கிய அரபு அமீரகம்" },
  { value: "+966", english: "+966 Saudi Arabia", tamil: "+966 சவுதி அரேபியா" },
  { value: "+60", english: "+60  Malaysia", tamil: "+60  மலேசியா" },
  { value: "+94", english: "+94  Sri Lanka", tamil: "+94  இலங்கை" },
  { value: "+49", english: "+49  Germany", tamil: "+49  ஜெர்மனி" },
  { value: "+33", english: "+33  France", tamil: "+33  பிரான்ஸ்" },
];

// ─── Interests Multi-Select Dropdown ─────────────────────────────────────────
function InterestsDropdown({
  label,
  language,
  options,
  value,
  onChange,
}: {
  label: string;
  language: string;
  options: { value: string; english: string; tamil: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  const displayLabel =
    value.length === 0
      ? language === "tamil" ? "தேர்ந்தெடுக்கவும்..." : "Select options..."
      : value.length === options.length
        ? language === "tamil" ? "அனைத்தும் தேர்ந்தெடுக்கப்பட்டது" : "All selected"
        : value
          .map((v) => {
            const opt = options.find((o) => o.value === v);
            return opt ? (language === "tamil" ? opt.tamil : opt.english) : v;
          })
          .join(", ");

  return (
    <div ref={ref} className="w-full">
      <label className="block text-neutral-700 font-semibold mb-2 text-sm">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-left"
      >
        <span className={value.length === 0 ? "text-neutral-400" : "text-neutral-800"}>
          {displayLabel}
        </span>
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform flex-shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 max-h-64 overflow-y-auto divide-y sm:divide-y-0">
            {options.map((opt) => {
              const checked = value.includes(opt.value);
              const optLabel = language === "tamil" ? opt.tamil : opt.english;
              return (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors ${checked ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                  />
                  <span
                    className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center ${checked ? "bg-primary-500 border-primary-500" : "border-neutral-300"
                      }`}
                  >
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm font-medium">{optLabel}</span>
                </label>
              );
            })}
          </div>
          {value.length > 0 && (
            <div className="border-t border-neutral-100 px-4 py-2 flex justify-between items-center bg-neutral-50">
              <span className="text-xs text-neutral-500">{value.length} {language === "tamil" ? "தேர்ந்தெடுக்கப்பட்டது" : "selected"}</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-accent-600 font-medium hover:text-accent-700"
              >
                {language === "tamil" ? "அனைத்தையும் நீக்கு" : "Clear all"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section Header Helper ────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  color = "primary",
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  color?: "primary" | "secondary" | "accent" | "emerald" | "violet";
}) {
  const colorMap = {
    primary: { bg: "bg-primary-100", text: "text-primary-600", border: "border-l-primary-500" },
    secondary: { bg: "bg-secondary-100", text: "text-secondary-600", border: "border-l-secondary-500" },
    accent: { bg: "bg-accent-100", text: "text-accent-600", border: "border-l-accent-500" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-l-emerald-500" },
    violet: { bg: "bg-violet-100", text: "text-violet-600", border: "border-l-violet-500" },
  };
  const c = colorMap[color];

  return (
    <div className={`flex items-center gap-4 mb-8 pl-4 border-l-4 ${c.border}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-neutral-800 leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Submission Success Popup ────────────────────────────────────────────────
function SubmissionSuccessPopup({
  onClose,
  language,
}: {
  onClose: () => void;
  language: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="success-popup-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <h2 id="success-popup-title" className="text-white font-bold text-xl leading-tight">
              {language === "tamil" ? "வெற்றிகரமாக பதிவு செய்யப்பட்டது!" : "Registration Successful!"}
            </h2>
            <p className="text-white/85 text-sm mt-1">
              {language === "tamil"
                ? "உங்கள் விவரங்கள் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டன."
                : "Your details have been submitted successfully."}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-center">
          <p className="text-neutral-600 text-sm">
            {language === "tamil"
              ? "நன்றி! முத்தரையர் சமூக பதிவில் உங்கள் பங்களிப்பு மதிப்புமிக்கது."
              : "Thank you! Your contribution to the Mutharaiyar community census is valued."}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
          >
            {language === "tamil" ? "மூடு" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Submission Error Popup ───────────────────────────────────────────────────
function SubmissionErrorPopup({
  errors,
  onClose,
  language,
}: {
  errors: Record<string, string>;
  onClose: () => void;
  language: string;
}) {
  const errorList = Object.entries(errors);
  if (errorList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="error-popup-title">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-6 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 id="error-popup-title" className="text-white font-bold text-lg leading-tight">
            {language === "tamil" ? "சமர்ப்பிப்பு தோல்வியடைந்தது" : "Submission Failed"}
          </h2>
        </div>
        <div className="px-6 py-5 text-center">
          <p className="text-neutral-700 text-sm">
            {language === "tamil"
              ? "படிவம் சமர்ப்பிக்க முடியவில்லை. படிவத்திற்குத் திரும்பி தவறுகளை சரிசெய்யவும்."
              : "The form could not be submitted. Please go back and correct the highlighted errors."}
          </p>
        </div>
        <div className="px-6 pb-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
          >
            {language === "tamil" ? "சரி, திருத்துகிறேன்" : "OK, I'll fix it"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SurveyForm() {
  const { language } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);

  const [locationData, setLocationData] = useState<{
    country?: string; state?: string; district?: string; taluk?: string; village?: string;
  }>({ country: "india", state: "tamilnadu", district: "", taluk: "", village: "" });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupErrors, setPopupErrors] = useState<Record<string, string>>({});

  const t = (key: string) => translations[key]?.[language] ?? key;

  const toOptions = (list: { value: string; english: string; tamil: string }[]) =>
    list.map((o) => ({ value: o.value, label: language === "tamil" ? o.tamil : o.english }));

  const {
    register, handleSubmit, formState: { errors },
    setValue, reset, control, setError,
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      fullName: "", fatherName: "", motherName: "",
      gender: "",
      mobileAreaCode: "+91", mobile: "",
      altMobileAreaCode: "+91", altMobile: "",
      email: "", birthdate: "",
      maritalStatus: "", bloodGroup: "",
      country: "india", state: "tamilnadu",
      district: "", taluk: "", village: "", postalCode: "", address: "",
      education: "", jobType: "", jobDescription: "",
      economicStatus: "",
      physicallyChallenged: "",
      orphan: "",
      volunteering: "",
      interests: [],
      referrer: "",
      profilePicture: null,
    },
    mode: "onSubmit",
  });

  const handleLocationChange = (loc: typeof locationData) => {
    setLocationData(loc);
    setValue("country", loc.country || "");
    setValue("state", loc.state || "");
    setValue("district", loc.district || "");
    setValue("taluk", loc.taluk || "");
    setValue("village", loc.village || "");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const els = formRef.current?.querySelectorAll(
      "input:not([type='hidden']), select, textarea"
    ) as NodeListOf<HTMLElement>;
    if (!els) return;
    const idx = Array.from(els).indexOf(e.currentTarget as HTMLElement);
    if (idx < els.length - 1) els[idx + 1].focus();
    else handleSubmit(onSubmit)();
  };

  const mutation = useMutation({
    mutationFn: async (data: SurveyFormData) => {
      const formData = new FormData();
      (Object.keys(data) as (keyof SurveyFormData)[]).forEach((key) => {
        const val = data[key];
        if (val === undefined || val === null || val === "") return;
        if (key === "profilePicture" && val instanceof File) {
          formData.append(key, val);
        } else if (Array.isArray(val)) {
          if (val.length > 0) formData.append(key, JSON.stringify(val));
        } else if (typeof val === "string") {
          formData.append(key, val);
        }
      });
      const res = await fetch(`${API_URL}/api/survey`, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        const error = new Error(err.message || "Something went wrong") as Error & { field?: string; statusCode?: number };
        error.field = err.field;
        error.statusCode = res.status;
        throw error;
      }
      return res.json();
    },
    onSuccess: () => {
      setShowSuccessPopup(true);
      reset();
      setLocationData({ country: "india", state: "tamilnadu", district: "", taluk: "", village: "" });
      setSelectedInterests([]);
    },
    onError: (error: Error & { field?: string; statusCode?: number }) => {
      if (error.statusCode === 409) {
        if (error.field === 'mobile') {
          setError('mobile', { type: 'manual', message: language === 'tamil' ? 'இந்த மொபைல் எண் ஏற்கனவே பதிவாகியுள்ளது.' : error.message });
        } else if (error.field === 'email') {
          setError('email', { type: 'manual', message: language === 'tamil' ? 'இந்த மின்னஞ்சல் முகவரி ஏற்கனவே பதிவாகியுள்ளது.' : error.message });
        } else if (error.field === 'altMobile') {
          setError('altMobile', { type: 'manual', message: language === 'tamil' ? 'இந்த மாற்று மொபைல் எண் ஏற்கனவே பதிவாகியுள்ளது.' : error.message });
        }
      } else {
        alert(language === 'tamil' ? `சமர்ப்பிப்பு தோல்வி: ${error.message}` : `Submission failed: ${error.message}`);
      }
    },
  });

  const buildPopupErrors = (errs: typeof errors) => {
    const isT = language === "tamil";
    const fieldLabels: Record<string, string> = {
      fullName: isT ? "முழு பெயர்" : "Full Name",
      gender: isT ? "பாலினம்" : "Gender",
      mobileAreaCode: isT ? "நாட்டுக்குரல்" : "Country Code",
      mobile: isT ? "மொபைல் எண்" : "Mobile Number",
      altMobile: isT ? "மாற்று மொபைல்" : "Alternative Mobile",
      email: isT ? "மின்னஞ்சல்" : "Email Address",
      birthdate: isT ? "பிறந்த தேதி" : "Date of Birth",
      maritalStatus: isT ? "திருமண நிலை" : "Marital Status",
      country: isT ? "நாடு" : "Country",
      state: isT ? "மாநிலம்" : "State / Province",
      address: isT ? "முகவரி" : "Address",
      education: isT ? "கல்வித் தகுதி" : "Education Level",
      jobType: isT ? "வேலை வகை" : "Job Type",
      jobDescription: isT ? "வேலை விவரம்" : "Job Description",
      economicStatus: isT ? "பொருளாதார நிலை" : "Economic Status",
      physicallyChallenged: isT ? "மாற்றுத்திறனாளி" : "Physically Challenged",
      orphan: isT ? "அநாதை" : "Orphan",
      volunteering: isT ? "தொண்டூழியம்" : "Volunteering",
      profilePicture: isT ? "சுயவிவர படம்" : "Profile Picture",
    };
    const map: Record<string, string> = {};
    (Object.keys(errs) as (keyof typeof errs)[]).forEach((key) => {
      const msg = (errs[key] as { message?: string })?.message;
      if (msg) map[fieldLabels[key] ?? String(key)] = msg;
    });
    return map;
  };

  // Scrolls to the first field that has a validation error
  const scrollToFirstError = (errs: typeof errors) => {
    // Field order must match DOM order so we scroll to the topmost error
    const fieldOrder: (keyof typeof errs)[] = [
      "profilePicture",
      "fullName", "gender", "fatherName", "motherName", "birthdate", "maritalStatus", "bloodGroup",
      "mobileAreaCode", "mobile", "altMobile", "email",
      "country", "state", "postalCode", "address",
      "education", "jobType", "jobDescription",
      "economicStatus", "physicallyChallenged", "orphan", "volunteering",
    ];
    for (const field of fieldOrder) {
      if (errs[field]) {
        setTimeout(() => {
          const el = document.getElementById(String(field));
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            // Focus the element if it supports focus
            try { (el as HTMLElement).focus({ preventScroll: true }); } catch { }
          }
        }, 100);
        break;
      }
    }
  };

  const onSubmit: SubmitHandler<SurveyFormData> = (data) => {
    if (!data.profilePicture) {
      const profileErr = language === 'tamil' ? 'சுயவிவர படம் அவசியம்.' : 'Profile picture is required.';
      setError("profilePicture", { type: "manual", message: profileErr });
      setPopupErrors({ [language === 'tamil' ? 'சுயவிவர படம்' : 'Profile Picture']: profileErr });
      setShowErrorPopup(true);
      setTimeout(() => {
        const el = document.getElementById("profilePicture");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }
    mutation.mutate(data);
  };

  // Called by react-hook-form when validation fails before onSubmit
  const onInvalid = (errs: typeof errors) => {
    const map = buildPopupErrors(errs);
    setPopupErrors(map);
    setShowErrorPopup(true);
    scrollToFirstError(errs);
  };

  return (
    <>
      {showSuccessPopup && (
        <SubmissionSuccessPopup
          onClose={() => setShowSuccessPopup(false)}
          language={language}
        />
      )}
      {showErrorPopup && (
        <SubmissionErrorPopup
          errors={popupErrors}
          onClose={() => setShowErrorPopup(false)}
          language={language}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/40 to-secondary-50/40">

        {/* ── Intro Banner ─────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 text-white py-10 px-4 text-center">

          <div className="max-w-2xl mx-auto space-y-2 text-white/90 text-sm sm:text-base">
            {language === 'tamil' ? (
              <>
                <p className="font-bold text-base sm:text-lg">மக்கள் தொகை கணக்கெடுப்பினால் ஏற்படும் நன்மைகள்?</p>
                <p>மிகப் பெரும்பான்மை சமுதாயமாக மாறும். அரசியலில் பல மாற்றங்கள் நிகழும். நம்மினத்தில் ஒருங்கிணைப்பு வேகமாக நடைபெறும்.</p>
                <p className="font-bold text-base sm:text-lg pt-1">யார் யார் பதிவு செய்ய வேண்டும்?</p>
                <p>முத்தரையர் இனத்தில் பிறந்த குழந்தைகள் முதல் பெரியவர்கள் வரை அனைவரும் கட்டாயம் பதிவு செய்ய வேண்டும்.</p>
              </>
            ) : (
              <>
                <p className="font-bold text-base sm:text-lg">Benefits of the Population Census?</p>
                <p>We will become one of the largest communities. Many political changes will happen. Community unity will accelerate.</p>
                <p className="font-bold text-base sm:text-lg pt-1">Who should register?</p>
                <p>Everyone born in the Mutharaiyar community, from children to elders, must register.</p>
              </>
            )}
          </div>
        </div>

        {/* ── Form Container ────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          <form ref={formRef} onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>

            {/* ── Section 1: Profile Photo ─────────────────────────────── */}
            <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-3 text-center">{t("registrationForm")}</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                <div className="flex justify-center md:justify-start ">
                  <img
                    src="/logo.jpg"
                    alt={language === "tamil" ? "முத்தரையர் கிளப் சின்னம்" : "Mutharaiyar Club logo"}
                    className="w-80 h-80 sm:w-80 sm:h-80 md:w-80 md:h-80 object-contain select-none"
                    draggable={false}
                  />
                </div>
                <div className="flex-1 flex justify-center min-w-0">
                  <div className="w-full max-w-xs">
                    <Controller
                      name="profilePicture"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <ImageUpload
                          label={t("profilePicture")}
                          error={errors.profilePicture}
                          onChange={onChange}
                          value={value || null}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Personal Information ──────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField
                  label={t("fullName")}
                  name="fullName"
                  register={register}
                  error={errors.fullName}
                  placeholder={language === "tamil" ? "உங்கள் முழு பெயர்" : "Enter your full name"}
                  uppercase
                  onKeyDown={handleKeyDown}
                  language={language}
                />

                <SelectField
                  label={t("gender")}
                  name="gender"
                  register={register}
                  error={errors.gender}
                  options={toOptions(genderOptions)}
                  placeholder={language === "tamil" ? "பாலினம் தேர்ந்தெடுக்கவும்" : "Select your gender"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />

                <InputField
                  label={t("fatherName")}
                  name="fatherName"
                  register={register}
                  error={errors.fatherName}
                  placeholder={language === "tamil" ? "தந்தையின் பெயர்" : "Enter father's name"}
                  uppercase
                  onKeyDown={handleKeyDown}
                />

                <InputField
                  label={t("motherName")}
                  name="motherName"
                  register={register}
                  error={errors.motherName}
                  placeholder={language === "tamil" ? "தாயின் பெயர்" : "Enter mother's name"}
                  uppercase
                  onKeyDown={handleKeyDown}
                />

                <DateField
                  label={t("birthdate")}
                  name="birthdate"
                  register={register}
                  error={errors.birthdate}
                  onKeyDown={handleKeyDown}
                  language={language}
                />

                <SelectField
                  label={t("maritalStatus")}
                  name="maritalStatus"
                  register={register}
                  error={errors.maritalStatus}
                  options={toOptions(maritalStatuses)}
                  placeholder={language === "tamil" ? "திருமண நிலை தேர்ந்தெடுக்கவும்" : "Select marital status"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />

                <InputField
                  label={language === "tamil" ? "பரிந்துரைத்தவர் (விரும்பினால்)" : "Referrer (Optional)"}
                  name="referrer"
                  register={register}
                  error={errors.referrer}
                  placeholder={language === "tamil" ? "பரிந்துரைத்தவர் பெயர்" : "Enter referrer's name"}
                  uppercase
                  onKeyDown={handleKeyDown}
                />

                <SelectField
                  label={t("bloodGroup")}
                  name="bloodGroup"
                  register={register}
                  error={errors.bloodGroup}
                  options={toOptions(bloodGroupOptions)}
                  placeholder={language === "tamil" ? "இரத்த வகை (விரும்பினால்)" : "Select blood group (optional)"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />
              </div>
            </div>

            {/* ── Section 3: Contact Information ───────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Mobile & WhatsApp with country code */}
                <div className="w-full">
                  <label htmlFor="mobile" className="block text-neutral-700 font-semibold mb-2 text-sm">
                    {t("mobile")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="mobileAreaCode"
                      {...register("mobileAreaCode")}
                      onKeyDown={handleKeyDown}
                      className={`w-28 sm:w-32 flex-shrink-0 px-2 py-3 bg-white border rounded-lg text-sm font-medium text-neutral-800 appearance-none focus:outline-none focus:ring-2 transition-all ${errors.mobileAreaCode
                        ? "border-red-300 focus:ring-red-200"
                        : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
                        }`}
                    >
                      {toOptions(countryCodeOptions).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      {...register("mobile")}
                      placeholder={language === "tamil" ? "மொபைல் & வாட்ஸ்அப் எண்" : "Mobile & WhatsApp number"}
                      onKeyDown={handleKeyDown}
                      className={`flex-1 px-4 py-3 bg-white border rounded-lg text-neutral-800 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${errors.mobile
                        ? "border-red-300 focus:ring-red-200"
                        : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
                        }`}
                    />
                  </div>
                  {(errors.mobile || errors.mobileAreaCode) && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
                      {translateError(errors.mobile?.message ?? errors.mobileAreaCode?.message, language)}
                    </p>
                  )}
                </div>

                {/* Alternative Mobile (optional) */}
                <div className="w-full">
                  <label htmlFor="altMobile" className="block text-neutral-700 font-semibold mb-2 text-sm">
                    {t("altMobile")} <span className="text-neutral-400 text-xs font-normal">({language === "tamil" ? "விரும்பினால்" : "optional"})</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="altMobileAreaCode"
                      {...register("altMobileAreaCode")}
                      onKeyDown={handleKeyDown}
                      className="w-28 sm:w-32 flex-shrink-0 px-2 py-3 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-800 appearance-none focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/20 transition-all"
                    >
                      {toOptions(countryCodeOptions).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <input
                      id="altMobile"
                      type="tel"
                      inputMode="numeric"
                      {...register("altMobile")}
                      placeholder={language === "tamil" ? "மாற்று மொபைல் எண்" : "Alternative number"}
                      onKeyDown={handleKeyDown}
                      className={`flex-1 px-4 py-3 bg-white border rounded-lg text-neutral-800 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${errors.altMobile
                        ? "border-red-300 focus:ring-red-200"
                        : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
                        }`}
                    />
                  </div>
                  {errors.altMobile && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
                      {translateError(errors.altMobile.message, language)}
                    </p>
                  )}
                </div>

                <InputField
                  label={t("email")}
                  name="email"
                  register={register}
                  error={errors.email}
                  placeholder={language === "tamil" ? "மின்னஞ்சல் முகவரி" : "your@email.com"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />
              </div>
            </div>

            {/* ── Section 4: Address ────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">

              <LocationDropdowns
                value={locationData}
                onChange={handleLocationChange}
                required={true}
                className="mb-6"
                errors={{
                  country: errors.country ? (language === "tamil" ? "நீங்கள் ஒரு விருப்பத்தை தேர்ந்தெடுக்க வேண்டும்." : errors.country.message) : undefined,
                  state: errors.state ? (language === "tamil" ? "நீங்கள் ஒரு விருப்பத்தை தேர்ந்தெடுக்க வேண்டும்." : errors.state.message) : undefined,
                }}
              />
              <div className="mb-6">
                <InputField
                  label={t("postalCode")}
                  name="postalCode"
                  register={register}
                  error={errors.postalCode}
                  placeholder={language === "tamil" ? "அஞ்சல் குறியீடு (விரும்பினால்)" : "Postal / PIN code (optional)"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />
              </div>
              <TextAreaField
                label={t("address")}
                name="address"
                register={register}
                error={errors.address}
                placeholder={
                  language === "tamil"
                    ? "தெரு, நகரம், அஞ்சல் குறியீடு உள்ளிட்ட முழு முகவரி"
                    : "Door no., street, city, postal code"
                }
                rows={3}
                onKeyDown={handleKeyDown}
                language={language}
              />
            </div>

            {/* ── Section 5: Career & Education ────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <SelectField
                  label={t("education")}
                  name="education"
                  register={register}
                  error={errors.education}
                  options={toOptions(educationLevels)}
                  placeholder={language === "tamil" ? "கல்வித் தகுதி தேர்ந்தெடுக்கவும்" : "Select education level"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />
                <SelectField
                  label={t("jobType")}
                  name="jobType"
                  register={register}
                  error={errors.jobType}
                  options={toOptions(jobTypes)}
                  placeholder={language === "tamil" ? "வேலை வகை தேர்ந்தெடுக்கவும்" : "Select job type"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />
              </div>
              <TextAreaField
                label={t("jobDescription")}
                name="jobDescription"
                register={register}
                error={errors.jobDescription}
                placeholder={
                  language === "tamil"
                    ? "உங்கள் தொழிலைப் பற்றி சுருக்கமாக விவரிக்கவும்"
                    : "Briefly describe your current job or occupation"
                }
                rows={3}
                onKeyDown={handleKeyDown}
                language={language}
              />
            </div>

            {/* ── Section 6: Social & Welfare Details ──────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SelectField
                  label={t("economicStatus")}
                  name="economicStatus"
                  register={register}
                  error={errors.economicStatus}
                  options={toOptions(economicStatusOptions)}
                  placeholder={language === "tamil" ? "பொருளாதார நிலை தேர்ந்தெடுக்கவும்" : "Select economic status"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />

                <SelectField
                  label={t("physicallyChallenged")}
                  name="physicallyChallenged"
                  register={register}
                  error={errors.physicallyChallenged}
                  options={toOptions(yesNoOptions)}
                  placeholder={language === "tamil" ? "தேர்ந்தெடுக்கவும்" : "Select an option"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />

                <SelectField
                  label={t("orphan")}
                  name="orphan"
                  register={register}
                  error={errors.orphan}
                  options={toOptions(yesNoOptions)}
                  placeholder={language === "tamil" ? "தேர்ந்தெடுக்கவும்" : "Select an option"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />

                <SelectField
                  label={t("volunteering")}
                  name="volunteering"
                  register={register}
                  error={errors.volunteering}
                  options={toOptions(volunteeringOptions)}
                  placeholder={language === "tamil" ? "தேர்ந்தெடுக்கவும்" : "Select an option"}
                  onKeyDown={handleKeyDown}
                  language={language}
                />
              </div>
            </div>

            {/* ── Section 7: Interests multi-select dropdown ───────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">
              <InterestsDropdown
                label={t("interests")}
                language={language}
                options={interestsOptions}
                value={selectedInterests}
                onChange={(next) => { setSelectedInterests(next); setValue("interests", next); }}
              />
            </div>

            {/* ── Submit ────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">

              <SubmitButton
                isSubmitting={mutation.isPending}
                isValid={true}
                className="py-4 text-lg font-bold"
              >
                <span className="flex items-center gap-2">
                  {t("submit")}
                  <ChevronRight className="w-5 h-5" />
                </span>
              </SubmitButton>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
