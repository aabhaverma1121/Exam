class WebRTCService {
  private localStream: MediaStream | null = null;
  private connections: Map<string, any> = new Map();

  async initialize(userId: string): Promise<void> {
    console.log('WebRTC initialized (mock) for user:', userId);
    return Promise.resolve();
  }

  async startLocalStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  async callPeer(peerId: string, stream: MediaStream): Promise<void> {
    console.log('Call peer (mock):', peerId);
    window.dispatchEvent(new CustomEvent('remote_stream', {
      detail: { peerId, stream }
    }));
  }

  sendData(peerId: string, data: any) {
    console.log('Send data to peer (mock):', peerId, data);
  }

  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  disconnect() {
    this.stopLocalStream();
    this.connections.clear();
  }
}

export const webrtcService = new WebRTCService();
