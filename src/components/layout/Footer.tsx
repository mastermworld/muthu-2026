import React from "react";
import { Copyright } from "lucide-react";
import { useLanguage } from "./Navbar";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  return (
    <footer className="bg-neutral-900 text-neutral-300 font-sans flex flex-col items-center justify-center">
        <div className="mt-8 pt-2 border-t border-neutral-800 text-neutral-500 flex flex-col items-center justify-center row-span-3">
          <p className="flex items-center ">
            <Copyright className="w-3.5 h-3.5" />
            {currentYear} Mutharaiyar.org. {language === 'tamil' ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All Rights Reserved.'}
          </p>
        </div>
    </footer>
  );
}
