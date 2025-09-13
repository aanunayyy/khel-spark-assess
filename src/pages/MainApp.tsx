import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import TopBar from '@/components/layout/TopBar';
import BottomNavigation from '@/components/layout/BottomNavigation';
import DashboardStats from '@/components/athlete/DashboardStats';
import FitnessTestCard from '@/components/athlete/FitnessTestCard';
import VideoUploadModal from '@/components/athlete/VideoUploadModal';
import AchievementToast from '@/components/gamification/AchievementToast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  Activity, 
  RotateCcw, 
  Dumbbell, 
  Timer, 
  MapPin,
  Trophy,
  Settings,
  LogOut,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [achievement, setAchievement] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { profile, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  // Mock data for demonstration
  const mockStats = {
    totalTests: 6,
    completedTests: 4,
    averageScore: 87,
    badges: 12,
    level: 5,
    streak: 7,
  };

  const fitnessTests = [
    {
      type: 'vertical_jump',
      icon: Target,
      title: t('verticalJump'),
      description: 'Measure your explosive power',
      metric: 'cm',
      lastScore: 52,
      improvement: 8,
    },
    {
      type: 'pushups',
      icon: Dumbbell,
      title: t('pushups'),
      description: 'Test upper body strength',
      metric: 'reps',
      lastScore: 28,
      improvement: 12,
    },
    {
      type: 'situps',
      icon: Activity,
      title: t('situps'),
      description: 'Core strength assessment',
      metric: 'reps',
      lastScore: 35,
      improvement: 6,
    },
    {
      type: 'squats',
      icon: RotateCcw,
      title: t('squats'),
      description: 'Lower body power test',
      metric: 'reps',
      lastScore: 22,
      improvement: 15,
    },
    {
      type: 'shuttle_run',
      icon: Timer,
      title: t('shuttleRun'),
      description: 'Agility and speed test',
      metric: 'sec',
      lastScore: 12.5,
      improvement: 4,
    },
    {
      type: 'endurance_run',
      icon: MapPin,
      title: t('enduranceRun'),
      description: 'Cardiovascular endurance',
      metric: 'min',
      lastScore: 5.2,
      improvement: 9,
    },
  ];

  useEffect(() => {
    if (profile) {
      fetchSubmissions();
    }
  }, [profile]);

  const fetchSubmissions = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fitness_test_submissions')
        .select('*')
        .eq('athlete_id', profile.user_id)
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    setLoading(false);
  };

  const handleTestAction = (test: any, action: 'record' | 'upload') => {
    setSelectedTest(test);
    setVideoModalOpen(true);
  };

  const handleVideoUploadComplete = () => {
    setVideoModalOpen(false);
    setSelectedTest(null);
    fetchSubmissions();
    
    // Show achievement notification
    setTimeout(() => {
      setAchievement({
        id: 'upload_' + Date.now(),
        type: 'first_time',
        title: t('betterThanPrevious'),
        description: `Great job on your ${selectedTest?.title}!`,
      });
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut();
    setShowSettings(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <DashboardStats stats={mockStats} />
      
      <Card className="card-athletic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {submissions.slice(0, 3).map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">{submission.test_type.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge 
                variant={
                  submission.status === 'approved' ? 'default' :
                  submission.status === 'rejected' ? 'destructive' : 'secondary'
                }
                className="text-xs"
              >
                {submission.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderFitnessTests = () => (
    <div className="space-y-4">
      <h2 className="text-section text-center mb-6">{t('fitnessTests')}</h2>
      <div className="space-y-4">
        {fitnessTests.map((test) => (
          <FitnessTestCard
            key={test.type}
            test={test}
            onRecord={() => handleTestAction(test, 'record')}
            onUpload={() => handleTestAction(test, 'upload')}
          />
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <h2 className="text-section text-center">{t('achievements')}</h2>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i} className="text-center p-4 card-athletic">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-2 badge-glow">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-sm">First Jump</h3>
            <p className="text-xs text-muted-foreground">Completed vertical jump</p>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <h2 className="text-section text-center">{t('progress')}</h2>
      <Card className="card-athletic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fitnessTests.slice(0, 4).map((test) => (
              <div key={test.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{test.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    +{test.improvement}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(test.improvement * 5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card className="card-athletic">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <CardTitle>{profile?.full_name}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            <Badge>{profile?.role}</Badge>
            {profile?.is_verified && (
              <Badge variant="secondary">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{mockStats.level}</p>
              <p className="text-sm text-muted-foreground">Level</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{mockStats.badges}</p>
              <p className="text-sm text-muted-foreground">Badges</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tests':
        return renderFitnessTests();
      case 'achievements':
        return renderAchievements();
      case 'progress':
        return renderProgress();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar onSettingsClick={() => setShowSettings(true)} />
      
      <main className="pt-20 pb-20 px-4">
        <div className="container-mobile athletic-spacing">
          {renderContent()}
        </div>
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {selectedTest && (
        <VideoUploadModal
          isOpen={videoModalOpen}
          onClose={() => {
            setVideoModalOpen(false);
            setSelectedTest(null);
          }}
          testType={selectedTest.type}
          testTitle={selectedTest.title}
        />
      )}
      
      <AchievementToast
        achievement={achievement}
        onClose={() => setAchievement(null)}
      />
      
      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {t('settings')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>{t('language')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
              >
                {language === 'english' ? 'हिंदी' : 'English'}
              </Button>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainApp;