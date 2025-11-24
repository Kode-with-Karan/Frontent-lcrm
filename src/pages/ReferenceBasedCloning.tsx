import React from "react";
import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Header from "../components/Header";
import {
  FileText,
  Sparkles,
  Copy,
  RefreshCw,
  Edit3,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";

const tones = ["Professional", "Witty", "Inspiring", "Casual", "Reflective"];

const ReferenceBasedCloning = () => {
  const [posts, setPosts] = useState([""]);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [copyPercent, setCopyPercent] = useState(50);
  const [generatedPost, setGeneratedPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const handlePostChange = (index: number, value: string) => {
    const updated = [...posts];
    updated[index] = value;
    setPosts(updated);
  };

  const addPostInput = () => setPosts([...posts, ""]);

  const generatePost = async () => {
    setValidationWarning(null);
    setIsLoading(true);
    setGeneratedPost("");
    setIsCopied(false);
    setIsEditing(false);

    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        throw new Error("API base URL missing. Set VITE_API_BASE_URL in your .env");
      }
      const trimmed = posts.map(p => (p || "").trim()).filter(p => p.length > 0);
      if (trimmed.length === 0) {
        setValidationWarning("Please provide at least one previous LinkedIn post.");
        return;
      }
      if (!topic || topic.trim().length === 0) {
        setValidationWarning("Please provide a content topic.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/clone`,
        {
          posts: trimmed,
          topic: topic.trim(),
          tone,
          copyPercent,
        }
      );
      setGeneratedPost(res.data.generatedPost);
    } catch (err: any) {
      console.error("Error generating post:", err);
      const msg = err?.response?.data?.error || err.message || "Failed to generate post. Please try again.";
      setGeneratedPost(`⚠️ ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <Layout>
      <Header
        title="Reference Based Cloning"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="w-full p-7">
        {/* <div className="flex flex-col items-center justify-center min-h-[700px]"> */}
        <div className="max-w-6xl mx-auto p-8 rounded-lg shadow-lg space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div
              className="space-y-6"
              style={{
                background: "rgba(70, 70, 70, 0.11)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Input Previous Linkedin Posts
                </h3>
                <p className="text-[#A3A3A3] text-sm mb-4">
                  Paste 1–5 of your previous LinkedIn post contents.
                </p>
                {posts.map((post, idx) => (
                  <textarea
                    key={idx}
                    rows={4}
                    value={post}
                    onChange={(e) => handlePostChange(idx, e.target.value)}
                    placeholder={`Post #${idx + 1}`}
                    className="w-full bg-[#2E2E3E] text-white rounded-lg p-3 mb-3 border border-[#464646] focus:ring-[#7F56D9] focus:ring-2"
                    style={{
                      background: "rgba(70, 70, 70, 0.11)",
                    }}
                  />
                ))}
                {posts.length < 5 && (
                  <button
                    onClick={addPostInput}
                    className="text-[#7F56D9] hover:text-[#9F76F9] text-sm"
                  >
                    + Add another Post
                  </button>
                )}
              </div>

              <div
              // style={{
              //   background: "rgba(70, 70, 70, 0.11)",
              //   border: "1px solid rgba(255, 255, 255, 0.1)",
              //   padding: "1.5rem",
              //   borderRadius: "0.5rem",
              // }}
              >
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Content Topic
                </h3>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Overcoming founder burnout"
                  className="w-full text-white rounded-lg p-3 border border-[#464646] focus:ring-[#7F56D9] focus:ring-2"
                  style={{
                    background: "rgba(70, 70, 70, 0.11)",
                  }}
                />
              </div>

              <div
                className="flex flex-col gap-4"
                // style={{
                //   background: "rgba(70, 70, 70, 0.11)",
                //   border: "1px solid rgba(255, 255, 255, 0.1)",
                //   padding: "1.5rem",
                //   borderRadius: "0.5rem",
                // }}
              >
                <div>
                  <label className="block font-semibold mb-1 text-white">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full border border-white/10 text-white rounded-lg px-4 py-2 bg-[rgba(70,70,70,0.25)] focus:outline-none focus:ring-2 focus:ring-[#a259f7]/40 transition-all duration-200"
                    // style={{ colorScheme: "dark" }}
                  >
                    {tones.map((t) => (
                      <option
                        key={t}
                        value={t}
                        style={{
                          background: "#3a0147",
                          color: "#fff",
                        }}
                        className="rounded-lg"
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-white">
                    Copy Meter: {copyPercent}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={copyPercent}
                    onChange={(e) => setCopyPercent(Number(e.target.value))}
                    className="w-full accent-[#7F56D9]"
                  />
                  <p className="text-sm text-[#A3A3A3]">
                    Adjust how much style/structure to copy from originals.
                  </p>
                </div>
              </div>

              <button
                onClick={generatePost}
                disabled={isLoading || posts.every(p => !p || p.trim().length === 0) || !topic}
                className={`btn w-full transition-colors font-medium py-3 rounded-lg flex items-center justify-center space-x-2 text-white${
                  !isLoading && posts.some(p => p && p.trim().length > 0) && topic ? " btn--default" : ""
                }`}
                style={{
                  background: "rgba(70, 70, 70, 0.25)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Post</span>
                  </>
                )}
              </button>
              {validationWarning && (
                <div className="text-yellow-300 text-sm mt-2">{validationWarning}</div>
              )}
            </div>

            <div
              className="space-y-6"
              style={{
                background: "rgba(70, 70, 70, 0.11)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <h3 className="text-lg font-semibold mb-2 text-white">
                Generated Post
              </h3>
              <div className="min-h-96 rounded-lg p-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center text-purple-300 text-sm h-full animate-pulse">
                    <Loader2 className="w-10 h-10 mb-2 animate-spin" />
                    Generating your content...
                  </div>
                ) : generatedPost ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <h4 className="font-semibold">Generated Output</h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          {isEditing ? (
                            <Save className="w-5 h-5" />
                          ) : (
                            <Edit3 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <textarea
                        rows={10}
                        className="w-full bg-gray-900 text-white p-3 rounded-lg text-sm"
                        value={generatedPost}
                        onChange={(e) => setGeneratedPost(e.target.value)}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-gray-200 text-sm bg-gray-700 p-4 rounded-lg">
                        {generatedPost}
                      </pre>
                    )}

                    {isCopied && (
                      <p className="text-green-400 text-sm">
                        📋 Copied to clipboard!
                      </p>
                    )}

                    <button
                      onClick={generatePost}
                      disabled={isLoading}
                      className="bg-gray-600 hover:bg-gray-500 text-sm py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                    <FileText className="w-12 h-12 opacity-40 mb-2" />
                    Your generated post will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </Layout>
  );
};

export default ReferenceBasedCloning;
