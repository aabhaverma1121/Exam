class MediaService {
  private streams: Map<string, MediaStream> = new Map();
  private videoElements: Map<string, HTMLVideoElement> = new Map();

  async requestCameraPermission(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        }
      });
      
      this.streams.set('camera', stream);
      return stream;
    } catch (error) {
      console.error('Camera permission denied:', error);
      throw new Error('Camera access is required for proctoring. Please allow camera access and try again.');
    }
  }

  async requestMicrophonePermission(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.streams.set('microphone', stream);
      return stream;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      throw new Error('Microphone access is required for proctoring. Please allow microphone access and try again.');
    }
  }

  async requestScreenSharePermission(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        },
        audio: true
      });
      
      this.streams.set('screen', stream);
      return stream;
    } catch (error) {
      console.error('Screen sharing permission denied:', error);
      throw new Error('Screen sharing is required for proctoring. Please allow screen sharing and try again.');
    }
  }

  async requestLocationPermission(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          resolve(position);
        },
        (error) => {
          console.error('Location permission denied:', error);
          reject(new Error('Location access is required for proctoring verification. Please allow location access and try again.'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  createVideoElement(streamId: string, stream: MediaStream): HTMLVideoElement {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    
    this.videoElements.set(streamId, video);
    return video;
  }

  attachStreamToElement(elementId: string, stream: MediaStream) {
    const element = document.getElementById(elementId) as HTMLVideoElement;
    if (element) {
      element.srcObject = stream;
      element.play().catch(console.error);
    }
  }

  stopStream(streamId: string) {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      this.streams.delete(streamId);
    }
  }

  stopAllStreams() {
    this.streams.forEach((stream, streamId) => {
      this.stopStream(streamId);
    });
    this.videoElements.clear();
  }

  getStream(streamId: string): MediaStream | undefined {
    return this.streams.get(streamId);
  }

  async checkPermissions(): Promise<{
    camera: boolean;
    microphone: boolean;
    screen: boolean;
    location: boolean;
  }> {
    const permissions = {
      camera: false,
      microphone: false,
      screen: false,
      location: false
    };

    try {
      // Check camera permission
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      permissions.camera = cameraPermission.state === 'granted';
    } catch (error) {
      console.log('Camera permission check not supported');
    }

    try {
      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      permissions.microphone = micPermission.state === 'granted';
    } catch (error) {
      console.log('Microphone permission check not supported');
    }

    try {
      // Check location permission
      const locationPermission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      permissions.location = locationPermission.state === 'granted';
    } catch (error) {
      console.log('Location permission check not supported');
    }

    return permissions;
  }
}

export const mediaService = new MediaService();