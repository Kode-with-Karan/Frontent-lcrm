import { useState } from "react";
import QRCode from "react-qr-code"; // ✅ correct import for Vite
import { authenticator } from "otplib";
import { useNavigate } from "react-router-dom";

// Generate secret and otpauth URI
const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD"; // hardcoded base32 string (for dev only)
const otpauth = authenticator.keyuri("YourUser@YourApp", "KlypeAI", secret);

export default function TwoFA() {
  const [userToken, setUserToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    const isValid = authenticator.verify({ token: userToken, secret });

    if (isValid) {
      sessionStorage.setItem("2fa_verified", "true");
      navigate("/"); // or "/dashboard"
    } else {
      setError("Invalid token, try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-xl font-bold">Scan with Google Authenticator</h1>
      <div className="bg-white p-4 rounded">
        <QRCode value={otpauth} /> {/* ✅ renders correctly now */}
      </div>
      <input
        type="text"
        placeholder="Enter OTP"
        value={userToken}
        onChange={(e) => setUserToken(e.target.value)}
        className="p-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleVerify}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Verify
      </button>
    </div>
  );
}
