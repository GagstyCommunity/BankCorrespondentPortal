import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Video, MapPin, Check, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { formatDateTime } from "@/lib/utils";

export default function AgentCheckIn() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("selfie");
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    address: string;
    fetching: boolean;
    error: string | null;
  }>({
    latitude: null,
    longitude: null,
    address: "",
    fetching: false,
    error: null,
  });

  // Camera states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadingCheckIn, setUploadingCheckIn] = useState(false);

  // Fetch latest check-in
  const { data: checkIns, isLoading } = useQuery({
    queryKey: ["/api/check-ins"],
  });

  // Get user's latest check-in
  const latestCheckIn = checkIns && checkIns.length > 0 ? checkIns[0] : null;

  // Function to get user's current location
  const getLocation = () => {
    setLocation(prev => ({ ...prev, fetching: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        fetching: false,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // In a real app, we would use a reverse geocoding API to get the address
        // For example: Google Maps Geocoding API, MapBox, etc.
        // For this demo, we'll just use the coordinates
        
        const mockAddress = "123 Main Road, Bangalore, Karnataka";
        
        setLocation({
          latitude,
          longitude,
          address: mockAddress,
          fetching: false,
          error: null,
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          fetching: false,
          error: `Error getting location: ${error.message}`,
        }));
      }
    );
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Capture selfie
  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  // Reset selfie
  const resetSelfie = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Start video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // Start countdown
        setCountdown(3);
        
        // Create media recorder
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        
        const chunks: BlobPart[] = [];
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          setRecordedVideo(blob);
          stopCamera();
        };
        
        // Start countdown, then record
        setTimeout(() => {
          setRecording(true);
          recorder.start();
          
          // Record for 10 seconds
          setTimeout(() => {
            if (recorder.state === 'recording') {
              recorder.stop();
              setRecording(false);
            }
          }, 10000);
        }, 3000);
      }
    } catch (err) {
      console.error("Error accessing camera for video:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera for video recording. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Reset video
  const resetVideo = () => {
    setRecordedVideo(null);
    setRecording(false);
  };

  // Submit check-in
  const submitCheckIn = async () => {
    if (!capturedImage && !recordedVideo) {
      toast({
        title: "Missing Media",
        description: "Please capture a selfie or record a video for check-in.",
        variant: "destructive",
      });
      return;
    }

    if (!location.latitude || !location.longitude) {
      toast({
        title: "Location Required",
        description: "Please enable location services to complete check-in.",
        variant: "destructive",
      });
      return;
    }

    setUploadingCheckIn(true);

    try {
      // Create form data to send files
      const formData = new FormData();
      
      // Add selfie if available
      if (capturedImage) {
        // Convert base64 to blob
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        formData.append('selfie', blob, 'selfie.jpg');
      }
      
      // Add video if available
      if (recordedVideo) {
        formData.append('video', recordedVideo, 'checkin_video.webm');
      }
      
      // Add location data
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      formData.append('address', location.address);
      formData.append('deviceId', 'web-browser'); // In a real app, use a device fingerprint
      
      // Send to server
      const response = await fetch('/api/check-ins', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      // Success
      toast({
        title: "Check-in Successful",
        description: "Your daily check-in has been recorded successfully.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/check-ins"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agent/stats"] });
      
      // Reset states
      setCapturedImage(null);
      setRecordedVideo(null);
      setActiveTab("selfie");
      
    } catch (error) {
      console.error("Check-in submission error:", error);
      toast({
        title: "Check-in Failed",
        description: "There was an error submitting your check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingCheckIn(false);
    }
  };

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Get location on page load
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Daily Check-In</h1>
        <p className="text-gray-600">Complete your daily verification to maintain compliance and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Check-in Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Check-in Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Check-in</span>
                    <Badge className={latestCheckIn ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {latestCheckIn ? "Completed" : "Required"}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    {latestCheckIn 
                      ? formatDateTime(latestCheckIn.checkInDate) 
                      : "No recent check-in found"}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Next Check-in</span>
                    <span>
                      {latestCheckIn 
                        ? new Date(new Date(latestCheckIn.checkInDate).getTime() + 24 * 60 * 60 * 1000).toLocaleString() 
                        : "As soon as possible"}
                    </span>
                  </div>
                  <Progress value={latestCheckIn ? 100 : 0} className="h-2" />
                </div>

                <div className="pt-4 border-t border-gray-200 mt-4">
                  <h3 className="font-medium mb-2">Check-in Requirements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="mt-0.5 mr-2 bg-green-100 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Daily selfie verification</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-0.5 mr-2 bg-green-100 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Weekly 360° video check (due today)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-0.5 mr-2 bg-green-100 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Location verification</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-4">
                  <h3 className="font-medium mb-2">Current Location</h3>
                  {location.fetching ? (
                    <div className="flex items-center text-sm">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Fetching your location...</span>
                    </div>
                  ) : location.error ? (
                    <div className="text-sm text-red-600">{location.error}</div>
                  ) : (
                    <div className="space-y-1 text-sm">
                      <p>{location.address}</p>
                      <p className="text-gray-500">
                        Lat: {location.latitude?.toFixed(6)}, 
                        Lng: {location.longitude?.toFixed(6)}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={getLocation}
                      >
                        <MapPin className="h-4 w-4 mr-2" /> Refresh Location
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check-in Interface */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Complete Your Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="selfie">Selfie Check-in</TabsTrigger>
                <TabsTrigger value="video">360° Video</TabsTrigger>
              </TabsList>

              {/* Selfie Tab */}
              <TabsContent value="selfie">
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600">
                      Please take a clear selfie to verify your identity. Ensure good lighting and a neutral background.
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    {capturedImage ? (
                      <div className="relative w-full max-w-lg">
                        <img 
                          src={capturedImage} 
                          alt="Captured selfie" 
                          className="w-full rounded-lg border border-gray-200" 
                        />
                        <Button 
                          variant="outline"
                          className="mt-4"
                          onClick={resetSelfie}
                        >
                          Retake Photo
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="relative w-full max-w-lg border border-gray-200 rounded-lg overflow-hidden bg-black">
                          <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline
                            className="w-full h-full"
                          />
                          {!cameraActive && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                              <Camera className="h-12 w-12 text-gray-400 mb-2" />
                              <p className="text-gray-500">Camera not active</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex space-x-4">
                          {!cameraActive ? (
                            <Button onClick={startCamera}>
                              <Camera className="mr-2 h-4 w-4" /> Start Camera
                            </Button>
                          ) : (
                            <Button onClick={captureSelfie}>
                              <Camera className="mr-2 h-4 w-4" /> Take Photo
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Hidden canvas for processing the image */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>
              </TabsContent>

              {/* Video Tab */}
              <TabsContent value="video">
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600">
                      Record a 10-second 360° video of your surroundings. Slowly pan your device to capture your complete working environment.
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    {recordedVideo ? (
                      <div className="relative w-full max-w-lg">
                        <video 
                          src={URL.createObjectURL(recordedVideo)} 
                          controls
                          className="w-full rounded-lg border border-gray-200"
                        />
                        <Button 
                          variant="outline"
                          className="mt-4"
                          onClick={resetVideo}
                        >
                          Record Again
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="relative w-full max-w-lg border border-gray-200 rounded-lg overflow-hidden bg-black">
                          <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline
                            className="w-full h-full"
                          />
                          
                          {!cameraActive && !recording && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                              <Video className="h-12 w-12 text-gray-400 mb-2" />
                              <p className="text-gray-500">Camera not active</p>
                            </div>
                          )}
                          
                          {countdown !== null && countdown > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <div className="text-white text-6xl font-bold">
                                {countdown}
                              </div>
                            </div>
                          )}
                          
                          {recording && (
                            <div className="absolute top-4 right-4 flex items-center">
                              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2" />
                              <span className="text-white text-sm">Recording...</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <Button 
                            onClick={startRecording}
                            disabled={cameraActive || recording}
                          >
                            <Video className="mr-2 h-4 w-4" /> Start Recording
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button 
                className="w-full"
                onClick={submitCheckIn}
                disabled={(!capturedImage && !recordedVideo) || !location.latitude || !location.longitude || uploadingCheckIn}
              >
                {uploadingCheckIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Submit Check-in
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
