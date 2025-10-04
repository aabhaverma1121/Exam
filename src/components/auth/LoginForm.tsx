import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mediaService } from '../../services/mediaService';
import { Shield, Eye, EyeOff, Loader as Loader2, Camera, Mic, Monitor, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [proctorSetupStep, setProctorSetupStep] = useState(0);
  const [proctorUser, setProctorUser] = useState<any>(null);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    screen: false,
    location: false
  });
  const [isGrantingPermission, setIsGrantingPermission] = useState(false);
  const { login, signup, isLoading } = useAuth();

  const setupSteps = [
    {
      title: 'Camera Access',
      description: 'Allow access to your camera for identity verification and monitoring',
      icon: Camera,
      permission: 'camera',
      required: true
    },
    {
      title: 'Microphone Access',
      description: 'Allow access to your microphone for audio monitoring',
      icon: Mic,
      permission: 'microphone',
      required: true
    },
    {
      title: 'Screen Sharing',
      description: 'Allow screen sharing to monitor your proctoring interface',
      icon: Monitor,
      permission: 'screen',
      required: true
    },
    {
      title: 'Location Access',
      description: 'Allow location access to verify your proctoring location',
      icon: MapPin,
      permission: 'location',
      required: true
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignupMode) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (!name.trim()) {
        setError('Name is required');
        return;
      }

      const result = await signup(email, password, name, role);
      if (!result.success) {
        setError(result.error || 'Signup failed. Please try again.');
      } else if (result.user?.role === 'proctor') {
        setProctorUser(result.user);
        setProctorSetupStep(1);
      }
    } else {
      const result = await login(email, password);
      if (!result.success) {
        setError('Invalid credentials. Please try again.');
      } else if (result.user?.role === 'proctor') {
        setProctorUser(result.user);
        setProctorSetupStep(1);
      }
    }
  };

  const handlePermissionGrant = async (permission: string) => {
    setIsGrantingPermission(true);
    
    try {
      switch (permission) {
        case 'camera':
          await mediaService.requestCameraPermission();
          break;
          
        case 'microphone':
          await mediaService.requestMicrophonePermission();
          break;
          
        case 'screen':
          await mediaService.requestScreenSharePermission();
          break;
          
        case 'location':
          await mediaService.requestLocationPermission();
          break;
      }

      setPermissions(prev => ({ ...prev, [permission]: true }));

      // Auto-advance to next step after successful permission grant
      setTimeout(() => {
        if (proctorSetupStep <= setupSteps.length) {
          setProctorSetupStep(proctorSetupStep + 1);
        }
      }, 1000);
      
    } catch (error: any) {
      console.error(`Failed to grant ${permission} permission:`, error);
      alert(error.message || `Failed to grant ${permission} permission. Please try again.`);
    } finally {
      setIsGrantingPermission(false);
    }
  };

  const handleProctorSetupComplete = () => {
    if (proctorUser) {
      localStorage.setItem('examglance_user', JSON.stringify(proctorUser));
      setProctorSetupStep(0);
      setProctorUser(null);
      window.location.reload();
    }
  };

  const allPermissionsGranted = Object.values(permissions).every(p => p);
  const currentStepData = setupSteps[proctorSetupStep - 1];

  // Show proctor setup if proctor user and setup step > 0
  if (proctorUser && proctorSetupStep > 0) {
    if (allPermissionsGranted || proctorSetupStep > setupSteps.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 sm:p-8">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Setup Complete</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                All permissions have been granted. You're ready to start proctoring.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-medium text-green-900 text-sm sm:text-base">Security Verification Complete</h3>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                      Your identity and location have been verified. All monitoring systems are active.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProctorSetupComplete}
                className="w-full bg-blue-600 text-white rounded-lg py-2 sm:py-3 hover:bg-blue-700 font-medium text-sm sm:text-base transition-colors"
              >
                Enter Proctor Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!currentStepData) {
      return null;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Proctor Security Setup</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Complete security verification to begin proctoring</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 sm:mb-8">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(proctorSetupStep / setupSteps.length) * 100}%` }}
            ></div>
          </div>

          {/* Current Step */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">{currentStepData.description}</p>
            {currentStepData.required && (
              <p className="text-sm text-red-600 mt-2">* Required for proctoring</p>
            )}
          </div>

          {/* Permission Action */}
          <div className="space-y-4">
            <button
              onClick={() => handlePermissionGrant(currentStepData.permission)}
              disabled={isGrantingPermission}
              className="w-full bg-blue-600 text-white rounded-lg py-2 sm:py-3 hover:bg-blue-700 font-medium text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGrantingPermission ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Requesting Permission...</span>
                </>
              ) : (
                <span>Grant {currentStepData.title}</span>
              )}
            </button>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-900 text-sm sm:text-base">Security Notice</h3>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                    These permissions are required for secure exam proctoring and will be used only during your proctoring sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
            {setupSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < proctorSetupStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Permission Status */}
          <div className="mt-6 sm:mt-8 space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Permission Status:</h3>
            {setupSteps.map((step, index) => (
              <div key={step.permission} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <step.icon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{step.title}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  permissions[step.permission as keyof typeof permissions] ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const demoUsers = [
    { email: 'admin@examglance.com', role: 'Admin', color: 'bg-red-500' },
    { email: 'supervisor@examglance.com', role: 'Supervisor', color: 'bg-purple-500' },
    { email: 'proctor@examglance.com', role: 'Proctor', color: 'bg-blue-500' },
    { email: 'teacher@examglance.com', role: 'Teacher', color: 'bg-green-500' },
    { email: 'student@examglance.com', role: 'Student', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">ExamGlance</h2>
          <p className="mt-2 text-gray-300 text-sm sm:text-base">Secure Exam Proctoring Platform</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignupMode(false);
                setError('');
              }}
              className={`flex-1 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                !isSignupMode
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignupMode(true);
                setError('');
              }}
              className={`flex-1 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                isSignupMode
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignupMode && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="proctor">Proctor</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isSignupMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  {isSignupMode ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                isSignupMode ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Demo Users */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-medium text-white mb-4">Demo Users (Password: password123)</h3>
          <div className="grid grid-cols-1 gap-2">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => {
                  setEmail(user.email);
                  setPassword('password123');
                }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left"
              >
                <div className={`w-3 h-3 rounded-full ${user.color}`}></div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm sm:text-base">{user.role}</p>
                  <p className="text-gray-300 text-xs sm:text-sm">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;