export type Sensor = {
  id: string;
  name: string;
  code: string;
  latitude: string | number;
  longitude: string | number;
  isPublic: boolean;
  createdAt: string;
};

export type Reading = {
  id: string;
  value: number;
  type: string;
  createdAt: string;
  sensorId?: string;
  sensor?: Sensor;
};

export type Alert = {
  id: string;
  type: string;
  readingType: string;
  value: number;
  threshold: number;
  resolved: boolean;
  triggeredAt: string;
  sensor_id: string;
};
