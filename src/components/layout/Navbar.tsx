import React, { useState, createContext, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu, X, BarChart3, FileText, Sparkles, HelpCircle,
  Download, Users, HandHeart, Building, Heart, Languages,
} from "lucide-react";

// ─── Language Context ─────────────────────────────────────────────────────────
interface LanguageContextType {
  language: "english" | "tamil";
  setLanguage: (lang: "english" | "tamil") => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "english",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<"english" | "tamil">("english");
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ─── Nav data ────────────────────────────────────────────────────────────────
interface NavItem {
  labelEn: string;
  labelTa: string;
  icon: React.ElementType;
  gradient: string;
  to?: string;
  dropdown?: { to: string; labelEn: string; labelTa: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  {
    labelEn: "Survey", labelTa: "கணக்கெடுப்பு",
    icon: BarChart3,
    gradient: "from-orange-500 to-orange-600",
    dropdown: [
      { to: "/", icon: FileText, labelEn: "Registration", labelTa: "பதிவு" },
      { to: "/idcards/user", icon: Download, labelEn: "Download ID Card", labelTa: "அடையாள அட்டை பதிவிறக்கம்" },
    ],
  },
  {
    labelEn: "Mutharaiyar", labelTa: "முத்தரையர்",
    icon: Sparkles,
    gradient: "from-yellow-500 to-yellow-600",
    dropdown: [
      { to: "/29-subcastes", icon: Users, labelEn: "29 Subcastes", labelTa: "29 உட்பிரிவுகள்" },
      { to: "/services", icon: Building, labelEn: "Our Services", labelTa: "எங்கள் சேவைகள்" },
    ],
  },
  {
    labelEn: "FAQ", labelTa: "கேள்வி பதில்",
    icon: HelpCircle,
    gradient: "from-blue-500 to-blue-600",
    to: "/faq",
  },
  {
    labelEn: "Help Us", labelTa: "எங்களுக்கு உதவுங்கள்",
    icon: HandHeart,
    gradient: "from-red-500 to-red-600",
    dropdown: [
      { to: "/donation", icon: Heart, labelEn: "Donation", labelTa: "நன்கொடை" },
      { to: "/forward-survey", icon: FileText, labelEn: "Forward Survey", labelTa: "கணக்கெடுப்பை பகிரவும்" },
      { to: "/feedback", icon: FileText, labelEn: "Feedback", labelTa: "கருத்து" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();

  const close = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">

          {/* Logo */}
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 flex-shrink-0 min-w-0"
          >
            <img
              src="/logo.jpg"
              alt="Mutharaiyar Logo"
              className="h-10 w-10 sm:h-14 sm:w-14 object-contain flex-shrink-0"
            />
            <div className="leading-tight min-w-0">
              <p className="font-bold text-neutral-900 text-base sm:text-xl leading-tight truncate">
                {language === 'tamil' ? 'முத்தரையர்' : 'Mutharaiyar'}
              </p>
              <p className="font-bold text-primary-600 text-sm sm:text-lg leading-tight truncate">
                {language === 'tamil' ? 'கணக்கெடுப்பு-2026' : 'Survey-2026'}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
            {navItems.map((item) => (
              <div
                key={item.labelEn}
                className="relative group"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.labelEn)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.to ? (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow`
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {language === 'tamil' ? item.labelTa : item.labelEn}
                  </NavLink>
                ) : (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-neutral-700 hover:bg-neutral-100 transition-all">
                    <item.icon className="w-4 h-4" />
                    {language === 'tamil' ? item.labelTa : item.labelEn}
                    <svg className="w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 8L1 3h10L6 8z" />
                    </svg>
                  </button>
                )}

                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 transition-all duration-150 ${
                      activeDropdown === item.labelEn
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                    }`}
                  >
                    {item.dropdown.map((d) => (
                      <NavLink
                        key={d.to}
                        to={d.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? `bg-gradient-to-r ${item.gradient} text-white`
                              : "text-neutral-700 hover:bg-neutral-50"
                          }`
                        }
                      >
                        <d.icon className="w-4 h-4 flex-shrink-0" />
                        {language === 'tamil' ? d.labelTa : d.labelEn}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: language toggle + burger */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Language toggle — compact on mobile, full on desktop */}
            <div className="flex items-center bg-neutral-100 rounded-full p-0.5 gap-0.5">
              {/* Desktop icon */}
              <Languages className="hidden sm:block w-3.5 h-3.5 text-neutral-500 ml-1.5" />

              <button
                onClick={() => setLanguage("english")}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  language === "english"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <span className="hidden sm:inline">English</span>
                <span className="sm:hidden">EN</span>
              </button>

              <button
                onClick={() => setLanguage("tamil")}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  language === "tamil"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <span className="hidden sm:inline">தமிழ்</span>
                <span className="sm:hidden">த</span>
              </button>
            </div>

            {/* Burger — always visible below md */}
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors flex-shrink-0"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-neutral-700" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="flex flex-col px-3 py-3 gap-1">
            {navItems.flatMap((item) => {
              if (item.to) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white`
                          : "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {language === 'tamil' ? item.labelTa : item.labelEn}
                  </NavLink>
                );
              }
              return (item.dropdown ?? []).map((sub) => (
                <NavLink
                  key={sub.to}
                  to={sub.to}
                  onClick={close}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white`
                        : "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
                    }`
                  }
                >
                  <sub.icon className="w-5 h-5 flex-shrink-0" />
                  {language === 'tamil' ? sub.labelTa : sub.labelEn}
                </NavLink>
              ));
            })}
          </nav>

          {/* Contact strip */}
          <div className="border-t border-neutral-100 px-3 py-3 flex flex-col gap-1">
            <a
              href="tel:+919087099000"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
            >
              <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                📞
              </span>
              <span className="font-medium">+91 90870 99000</span>
            </a>
            <a
              href="mailto:Ramesh@muthuraja.com"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
            >
              <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                ✉️
              </span>
              <span className="font-medium">Ramesh@muthuraja.com</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
