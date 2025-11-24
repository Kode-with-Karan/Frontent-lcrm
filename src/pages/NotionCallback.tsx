    import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const NotionCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = () => {
      const error = searchParams.get("error");
      const isPopup = window.opener && window.opener !== window;

      if (error) {
        setStatus("error");
        setMessage(`OAuth error: ${decodeURIComponent(error)}`);

        if (isPopup) {
          try {
            window.opener.postMessage(
              { type: "NOTION_OAUTH_ERROR", error: decodeURIComponent(error) },
              window.location.origin
            );
            window.close();
          } catch (postMessageError) {
            console.error(
              "Failed to send error message to parent:",
              postMessageError
            );
          }
        }
        return;
      }

      // Success path (backend handled the token exchange)
      setStatus("success");
      setMessage("Successfully connected to Notion!");

      if (isPopup) {
        try {
          window.opener.postMessage(
            { type: "NOTION_OAUTH_SUCCESS" },
            window.location.origin
          );
          window.close();
        } catch (postMessageError) {
          console.error(
            "Failed to send success message to parent:",
            postMessageError
          );
        }
      } else {
        // Direct navigation: redirect after showing message
        setTimeout(() => {
          navigate("/notes-sync");
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center border border-gray-700">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Connecting to Notion...
            </h2>
            <p className="text-gray-400">
              Please wait while we complete the connection.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Connection Successful!
            </h2>
            <p className="text-gray-400 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting you back to NotesSync...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-400 mb-4">{message}</p>
            <button
              onClick={() => navigate("/notes-sync")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Return to NotesSync
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotionCallback;
