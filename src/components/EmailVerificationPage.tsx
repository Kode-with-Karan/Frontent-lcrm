import { useSearchParams } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../firebase";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();

    const handleVerify = async () => {
        const oobCode = searchParams.get("oobCode");
        if (!oobCode) {
            alert("Invalid verification link");
            return;
        }
        try {
            await applyActionCode(auth, oobCode);
            window.location.href = "/dashboard";
        } catch {
            alert("Verification failed or expired link");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Confirm Your Email for Klype
                </h2>
                <p className="text-gray-600 mb-4">
                    You're one step away from joining <span className="font-medium text-blue-600">Klype</span>.
                </p>
                <p className="text-gray-600 mb-6">
                    To complete your registration and access all features, please verify your email.
                    Just click the button below to confirm.
                </p>
                <button
                    onClick={handleVerify}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Verify My Email for Klype
                </button>
                <p className="text-sm text-gray-400 mt-4">
                    Make sure you clicked the most recent email link. If it doesn’t work, request a new one.
                </p>
            </div>
        </div>
    );

}
