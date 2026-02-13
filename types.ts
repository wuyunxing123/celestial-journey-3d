
export interface GeminiResponse {
  text: string;
  topic: string;
}

export interface SimulationState {
  rotationSpeed: number;
  orbitSpeed: number;
  showOrbits: boolean;
  isPaused: boolean;
}
