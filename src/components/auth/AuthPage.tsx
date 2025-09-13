import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Trophy, Target, Users, Shield } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'athlete' | 'official'>('athlete');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });

  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: t('error'),
            description: error.message || t('invalidCredentials'),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t('loginSuccess'),
          });
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          fullName: formData.fullName,
          role: selectedRole,
          phone: formData.phone,
        });
        if (error) {
          toast({
            title: t('error'),
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t('signupSuccess'),
          });
        }
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('networkError'),
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-bounce-in">
        {/* App Logo and Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 sport-icon">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-hero text-gradient font-bold">{t('appName')}</h1>
          <p className="text-muted-foreground">
            {isLogin ? t('signInTitle') : t('signUpTitle')}
          </p>
        </div>

        <Card className="card-athletic">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-section">
              {isLogin ? t('login') : t('signup')}
            </CardTitle>
            
            {!isLogin && (
              <div className="space-y-3">
                <CardDescription className="text-center">{t('selectRole')}</CardDescription>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={selectedRole === 'athlete' ? 'default' : 'outline'}
                    className="flex-1 h-auto p-4 flex-col gap-2"
                    onClick={() => setSelectedRole('athlete')}
                  >
                    <Target className="w-5 h-5" />
                    <div className="text-center">
                      <div className="font-medium">{t('athlete')}</div>
                      <div className="text-xs opacity-80">{t('athleteDesc')}</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === 'official' ? 'default' : 'outline'}
                    className="flex-1 h-auto p-4 flex-col gap-2"
                    onClick={() => setSelectedRole('official')}
                  >
                    <Shield className="w-5 h-5" />
                    <div className="text-center">
                      <div className="font-medium">{t('official')}</div>
                      <div className="text-xs opacity-80">{t('officialDesc')}</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName')}</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder={t('fullName')}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t('phone')}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full btn-athletic"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLogin ? t('login') : t('signup')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: '', password: '', fullName: '', phone: '' });
                }}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {isLogin ? t('noAccount') : t('hasAccount')}{' '}
                <span className="text-primary ml-1">
                  {isLogin ? t('signup') : t('login')}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sports Icons Animation */}
        <div className="flex justify-center space-x-4 opacity-50">
          <div className="sport-icon">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <div className="sport-icon">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div className="sport-icon">
            <Users className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;