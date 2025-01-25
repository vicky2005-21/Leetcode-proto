export interface Submission {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  submittedAt: string;
  language: 'python' | 'java' | 'cpp' | 'javascript';
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error';
  runtime: number; // in milliseconds
  memory: number; // in KB
  code: string;
  testCasesPassed: number;
  totalTestCases: number;
}

export const mockSubmissions: Submission[] = [
  {
    id: 'sub_001',
    questionId: 'phy_001',
    userId: 'user2',
    userName: 'Alice Smith',
    submittedAt: '2025-01-22T18:15:00',
    language: 'python',
    status: 'accepted',
    runtime: 125,
    memory: 14200,
    code: `def calculate_max_height(v0, theta, g=9.8):
    import math
    theta_rad = math.radians(theta)
    h_max = (v0 * math.sin(theta_rad))**2 / (2 * g)
    return round(h_max, 1)

# Test the function
v0 = 20  # initial velocity in m/s
theta = 60  # angle in degrees
result = calculate_max_height(v0, theta)
print(f"Maximum height: {result} m")  # Should output 17.7 m`,
    testCasesPassed: 15,
    totalTestCases: 15
  },
  {
    id: 'sub_002',
    questionId: 'phy_001',
    userId: 'user3',
    userName: 'Bob Johnson',
    submittedAt: '2025-01-22T18:10:00',
    language: 'cpp',
    status: 'accepted',
    runtime: 98,
    memory: 12800,
    code: `#include <iostream>
#include <cmath>

double calculateMaxHeight(double v0, double theta, double g = 9.8) {
    double theta_rad = theta * M_PI / 180.0;
    double h_max = pow(v0 * sin(theta_rad), 2) / (2 * g);
    return round(h_max * 10) / 10;
}

int main() {
    double v0 = 20;  // initial velocity in m/s
    double theta = 60;  // angle in degrees
    double result = calculateMaxHeight(v0, theta);
    std::cout << "Maximum height: " << result << " m\\n";
    return 0;
}`,
    testCasesPassed: 15,
    totalTestCases: 15
  },
  {
    id: 'sub_003',
    questionId: 'phy_001',
    userId: 'user4',
    userName: 'Carol Wilson',
    submittedAt: '2025-01-22T17:55:00',
    language: 'java',
    status: 'wrong_answer',
    runtime: 156,
    memory: 15600,
    code: `public class ProjectileMotion {
    public static double calculateMaxHeight(double v0, double theta) {
        double g = 9.8;
        double theta_rad = Math.toRadians(theta);
        // Bug: Missing square of sine
        double h_max = (v0 * Math.sin(theta_rad)) / (2 * g);
        return Math.round(h_max * 10) / 10.0;
    }

    public static void main(String[] args) {
        double v0 = 20;  // initial velocity in m/s
        double theta = 60;  // angle in degrees
        double result = calculateMaxHeight(v0, theta);
        System.out.printf("Maximum height: %.1f m%n", result);
    }
}`,
    testCasesPassed: 3,
    totalTestCases: 15
  }
];
