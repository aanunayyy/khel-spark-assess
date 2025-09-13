import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, PlayCircle, StopCircle, Camera, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  testType: string;
  testTitle: string;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  testType,
  testTitle,
}) => {
  const [uploadMode, setUploadMode] = useState<'record' | 'upload' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        stopCamera();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to access camera',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRecordedBlob(file);
    }
  };

  const uploadVideo = async (blob: Blob) => {
    if (!user) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const fileName = `${user.id}/${testType}_${Date.now()}.webm`;
      
      const { error: uploadError } = await supabase.storage
        .from('fitness-videos')
        .upload(fileName, blob);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (uploadError) throw uploadError;
      
      // Create submission record with mock AI analysis
      const mockAnalysis = generateMockAnalysis(testType);
      
      const { error: dbError } = await supabase
        .from('fitness_test_submissions')
        .insert({
          athlete_id: user.id,
          test_type: testType as any,
          video_url: fileName,
          ai_analysis: mockAnalysis,
          performance_metrics: mockAnalysis.metrics,
          status: 'processing'
        });
      
      if (dbError) throw dbError;
      
      toast({
        title: t('success'),
        description: t('videoUploadSuccess'),
      });
      
      onClose();
      resetModal();
      
    } catch (error) {
      toast({
        title: t('error'),
        description: t('uploadError'),
        variant: 'destructive',
      });
    }
    
    setUploading(false);
    setUploadProgress(0);
  };

  const generateMockAnalysis = (testType: string) => {
    const analysisMap: Record<string, any> = {
      vertical_jump: {
        detected_exercise: 'Vertical Jump',
        form_quality: Math.floor(Math.random() * 30) + 70, // 70-100%
        metrics: {
          height: Math.floor(Math.random() * 20) + 45, // 45-65 cm
          takeoff_power: Math.floor(Math.random() * 25) + 75,
        },
        feedback: ['Good knee bend', 'Strong takeoff', 'Good arm swing'],
        cheat_detection: { cheating_detected: false, confidence: 0.95 }
      },
      pushups: {
        detected_exercise: 'Push-ups',
        form_quality: Math.floor(Math.random() * 25) + 75,
        metrics: {
          repetitions: Math.floor(Math.random() * 20) + 15, // 15-35 reps
          avg_depth: Math.floor(Math.random() * 15) + 85, // 85-100%
        },
        feedback: ['Consistent form', 'Good depth', 'Steady tempo'],
        cheat_detection: { cheating_detected: false, confidence: 0.92 }
      },
      situps: {
        detected_exercise: 'Sit-ups',
        form_quality: Math.floor(Math.random() * 20) + 80,
        metrics: {
          repetitions: Math.floor(Math.random() * 25) + 20, // 20-45 reps
          range_of_motion: Math.floor(Math.random() * 10) + 90,
        },
        feedback: ['Full range of motion', 'Good core engagement'],
        cheat_detection: { cheating_detected: false, confidence: 0.89 }
      },
      squats: {
        detected_exercise: 'Squats',
        form_quality: Math.floor(Math.random() * 25) + 75,
        metrics: {
          repetitions: Math.floor(Math.random() * 15) + 15, // 15-30 reps
          depth_quality: Math.floor(Math.random() * 20) + 80,
        },
        feedback: ['Good depth', 'Proper knee alignment', 'Strong stance'],
        cheat_detection: { cheating_detected: false, confidence: 0.94 }
      },
      shuttle_run: {
        detected_exercise: 'Shuttle Run',
        form_quality: Math.floor(Math.random() * 20) + 80,
        metrics: {
          time: (Math.random() * 2 + 12).toFixed(2), // 12-14 seconds
          distance: 20, // meters
          speed: Math.floor(Math.random() * 5) + 15, // 15-20 km/h
        },
        feedback: ['Good acceleration', 'Quick direction changes'],
        cheat_detection: { cheating_detected: false, confidence: 0.91 }
      },
      endurance_run: {
        detected_exercise: 'Endurance Run',
        form_quality: Math.floor(Math.random() * 15) + 85,
        metrics: {
          time: (Math.random() * 60 + 300).toFixed(0), // 5-6 minutes
          distance: 1000, // meters
          avg_pace: (Math.random() * 30 + 300).toFixed(0), // seconds per km
        },
        feedback: ['Consistent pace', 'Good endurance', 'Strong finish'],
        cheat_detection: { cheating_detected: false, confidence: 0.88 }
      }
    };
    
    return analysisMap[testType] || analysisMap.pushups;
  };

  const resetModal = () => {
    setUploadMode(null);
    setIsRecording(false);
    setRecordedBlob(null);
    setUploadProgress(0);
    setUploading(false);
    stopCamera();
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            {testTitle} - {t('recordVideo')}
          </DialogTitle>
          <DialogDescription>
            Record or upload a video of your {testTitle.toLowerCase()} performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!uploadMode && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setUploadMode('record')}
                className="h-20 flex-col gap-2 btn-athletic"
              >
                <PlayCircle className="w-6 h-6" />
                {t('recordVideo')}
              </Button>
              <Button
                onClick={() => {
                  setUploadMode('upload');
                  fileInputRef.current?.click();
                }}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <Upload className="w-6 h-6" />
                {t('uploadVideo')}
              </Button>
            </div>
          )}

          {uploadMode === 'record' && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isRecording && recordedBlob && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-success" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {!isRecording && !recordedBlob && (
                  <Button onClick={startRecording} className="flex-1 btn-athletic">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <Button onClick={stopRecording} variant="destructive" className="flex-1">
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                )}
                
                {recordedBlob && !uploading && (
                  <Button onClick={() => uploadVideo(recordedBlob)} className="flex-1 btn-victory">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                )}
              </div>
            </div>
          )}

          {uploadMode === 'upload' && recordedBlob && (
            <div className="space-y-4">
              <div className="p-4 border-2 border-dashed border-success/50 bg-success/5 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium">Video selected successfully!</p>
                <p className="text-xs text-muted-foreground">Ready to upload</p>
              </div>
              
              <Button
                onClick={() => uploadVideo(recordedBlob)}
                className="w-full btn-victory"
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading & analyzing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="progress-athletic" />
              <p className="text-xs text-muted-foreground text-center">
                AI is analyzing your performance...
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;