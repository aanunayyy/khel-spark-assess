import React from 'react';
import { Home, Trophy, Target, User, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  const athleteNavItems = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'tests', icon: Target, label: t('fitnessTests') },
    { id: 'achievements', icon: Trophy, label: t('achievements') },
    { id: 'progress', icon: BarChart3, label: t('progress') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  const officialNavItems = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'athletes', icon: Users, label: t('athleteProfiles') },
    { id: 'submissions', icon: Target, label: t('submissions') },
    { id: 'verification', icon: Trophy, label: t('verification') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  const navItems = profile?.role === 'official' ? officialNavItems : athleteNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex-1 flex-col gap-1 h-auto py-2 px-1 ${
                isActive 
                  ? 'text-primary bg-primary/10 border border-primary/20' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;