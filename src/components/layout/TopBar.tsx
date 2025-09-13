import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Settings, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface TopBarProps {
  onSettingsClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSettingsClick }) => {
  const { profile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'hindi' : 'english');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gradient">{t('appName')}</h1>
            {profile && (
              <p className="text-xs text-muted-foreground">
                {t('welcomeBack')}, {profile.full_name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {profile && (
            <Badge 
              variant={profile.role === 'official' ? 'secondary' : 'default'}
              className="text-xs"
            >
              {profile.role === 'official' ? t('official') : t('athlete')}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="p-2"
          >
            <Globe className="w-4 h-4" />
            <span className="ml-1 text-xs font-medium">
              {language === 'english' ? 'हिं' : 'EN'}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="p-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;