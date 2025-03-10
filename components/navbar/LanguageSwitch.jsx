"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function LanguageSwitch() {
  const [currentLang, setCurrentLang] = useState('tr');

  useEffect(() => {
    // Sayfa yüklendiğinde cookie'den dili al
    const savedLang = Cookies.get('i18next');
    if (savedLang) {
      setCurrentLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'tr' ? 'en' : 'tr';

    // Cookie'yi ayarla (7 gün geçerli olsun)
    Cookies.set('i18next', newLang, { expires: 7, path: '/' });

    setCurrentLang(newLang);

    // Sayfayı yenile
    window.location.reload();
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      className="text-sm font-medium transition-colors hover:text-primary"
    >
      {currentLang === 'tr' ? 'EN' : 'TR'}
    </Button>
  );
} 