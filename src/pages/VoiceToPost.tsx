import { useState, useRef } from "react";
import {
  Mic,
  Upload,  
  Loader2,
  ClipboardCopy,
  Pencil,
  CheckCircle,
} from "lucide-react";
import Header from "../components/Header";

type VoiceToPostResult = {
  transcript: string;
  post: string;
};

const VoiceToPost = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [intent, setIntent] = useState("Story");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoiceToPostResult | null>(null);
  const [editablePost, setEditablePost] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const audioChunks = useRef<Blob[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = async () => {
    if (!import.meta.env.VITE_API_BASE_URL) {
      setError("API base URL is missing. Set VITE_API_BASE_URL in your .env.");
      return;
    }
    if (!audioFile) return alert("Please upload or record an audio file.");

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("intent", intent);

    setLoading(true);
    setError(null);
    setResult(null);
    setIsEditing(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/voice/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to upload audio.");
      }

      const data = await res.json();
      setResult(data);
      setEditablePost(data.post);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const file = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });
      setAudioFile(file);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editablePost);
      alert("Post copied to clipboard!");
    } catch (err) {
      alert("Failed to copy text.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Voice Note to Post"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg p-8" style={{ background: "rgba(70, 70, 70, 0.25)" }}>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 rounded-lg text-center" style={{ background: "rgba(70, 70, 70, 0.25)" }}>
              <div className="w-16 h-16 bg-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg text-white font-semibold mb-2">
                Record Live
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Use your mic to speak directly
              </p>
              {recording ? (
                <button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  ⏹️ Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  🎤 Start Recording
                </button>
              )}
            </div>

            <div className="p-6 rounded-lg text-center" style={{ background: "rgba(70, 70, 70, 0.25)" }}>
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg text-white font-semibold mb-2">
                Upload Audio
              </h3>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAudioFile(e.target.files[0]);
                  }
                }}
                className="text-sm text-white mb-4 w-full"
              />
              <button
                onClick={handleUpload}
                disabled={loading || !audioFile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📁 Upload
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Intent
            </label>
            <select
              className="w-full rounded-lg px-4 py-2 border border-gray-600 text-white bg-[rgba(70,70,70,0.25)] focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
            >
              <option value="Story" style={{ background: "rgba(70, 70, 70, 0.85)" }}>Story</option>
              <option value="Educational" style={{ background: "rgba(70, 70, 70, 0.85)" }}>Educational</option>
              <option value="Inspirational" style={{ background: "rgba(70, 70, 70, 0.85)" }}>Inspirational</option>
              <option value="Promotional" style={{ background: "rgba(70, 70, 70, 0.85)" }}>Promotional</option>
            </select>
          </div>

          {loading && (
            <div className="text-center text-purple-400 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing voice note...</span>
            </div>
          )}

          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

          {result && (
            <div className="mt-10 p-6 rounded-lg" style={{ background: "rgba(70, 70, 70, 0.25)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Generated Post
                  </h3>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    title="Edit"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    title="Copy to Clipboard"
                    className="text-green-400 hover:text-green-300"
                  >
                    <ClipboardCopy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  className="w-full text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 bg-[rgba(70,70,70,0.25)]"
                  rows={10}
                  value={editablePost}
                  onChange={(e) => setEditablePost(e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {editablePost}
                </p>
              )}

              <div className="mt-6 text-sm text-gray-400">
                <p>
                  <strong>Transcript:</strong> {result.transcript}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceToPost;
