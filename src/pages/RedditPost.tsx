import React, { useState, useRef } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import {
  Upload,
  FileText,
  Share2,
  Copy,
  Loader2,
  AlertCircle,
} from "lucide-react";

const RedditPost = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [linkedInPost, setLinkedInPost] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [manualText, setManualText] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const extractTextFromImage = async () => {
    if (!selectedFile) return;
    if (!API_BASE) {
      setError("API base URL missing. Set VITE_API_BASE_URL in your .env");
      return;
    }
    setIsProcessing(true);
    setError("");
    setExtractedText("");
    setLinkedInPost("");
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const res = await fetch(`${API_BASE}/reddit/extract-text`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setExtractedText(data.data.extractedText);
      } else {
        setError(data.error || "Failed to extract text");
      }
    } catch (e: any) {
      setError(e.message || "Network error. Please check if the server is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateLinkedInPost = async (content: string) => {
    if (!content.trim()) return;
    if (!API_BASE) {
      setError("API base URL missing. Set VITE_API_BASE_URL in your .env");
      return;
    }
    setIsProcessing(true);
    setError("");
    setLinkedInPost("");
    try {
      const res = await fetch(`${API_BASE}/reddit/generate-linkedin-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLinkedInPost(data.data.linkedInPost);
      } else {
        setError(data.error || "Failed to generate LinkedIn post");
      }
    } catch (e: any) {
      setError(e.message || "Network error. Please check if the server is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processImageToLinkedIn = async () => {
    if (!selectedFile) return;
    if (!API_BASE) {
      setError("API base URL missing. Set VITE_API_BASE_URL in your .env");
      return;
    }
    setIsProcessing(true);
    setError("");
    setExtractedText("");
    setLinkedInPost("");
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const res = await fetch(`${API_BASE}/reddit/process-image-to-linkedin`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setExtractedText(data.data.extractedText);
        setLinkedInPost(data.data.linkedInPost);
      } else {
        setError(data.error || "Failed to process image");
      }
    } catch (e: any) {
      setError(e.message || "Network error. Please check if the server is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedText("");
    setLinkedInPost("");
    setError("");
    setManualText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Layout>
      <Header
        title="Reddit Post Cloning"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="w-full p-7 text-sm">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div
              className="rounded-lg p-1 shadow-md flex"
              style={{ background: "rgba(70,70,70,0.25)" }}
            >
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-6 py-2 rounded-md font-medium transition-all focus:outline-none ${
                  activeTab === "upload"
                    ? "bg-white text-black shadow-md"
                    : "bg-transparent text-[#e0e0e0]"
                }`}
                style={{ minWidth: 140 }}
              >
                Upload Image
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`px-6 py-2 rounded-md font-medium transition-all focus:outline-none ${
                  activeTab === "manual"
                    ? "bg-white text-black shadow-md"
                    : "bg-transparent text-[#e0e0e0]"
                }`}
                style={{ minWidth: 140 }}
              >
                Manual Input
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              {activeTab === "upload" ? (
                <div className="bg-[#18181b] rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
                    <Upload className="mr-2" size={24} />
                    Upload Reddit Screenshot
                  </h2>
                  <div
                    className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center hover:border-[#7F56D9] transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                        />
                        <p className="text-sm text-gray-400">
                          {selectedFile?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload size={48} className="mx-auto text-gray-600" />
                        <div>
                          <p className="text-lg font-medium text-gray-200">
                            Drop your image here or click to browse
                          </p>
                          <p className="text-sm text-gray-400">
                            Supports JPG, PNG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={extractTextFromImage}
                      disabled={!selectedFile || isProcessing}
                      className={
                        `flex-1 btn btn--default flex items-center justify-center font-medium` +
                        (!selectedFile || isProcessing ? "" : "")
                      }
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        <FileText className="mr-2" size={20} />
                      )}
                      Extract Text
                    </button>
                    <button
                      onClick={processImageToLinkedIn}
                      disabled={!selectedFile || isProcessing}
                      className={`w-full btn btn--default flex items-center justify-center font-medium rounded-md py-3 px-8 transition-all bg-gray-700 text-white hover:bg-gray-600 ${(!selectedFile || isProcessing) ? 'opacity-60 cursor-not-allowed' : ''}`}
                      style={{ maxWidth: 300 }}
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        <Share2 className="mr-2" size={20} />
                      )}
                      Generate LinkedIn Post
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#18181b] rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
                    <FileText className="mr-2" size={24} />
                    Manual Text Input
                  </h2>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Paste your Reddit content here..."
                    className="w-full h-64 p-4 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-[#7F56D9] focus:border-transparent bg-[#23232b] text-white"
                  />
                  <button
                    onClick={() => generateLinkedInPost(manualText)}
                    disabled={!manualText.trim() || isProcessing}
                    className={
                      `w-full btn btn--default flex items-center justify-center mt-4 font-medium` +
                      (!manualText.trim() || isProcessing ? "" : "")
                    }
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <Share2 className="mr-2" size={20} />
                    )}
                    Generate LinkedIn Post
                  </button>
                  <button
                    onClick={() => generateLinkedInPost(extractedText)}
                    disabled={!extractedText.trim() || isProcessing}
                    className={`w-full btn btn--default flex items-center justify-center font-medium rounded-md py-3 px-8 mt-4 transition-all bg-gray-700 text-white hover:bg-gray-600 ${(!extractedText.trim() || isProcessing) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    style={{ maxWidth: 300 }}
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <Share2 className="mr-2" size={20} />
                    )}
                    Generate LinkedIn Post
                  </button>
                </div>
              )}
              {/* Error Display */}
              {error && (
                <div className="bg-red-900/60 border border-red-400 rounded-lg p-4 flex items-center">
                  <AlertCircle className="text-red-400 mr-2" size={20} />
                  <span className="text-red-200">{error}</span>
                </div>
              )}
            </div>
            {/* Right Panel - Results */}
            <div className="space-y-6">
              {/* Extracted Text */}
              {extractedText && (
                <div className="bg-[#18181b] rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Extracted Text
                    </h3>
                    <button
                      onClick={() => copyToClipboard(extractedText)}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-gray-200 whitespace-pre-wrap">
                      {extractedText}
                    </p>
                  </div>
                  {/* <button
                    onClick={() => generateLinkedInPost(extractedText)}
                    disabled={!extractedText.trim() || isProcessing}
                    className={
                      `w-full btn btn--default flex items-center justify-center mt-4 font-medium` +
                      (!extractedText.trim() || isProcessing ? "" : "")
                    }
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <Share2 className="mr-2" size={20} />
                    )}
                    Generate LinkedIn Post
                  </button> */}
                  
                </div>
              )}
              {/* LinkedIn Post */}
              {linkedInPost && (
                <div className="bg-[#18181b] rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      LinkedIn Post
                    </h3>
                    <button
                      onClick={() => copyToClipboard(linkedInPost)}
                      className="bg-[#7F56D9] text-white px-4 py-2 rounded-lg hover:bg-[#9F76F9] transition-colors flex items-center"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-[#23232b] p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-gray-200 whitespace-pre-wrap">
                      {linkedInPost}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Reset Button */}
          <div className="text-center mt-8">
            <button
              onClick={resetForm}
              className="w-full btn btn--default flex items-center justify-center font-medium rounded-md py-3 px-8 transition-all bg-gray-700 text-white hover:bg-gray-600"
              style={{ maxWidth: 100, margin: "0 auto" }}
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RedditPost;
