import { useState } from 'react';
import { createFileRoute, useNavigate} from '@tanstack/react-router';
import { Sms } from 'iconsax-reactjs';
import img from '../../../assets/onBoarding/forgetpass/pass.png'
import logo from '../../../assets/evaLogo.png'
import lock from '../../../assets/onBoarding/forgetpass/lock.png'

export const Route = createFileRoute(
  '/Authentication/ForgetPassword/ForgetPass',
)({
  component: RouteComponent,
})

export function RouteComponent() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
  
    // Check if both fields are filled
    const isFormValid = email.trim() !== '';
  
    const handleSignUp = () => {
      console.log('Sign up clicked');
      navigate({ to: '/Authentication/ForgetPassword/ForgetPassOtp' });
    };
  
    const handleGoogleSignup = () => {
      console.log('Google signup clicked');
    };
  
    const handleFacebookSignUp = () => {
      console.log('Facebook signUp clicked');
    };
  
    const handleLogin = () => {
      console.log('Login clicked');
      navigate({ to: '/Authentication/SignIn' })
    };
  
    return (
      <div className="min-h-screen flex">
        {/* Left side - Image with overlay */}
        <div className="flex-1 relative">
          <img src={img} alt="Sign in background" className="w-full h-[100vh] object-cover" />
        </div>
  
        {/* Right side - Sign up form */}
        <div className="flex-1 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex items-center justify-center">
                <img src={logo} alt="" className='w-[60px] h-[60px]'/>
              </div>
              <h1 className="text-[32px] font-bold text-gray-900 mb-2">Forgot Password</h1>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                Log in to access your EVE account and continue creating or discovering amazing events.
              </p>
            </div>
  
            {/* Form */}
            <div className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <div className="border-r-1 border-[#EAEAEA] pr-2 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Sms size="24" color="#BFBFBF" variant="Outline"/>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="text-[#2D2D2D] w-full pl-13 pr-4 py-3 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
  
              {/* Sign Up button */}
              <button
                onClick={handleSignUp}
                className={`w-full text-white font-medium py-3 px-4 rounded-[14px] transition-colors duration-200 ${
                  isFormValid 
                    ? 'bg-[#7417C6] hover:bg-[#5f1399]' 
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                Continue
              </button>
  
              {/* Social login buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-[14px] text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </button>
  
                <button
                  onClick={handleFacebookSignUp}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-[14px] text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Sign up with Facebook
                </button>
              </div>
  
              {/* Login link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Remember Password? {" "}
                  <button 
                    onClick={handleLogin}
                    className="text-[#7417C6] hover:text-purple-700 font-medium"
                  >
                    Log in
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
  
        {/* <OtpVerification/> */}
  
        {/* Decorative elements on the right side */}
        <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
          <div className="relative">
            <img src={lock} alt="" className='w-[199px] h-[179px]'/>
          </div>
        </div>
      </div>
    );
  }