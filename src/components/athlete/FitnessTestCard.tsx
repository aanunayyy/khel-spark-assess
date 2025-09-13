import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Upload, Timer, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FitnessTest {
  type: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  metric: string;
  lastScore?: number;
  improvement?: number;
}

interface FitnessTestCardProps {
  test: FitnessTest;
  onRecord: () => void;
  onUpload: () => void;
}

const FitnessTestCard: React.FC<FitnessTestCardProps> = ({ test, onRecord, onUpload }) => {
  const { t } = useLanguage();
  const Icon = test.icon;

  return (
    <Card className="card-athletic group">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center sport-icon">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{test.title}</CardTitle>
            <CardDescription className="text-sm">{test.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {test.lastScore && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Last: {test.lastScore} {test.metric}</span>
            </div>
            {test.improvement && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">+{test.improvement}%</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            onClick={onRecord}
            className="flex-1 btn-athletic"
            size="sm"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {t('recordVideo')}
          </Button>
          <Button
            onClick={onUpload}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('uploadVideo')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FitnessTestCard;