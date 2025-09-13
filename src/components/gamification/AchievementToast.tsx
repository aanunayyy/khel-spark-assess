import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, TrendingUp, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Achievement {
  id: string;
  type: 'badge' | 'level_up' | 'personal_best' | 'streak' | 'first_time';
  title: string;
  description: string;
  icon?: string;
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getIcon = () => {
    switch (achievement.type) {
      case 'badge':
        return <Trophy className="w-6 h-6 text-accent" />;
      case 'level_up':
        return <Star className="w-6 h-6 text-primary" />;
      case 'personal_best':
        return <TrendingUp className="w-6 h-6 text-success" />;
      case 'streak':
        return <Zap className="w-6 h-6 text-warning" />;
      case 'first_time':
        return <Target className="w-6 h-6 text-secondary" />;
      default:
        return <Trophy className="w-6 h-6 text-accent" />;
    }
  };

  const getGradient = () => {
    switch (achievement.type) {
      case 'badge':
        return 'from-accent to-warning';
      case 'level_up':
        return 'from-primary to-secondary';
      case 'personal_best':
        return 'from-success to-accent';
      case 'streak':
        return 'from-warning to-primary';
      case 'first_time':
        return 'from-secondary to-primary';
      default:
        return 'from-accent to-warning';
    }
  };

  const getBadgeText = () => {
    switch (achievement.type) {
      case 'badge':
        return t('newBadge');
      case 'level_up':
        return t('levelUp');
      case 'personal_best':
        return t('personalBest');
      case 'streak':
        return `${t('streak')}!`;
      case 'first_time':
        return t('firstTime');
      default:
        return t('newBadge');
    }
  };

  return (
    <div 
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        show ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-90'
      }`}
    >
      <Card className={`max-w-sm mx-4 overflow-hidden ${achievement.type === 'level_up' ? 'level-up' : 'achievement-unlock'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-10`} />
        <CardContent className="p-4 relative">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-br ${getGradient()} badge-glow`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-1 text-xs">
                {getBadgeText()}
              </Badge>
              <h4 className="font-semibold text-sm leading-tight">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementToast;