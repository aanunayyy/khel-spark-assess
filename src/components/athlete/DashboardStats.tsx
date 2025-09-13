import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp, Zap, Award, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsData {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  badges: number;
  level: number;
  streak: number;
}

interface DashboardStatsProps {
  stats: StatsData;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const { t } = useLanguage();

  const statCards = [
    {
      title: t('myTests'),
      value: `${stats.completedTests}/${stats.totalTests}`,
      description: 'Completed this week',
      icon: Target,
      color: 'from-primary to-primary-variant',
      textColor: 'text-primary',
    },
    {
      title: t('achievements'),
      value: stats.badges,
      description: 'Badges earned',
      icon: Trophy,
      color: 'from-accent to-warning',
      textColor: 'text-accent',
    },
    {
      title: 'Level',
      value: stats.level,
      description: `${stats.averageScore}% avg score`,
      icon: Star,
      color: 'from-secondary to-primary',
      textColor: 'text-secondary',
    },
    {
      title: 'Streak',
      value: `${stats.streak} days`,
      description: 'Current streak',
      icon: Zap,
      color: 'from-success to-accent',
      textColor: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${card.textColor}`} />
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
                {card.value}
              </div>
              <CardDescription className="text-xs">{card.description}</CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;