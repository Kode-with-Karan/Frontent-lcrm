import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, fetchSignInMethodsForEmail, sendEmailVerification, signInWithPopup } from "firebase/auth";
import Spinner from "../components/Spinner";
import axios from "axios";
import { FirebaseError } from "firebase/app";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const onGoogleAuth = async () => {
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        setIsAuthenticating(false);
        alert("Login failed: " + (err as Error).message);
      }, 2000);
    }
  };
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAuthenticating(true);

    if (password !== confirmPassword) {
      setIsAuthenticating(false);
      alert("Passwords do not match. Please make sure both passwords are identical.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsAuthenticating(false);
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setIsAuthenticating(false);
      alert("Password should be at least 6 characters long.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        const method = methods[0];
        let message = "This email is already registered.";

        if (method === 'password') {
          message += " Please login with your password or reset it if you've forgotten.";
        } else if (method === 'google.com') {
          message += " This email was registered with Google. Please sign in with Google instead.";
        }

        setIsAuthenticating(false);
        alert(message);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert("Signup successful. Please check your email to verify your account.");
      navigate("/verify-email");
    } catch (err: unknown) {
      setIsAuthenticating(false);

      if (axios.isAxiosError(err)) {
        alert(`Signup failed: ${err.response?.data?.message || 'Server error occurred'}`);
      } else if (err instanceof FirebaseError) {
        alert(`Signup failed: ${err.message}`);
      } else if (err instanceof Error) {
        alert(`Signup failed: ${err.message}`);
      } else {
        alert("Signup failed: An unknown error occurred.");
      }
    }
  };


  return (
    <>
      {isAuthenticating && (
        <div className="absolute flex justify-center items-center top-0 left-0 h-full w-full bg-black/95">
          <Spinner size={25} />
        </div>
      )}

      <div className="h-screen bg-[#451545] flex flex-col lg:flex-row overflow-hidden">
        <div className="hidden lg:flex items-center justify-center p-2.5 w-2/5">
          <div className="rounded-lg w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src="/Banner.png"
              alt="LinkedIn CRM Brand"
              className="w-full h-full shadow-lg object-cover object-center rounded-lg"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-auto bg-white p-4 lg:w-3/5 m-2  rounded-lg">
          <div className="w-full max-w-sm">
            <div className="text-center space-y-3 mb-6">
              <div className="lg:hidden mx-auto w-full h-[50px] rounded-lg overflow-hidden mb-4">
                <img
                  src="/Banner.png"
                  alt="LinkedIn CRM Brand"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="hidden lg:flex mx-auto w-auto h-10 items-center justify-center">
                <span
                  className="font-bold text-black text-2xl"
                  style={{
                    fontFamily:
                      '"Paralucent", "Inter", "Segoe UI", system-ui, sans-serif',
                  }}
                >
                  LinkedIn CRM
                </span>
              </div>
              <div>
                <h1 className="font-semibold text-black text-lg">
                  Sign up for LinkedIn CRM
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create your account to get started
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <form onSubmit={(e) => handleSignup(e)} className="space-y-3">
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-black"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Sign Up
                </button>
              </form>

              <div className="flex items-center justify-between text-sm">
                <button
                  className="text-gray-600 hover:text-black underline-offset-4 hover:underline ml-auto"
                  onClick={() => navigate("/login")}
                >
                  Already have an account?
                </button>
              </div>

              <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <div className="mx-4 text-center whitespace-nowrap">
                  <span className="text-black">Or continue with</span>
                </div>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                className="w-full px-4 py-2 bg-white border border-gray-200 text-black hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
                onClick={onGoogleAuth}
                disabled={isAuthenticating}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By continuing, you agree to our{" "}
                <button className="text-black hover:underline underline-offset-4">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-black hover:underline underline-offset-4">
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}