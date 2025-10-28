export type Numeric = number | `${number}`;

export interface Sensor {
  id: string;
  name: string;
  code: string;
  latitude: Numeric;
  longitude: Numeric;
  isPublic: boolean;
  createdAt: string;
}

export interface Reading {
  id: string;
  value: number;
  type: string;
  createdAt: string;
  readingType: string;
  sensorId: string;
}

export type Alert = {
  id: string;
  type: string;            // p.ex. "threshold_breach"
  readingType: string;     // "temperature" | "ph" | ...
  value: number;           // valor da leitura que violou a regra
  threshold: number;       // limite configurado
  resolved: boolean;
  triggeredAt: string;     // ISO
  sensorId: string;
  sensor?: Sensor;
};

export type AlertRuleType = "greater_than" | "less_than";

// timeWindow é INTERVAL no DB — vamos trafegar como texto aceito pelo backend
// (ex.: "15 minutes", "1 hour", "00:15:00")
export type AlertRule = {
  id: string;
  sensorId: string;
  ruleType: AlertRuleType;
  readingType: string;
  threshold: number;
  timeWindow: string;
  active: boolean;
  createdAt?: string;
  sensor?: Sensor;
};

export type CreateAlertRuleInput = Omit<AlertRule, "id" | "createdAt" | "sensor">;
export type UpdateAlertRuleInput = Omit<AlertRule, "createdAt" | "sensor">;

export type ListAlertsQuery = {
  sensorId?: string;
  readingType?: string;
  resolved?: string; // "true" | "false"
};


export interface AggregatePoint {
  bucket: string;
  value: number;
}

export interface SummaryResponse {
  filters?: { type?: string; startDate?: string; endDate?: string };
  byType?: Array<{ type: string; total: number }>;
  lastByType?: Array<{ type: string; timestamp: string; value: number }>;
}

export interface LineDatum {
  ts: string;
  value: number;
}

export interface BarDatum {
  label: string;
  value: number;
}
