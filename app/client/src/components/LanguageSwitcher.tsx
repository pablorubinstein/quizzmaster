import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Language Switcher Component
 * 
 * Allows users to switch between available languages.
 * The selected language is persisted in localStorage automatically by i18next.
 */
export default function LanguageSwitcher() {
  const { i18n, ready } = useTranslation();

  // abort if i18n is not yet initialized
  if (!ready) {
    console.warn("i18n is NOt ready yet");
    return null; // or a loading spinner
  }


  // 🇫🇷 🇪🇸 🇬🇧
  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  // we split because 'en-US' -> 'en'. We also provide a default to 'es'
  const currentLanguage = languages.find((lang) => lang.code === i18n.language.split('-')[0]) ?? languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {currentLanguage.flag} {currentLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={i18n.language === lang.code ? 'bg-blue-100' : ''}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

