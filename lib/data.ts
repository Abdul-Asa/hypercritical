// data.ts
export interface ScriptItem {
  projectID: string;
  isDeleted: boolean;
  scriptId: string;
  testDescription: string;
  script_language: "Python" | "Matlab";
  script_type: "unit_test" | "simulation_test";
  codePython: string;
  codeMatlab: string;
  isGeneratedPython: boolean;
  isGeneratedMatlab: boolean;
  lastModified: string | null;
  noOfModification: number;
  createdAt: string;
  isIncludedSuite: boolean;
  isAccepted: boolean;
}

// Mock data (hardcoded, for frontend-only demo)
export const mockScripts: ScriptItem[] = [
  {
    projectID: "ad05c7a0-9cd1-417c-9ab0-e464ebf5c007",
    isDeleted: false,
    scriptId: "20e5bbff-05e7-4935-989a-78bae42ddfa4",
    testDescription: "PID Controller Response Test",
    script_language: "Python",
    script_type: "unit_test",
    codePython: "Example Python code",
    codeMatlab: "",
    isGeneratedPython: true,
    isGeneratedMatlab: false,
    lastModified: null,
    noOfModification: 0,
    createdAt: "2025-10-03T12:34:36.093Z",
    isIncludedSuite: false,
    isAccepted: true,
  },
  {
    projectID: "ad05c7a0-9cd1-417c-9ab0-e464ebf5c007",
    isDeleted: false,
    scriptId: "3c8b59d2-d6b7-4b56-8f63-992f71f9bfb2",
    testDescription: "Motor Control Saturation Test",
    script_language: "Matlab",
    script_type: "unit_test",
    codeMatlab: "",
    codePython: "",
    isGeneratedPython: false,
    isGeneratedMatlab: false,
    lastModified: null,
    noOfModification: 0,
    createdAt: "2025-10-03T12:36:40.000Z",
    isIncludedSuite: false,
    isAccepted: false,
  },
  {
    projectID: "ad05c7a0-9cd1-417c-9ab0-e464ebf5c007",
    isDeleted: false,
    scriptId: "57d7e8ac-9b58-45f3-a874-3e52867c3c8c",
    testDescription: "Drone Stability in Turbulence",
    script_language: "Python",
    script_type: "simulation_test",
    codePython: "",
    codeMatlab: "",
    isGeneratedPython: false,
    isGeneratedMatlab: false,
    lastModified: null,
    noOfModification: 1,
    createdAt: "2025-10-03T12:37:22.000Z",
    isIncludedSuite: true,
    isAccepted: true,
  },
  {
    projectID: "ad05c7a0-9cd1-417c-9ab0-e464ebf5c007",
    isDeleted: false,
    scriptId: "f8a2b1c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    testDescription: "Sensor Calibration Validation",
    script_language: "Python",
    script_type: "unit_test",
    codePython: "",
    codeMatlab: "",
    isGeneratedPython: false,
    isGeneratedMatlab: false,
    lastModified: "2025-10-03T14:15:30.000Z",
    noOfModification: 0,
    createdAt: "2025-10-03T13:45:12.000Z",
    isIncludedSuite: true,
    isAccepted: false,
  },
  {
    projectID: "ad05c7a0-9cd1-417c-9ab0-e464ebf5c007",
    isDeleted: false,
    scriptId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    testDescription: "Battery Life Simulation",
    script_language: "Matlab",
    script_type: "simulation_test",
    codePython: "",
    codeMatlab: "",
    isGeneratedPython: false,
    isGeneratedMatlab: false,
    lastModified: null,
    noOfModification: 0,
    createdAt: "2025-10-03T15:22:18.000Z",
    isIncludedSuite: false,
    isAccepted: true,
  },
  {
    projectID: "ad05c7a0-9cd1-417c-9ab0-e464ebf5c007",
    isDeleted: false,
    scriptId: "9876abcd-ef12-3456-7890-abcdef123456",
    testDescription: "Network Latency Analysis",
    script_language: "Python",
    script_type: "simulation_test",
    codePython: "",
    codeMatlab: "",
    isGeneratedPython: false,
    isGeneratedMatlab: false,
    lastModified: "2025-10-03T16:08:45.000Z",
    noOfModification: 0,
    createdAt: "2025-10-03T15:55:33.000Z",
    isIncludedSuite: true,
    isAccepted: false,
  },
];
