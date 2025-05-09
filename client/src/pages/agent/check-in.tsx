import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function AgentCheckIn() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [address, setAddress] = useState<string>("");
  
  // Fetch check-in data
  const { data: checkInData, isLoading: isLoadingCheckIn } = useQuery({
    queryKey: ["/api/check-ins/latest"],
    enabled: !!user && user?.role === "agent",
  });

  // Start video capture
  const startCapture = async () => {
    try {
      // Get location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          // In a real app, we would do reverse geocoding here
          setAddress("123 Main Street, Andheri East, Mumbai, 400069");
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enable location services.",
            variant: "destructive"
          });
        }
      );

      // Start video
      setIsCapturing(true);
      setCapturedImage(null);
      setCapturedVideo(null);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error starting video:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Capture image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  // Record video (simulated)
  const recordVideo = () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enable location services for check-in.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would actually record video here
    // For demo purposes, we'll just set a timeout to simulate recording
    toast({
      title: "Recording Video",
      description: "Please perform the required verification gestures..."
    });
    
    setTimeout(() => {
      // Simulate a completed recording
      setCapturedVideo("video_recording_placeholder");
      toast({
        title: "Video Captured",
        description: "Your verification video has been recorded."
      });
    }, 3000);
  };

  // Submit check-in
  const submitCheckIn = () => {
    if (!capturedImage || !capturedVideo || !location) {
      toast({
        title: "Missing Information",
        description: "Please capture your selfie, record verification video, and enable location services.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would upload the image and video to the server
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCapturing(false);
      setCapturedImage(null);
      setCapturedVideo(null);
      setLocation(null);
      setAddress("");
      
      // Stop video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      toast({
        title: "Check-In Successful",
        description: "Your location and biometric verification has been completed."
      });
    }, 2000);
  };

  if (isLoadingAuth || isLoadingCheckIn) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-900">Agent Check-In</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading check-in data...</CardTitle>
            <CardDescription>Please wait while we load your check-in information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse h-16 w-16 bg-gray-300 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample data for demonstration
  const mockLastCheckIn = {
    id: 1,
    timestamp: "2025-05-09T08:30:00",
    location: "Mumbai, Maharashtra",
    address: "123 Main Street, Andheri East, Mumbai, 400069",
    coordinates: { latitude: 19.1136, longitude: 72.8697 },
    status: "verified",
    matchScore: 98
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Agent Check-In</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Last Check-In</CardTitle>
            <CardDescription>Details of your most recent verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Check-In Time</p>
                    <p className="font-medium">{formatDateTime(new Date(mockLastCheckIn.timestamp))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className="bg-green-500">
                      {mockLastCheckIn.status.charAt(0).toUpperCase() + mockLastCheckIn.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{mockLastCheckIn.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Biometric Match</p>
                    <p className="font-medium">{mockLastCheckIn.matchScore}% Match</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium">{mockLastCheckIn.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Coordinates</p>
                <p className="font-medium">
                  Lat: {mockLastCheckIn.coordinates.latitude.toFixed(6)}, 
                  Long: {mockLastCheckIn.coordinates.longitude.toFixed(6)}
                </p>
              </div>
              
              <div className="h-[200px] bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Map Preview</p>
                {/* In a real app, this would be a Google Map or similar */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Check-In</CardTitle>
            <CardDescription>Submit a new biometric verification and location check</CardDescription>
          </CardHeader>
          <CardContent>
            {!isCapturing ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-center text-gray-500 max-w-md">
                  To complete your check-in, you'll need to capture a selfie and record a short verification video. 
                  Make sure you're in a well-lit area with your face clearly visible.
                </p>
                <Button 
                  onClick={startCapture}
                  className="bg-purple-700 hover:bg-purple-800 mt-4"
                  size="lg"
                >
                  Start Check-In Process
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  {!capturedImage ? (
                    <div className="border rounded-md overflow-hidden">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-[300px] object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={capturedImage} 
                        alt="Captured selfie" 
                        className="w-full h-[300px] object-cover"
                      />
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Button 
                      onClick={captureImage} 
                      className="w-full"
                      disabled={capturedImage !== null}
                      variant={capturedImage ? "outline" : "default"}
                    >
                      {capturedImage ? "Selfie Captured" : "Capture Selfie"}
                    </Button>
                  </div>
                  <div>
                    <Button 
                      onClick={recordVideo} 
                      className="w-full"
                      disabled={capturedVideo !== null}
                      variant={capturedVideo ? "outline" : "default"}
                    >
                      {capturedVideo ? "Video Recorded" : "Record Verification Video"}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="font-medium mb-2">Current Location</p>
                  {location ? (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Coordinates: </span>
                        Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Address: </span>
                        {address}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Waiting for location data...</p>
                  )}
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCapturing(false);
                      setCapturedImage(null);
                      setCapturedVideo(null);
                      
                      // Stop video stream
                      if (videoRef.current && videoRef.current.srcObject) {
                        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                        tracks.forEach(track => track.stop());
                        videoRef.current.srcObject = null;
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={submitCheckIn}
                    disabled={!capturedImage || !capturedVideo || !location || isSubmitting}
                    className="bg-purple-700 hover:bg-purple-800"
                  >
                    {isSubmitting ? "Submitting..." : "Complete Check-In"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Check-In Guidelines</CardTitle>
          <CardDescription>Important requirements for proper verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-semibold">Selfie Requirements</h3>
              </div>
              <ul className="list-disc list-inside text-sm pl-3 space-y-1">
                <li>Face must be clearly visible</li>
                <li>Ensure adequate lighting</li>
                <li>Remove sunglasses or face coverings</li>
                <li>Maintain neutral expression</li>
                <li>Position your face in the center</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Video Verification</h3>
              </div>
              <ul className="list-disc list-inside text-sm pl-3 space-y-1">
                <li>Follow the on-screen instructions</li>
                <li>Turn your head left and right slowly</li>
                <li>Blink naturally when prompted</li>
                <li>Record in a quiet environment</li>
                <li>Keep steady, avoid sudden movements</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Location Check</h3>
              </div>
              <ul className="list-disc list-inside text-sm pl-3 space-y-1">
                <li>Enable location services</li>
                <li>Check-in from your assigned location</li>
                <li>Ensure GPS accuracy is high</li>
                <li>Wait for address confirmation</li>
                <li>Report any location issues</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
            <p className="font-semibold text-yellow-800">Important Reminders</p>
            <ul className="list-disc list-inside text-sm mt-2">
              <li>Check-ins are required daily at the start of your shift</li>
              <li>Failed verifications will be flagged for manual review</li>
              <li>Consistently missed check-ins may impact your risk score</li>
              <li>Contact support if you encounter technical difficulties</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}