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
    codePython: `# PID Controller Response Test
  import control
  import matplotlib.pyplot as plt
  
  Kp, Ki, Kd = 1.2, 0.5, 0.1
  plant = control.tf([1], [1, 2, 1])
  pid = control.tf([Kd, Kp, Ki], [1, 0])
  system = control.feedback(pid*plant, 1)
  
  t, y = control.step_response(system)
  plt.plot(t, y)
  plt.title("PID Step Response")
  plt.show()`,
    codeMatlab: `# PID Controller Response Test
  Kp = 1.2;
  Ki = 0.5;
  Kd = 0.1;
  plant = tf([1], [1, 2, 1]);
  pid = tf([Kd, Kp, Ki], [1, 0]);
  system = feedback(pid*plant, 1);
  [t, y] = step(system);
  plot(t, y);
  title('PID Step Response');`,
    lastModified: null,
    noOfModification: 0,
    createdAt: "2025-10-03T12:34:36.093Z",
    isIncludedSuite: false,
    isAccepted: true,
  },
  {
    projectID: "ad05c7a0-9cd1-417c-9ab0-e464ebf5c007",
    isDeleted: false,
    scriptId: "20e5bbff-05e7-4935-989a-78bae42ddfa8",
    testDescription: "PID Controller Response Test",
    script_language: "Python",
    script_type: "unit_test",
    codePython: `# PID Controller Response Test
  import control
  import matplotlib.pyplot as plt
  
  Kp, Ki, Kd = 1.2, 0.5, 0.1
  plant = control.tf([1], [1, 2, 1])
  pid = control.tf([Kd, Kp, Ki], [1, 0])
  system = control.feedback(pid*plant, 1)
  
  t, y = control.step_response(system)
  plt.plot(t, y)
  plt.title("PID Step Response")
  plt.show()`,
    codeMatlab: `# PID Controller Response Test
  Kp = 1.2;
  Ki = 0.5;
  Kd = 0.1;
  plant = tf([1], [1, 2, 1]);
  pid = tf([Kd, Kp, Ki], [1, 0]);
  system = feedback(pid*plant, 1);
  [t, y] = step(system);
  plot(t, y);
  title('PID Step Response');`,
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
    codeMatlab: `# Motor Control Saturation Test
  input_voltage = -10:0.1:10;
  output_voltage = min(max(input_voltage, -5), 5);
  plot(input_voltage, output_voltage);
  title('Motor Control Saturation');
  xlabel('Input Voltage (V)');
  ylabel('Output Voltage (V)');`,
    codePython: `# Motor Control Saturation Test
  input_voltage = -10:0.1:10;
  output_voltage = min(max(input_voltage, -5), 5);
  plt.plot(input_voltage, output_voltage);
  plt.title('Motor Control Saturation');
  plt.xlabel('Input Voltage (V)');
  plt.ylabel('Output Voltage (V)');`,
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
    codePython: `# Drone Stability in Turbulence
  import numpy as np
  
  wind_gusts = np.random.normal(0, 8, 100)
  altitude = 100 + np.cumsum(wind_gusts) * 0.01
  print("Altitude deviation:", np.std(altitude))`,
    codeMatlab: `# Drone Stability in Turbulence
  wind_gusts = randn(1, 100) * 8;
  altitude = 100 + cumsum(wind_gusts) * 0.01;
  disp("Altitude deviation:", std(altitude));`,
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
    codePython: `# Sensor Calibration Validation
import numpy as np
import matplotlib.pyplot as plt

# Test sensor calibration accuracy
raw_values = np.array([100, 200, 300, 400, 500])
calibrated_values = raw_values * 0.98 + 2.1
expected_values = np.array([100, 200, 300, 400, 500])

error = np.abs(calibrated_values - expected_values)
max_error = np.max(error)
print(f"Maximum calibration error: {max_error:.2f}")`,
    codeMatlab: `# Sensor Calibration Validation
raw_values = [100, 200, 300, 400, 500];
calibrated_values = raw_values * 0.98 + 2.1;
expected_values = [100, 200, 300, 400, 500];

error = abs(calibrated_values - expected_values);
max_error = max(error);
fprintf('Maximum calibration error: %.2f\\n', max_error);`,
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
    codePython: `# Battery Life Simulation
import numpy as np

# Simulate battery discharge over time
initial_charge = 100  # percent
discharge_rate = 0.05  # percent per minute
time_hours = np.linspace(0, 20, 1200)  # 20 hours

charge_level = initial_charge * np.exp(-discharge_rate * time_hours * 60 / 100)
critical_time = time_hours[charge_level <= 10][0] if any(charge_level <= 10) else None

print(f"Battery reaches critical level at: {critical_time:.1f} hours")`,
    codeMatlab: `# Battery Life Simulation
initial_charge = 100; % percent
discharge_rate = 0.05; % percent per minute
time_hours = linspace(0, 20, 1200); % 20 hours

charge_level = initial_charge * exp(-discharge_rate * time_hours * 60 / 100);
critical_idx = find(charge_level <= 10, 1);
critical_time = time_hours(critical_idx);

fprintf('Battery reaches critical level at: %.1f hours\\n', critical_time);`,
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
    codePython: `# Network Latency Analysis
import numpy as np
import matplotlib.pyplot as plt

# Simulate network latency under different loads
load_levels = np.linspace(0, 100, 50)  # 0-100% network load
base_latency = 5  # ms
latency = base_latency + (load_levels ** 2) * 0.001

# Find when latency exceeds threshold
threshold = 50  # ms
critical_load = load_levels[latency > threshold][0] if any(latency > threshold) else None

plt.plot(load_levels, latency)
plt.axhline(y=threshold, color='r', linestyle='--')
plt.xlabel('Network Load (%)')
plt.ylabel('Latency (ms)')
print(f"Critical load level: {critical_load:.1f}%")`,
    codeMatlab: `# Network Latency Analysis
load_levels = linspace(0, 100, 50); % 0-100% network load
base_latency = 5; % ms
latency = base_latency + (load_levels .^ 2) * 0.001;

% Find when latency exceeds threshold
threshold = 50; % ms
critical_idx = find(latency > threshold, 1);
critical_load = load_levels(critical_idx);

plot(load_levels, latency);
hold on;
yline(threshold, 'r--');
xlabel('Network Load (%)');
ylabel('Latency (ms)');
fprintf('Critical load level: %.1f%%\\n', critical_load);`,
    lastModified: "2025-10-03T16:08:45.000Z",
    noOfModification: 0,
    createdAt: "2025-10-03T15:55:33.000Z",
    isIncludedSuite: true,
    isAccepted: false,
  },
];
