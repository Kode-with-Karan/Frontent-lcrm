import { useState } from "react";
import { Auth, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from "firebase/auth";

const ResetPassword = ({ auth }: { auth: Auth }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    if (!currentPassword || !newPassword) {
      setError("Please fill all fields");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.code || err.message || "";
      if (msg.includes("auth/invalid-credential")) {
        setError("Invalid current password");
      } else if (msg.includes("auth/weak-password")) {
        setError("New password is too weak");
      } else {
        setError("Failed to update password");
      }
    }

    setLoading(false);
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 mt-2 text-sm font-medium">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mt-2 text-sm font-medium">{success}</p>
        )}
        <div className="flex justify-between items-center gap-4 mt-4">

          <button
            className="btn btn--default font-medium text-sm"
            onClick={handlePasswordUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <div
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to reset your password? An email will be sent to your registered email address."
                )
              ) {
                const user = auth.currentUser;
                if (user?.email) {
                  sendPasswordResetEmail(auth, user.email)
                    .then(() => {
                      alert("Password reset email sent! Please check your inbox.");
                    })
                    .catch((error) => {
                      alert("Error sending reset email: " + error.message);
                    });
                } else {
                  alert("No user email found");
                }
              }
            }}
            className="cursor-pointer text-blue-400 hover:text-blue-300"
          >
            Forgot Password?
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
