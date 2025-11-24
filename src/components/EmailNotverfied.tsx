import { sendEmailVerification, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loader2, MailCheck, RefreshCcw, LogOut } from "lucide-react";
import {auth} from "../firebase";
import { Navigate } from "react-router-dom";
export default function EmailNotVerified() {
  const [user, loading] = useAuthState(auth);

  if(!user){
    return <Navigate to="/login" />;
  }
  const handleResend = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      alert("Verification email resent.");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className=" p-6 rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-center text-purple-600 mb-4">
          <MailCheck className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
        <p className="text-sm text-gray-600 mb-4">
          A verification link has been sent to <span className="font-medium">{user?.email}</span>. Please verify your email to continue.
        </p>

        <button
          onClick={handleResend}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition mb-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Resend Verification Email
        </button>

        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 text-sm text-white-500 hover:underline"
        >
          <LogOut className="w-4 h-4" />
          Wrong email? Sign out
        </button>
      </div>
    </div>
  );
}
