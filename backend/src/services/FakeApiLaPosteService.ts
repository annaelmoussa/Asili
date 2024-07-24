import axios from 'axios';

interface TrackingInfo {
  trackingCode: string;
  status: string;
  location: string;
  timestamp: Date;
  history: {
    status: string;
    location: string;
    timestamp: Date;
  }[];
}

export class FakeApiLaPosteService {
  private baseUrl = 'http://fakeapilaposte:3000';

  async generateTrackingNumber(): Promise<string> {
    const response = await axios.get(`${this.baseUrl}/generate-tracking`);
    return response.data.trackingCode;
  }

  async getTrackingInfo(trackingCode: string): Promise<TrackingInfo> {
    const response = await axios.get(`${this.baseUrl}/tracking/${trackingCode}`);
    return response.data;
  }
}