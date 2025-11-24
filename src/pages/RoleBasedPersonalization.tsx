import React, { useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { Copy, Edit3, Save, Loader2, CheckCircle } from "lucide-react";

const goalOptions = [
  { value: '', label: 'Strategic Goal (choose one)' },
  { value: 'build sales pipeline', label: 'Build Sales Pipeline' },
  { value: 'get inbound leads', label: 'Get Inbound Leads' },
  { value: 'attract speaking gigs / pr', label: 'Attract Speaking Gigs / PR' },
  { value: 'gain investor visibility', label: 'Gain Investor Visibility' },
  { value: 'grow audience / email list', label: 'Grow Audience / Email List' },
  { value: 'drive site traffic / saas signups', label: 'Drive Site Traffic / SaaS Signups' },
];
const intentOptions = ["Intent", "Story", "Tip", "Lesson", "Update"];

const RoleBasedPersonalization = () => {
  const [textInput, setTextInput] = useState("");
  const [goal, setGoal] = useState('');
  const [intent, setIntent] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [intentDropdownOpen, setIntentDropdownOpen] = useState(false);
  const intentDropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const intentRef = useRef<HTMLDivElement>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const handleGenerate = async () => {
    setValidationWarning(null);
    if (!goal) {
      setValidationWarning('Please select a valid strategic goal.');
      return;
    }
    setLoading(true);
    setIsCopied(false);
    setGeneratedPost("");
    setIsEditing(false);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/goal/generate`,
        {
          goal,
          idea: textInput,
        }
      );
      const post =
        typeof response.data.post === "string"
          ? response.data.post
          : JSON.stringify(response.data.post, null, 2);
      setGeneratedPost(post);
    } catch (error: any) {
      console.error("Error generating post:", error);
      setGeneratedPost(
        error.response && error.response.data && error.response.data.error
          ? `⚠️ ${error.response.data.error}`
          : "⚠️ Failed to generate post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        intentRef.current &&
        !intentRef.current.contains(event.target as Node)
      ) {
        setIntentDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Layout>
      <Header
        title="Role based Content"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <textarea
              className="w-full border border-white/10 text-white rounded-md px-6 py-6 focus:outline-none focus:ring-2 focus:ring-[#a259f7]/40 placeholder-gray-400 bg-[rgba(70,70,70,0.25)] text-sm shadow-lg resize-none"
              rows={8}
              placeholder="Type your prompt here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 ">
        <div className="flex flex-col gap-2">
          {/* Custom Role Dropdown */}
          <div className="relative w-80 my-4">
            <select
              className="w-full border border-white/10 text-white rounded-md px-4 py-2 bg-[rgba(70,70,70,0.25)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#a259f7]/40 placeholder-gray-400 mb-1"
              value={goal}
              onChange={e => setGoal(e.target.value)}
            >
              {goalOptions.map(opt => (
                <option value={opt.value} key={opt.value} disabled={opt.value===''}>{opt.label}</option>
              ))}
            </select>
            {validationWarning && (
              <div className="text-yellow-300 text-center mt-2">{validationWarning}</div>
            )}
          </div>

          {/* Custom Intent Dropdown */}
          <div
            className="relative w-48"
            ref={intentRef}
            onMouseEnter={() => {
              if (intentDropdownTimeout.current)
                clearTimeout(intentDropdownTimeout.current);
              setIntentDropdownOpen(true);
            }}
            onMouseLeave={() => {
              intentDropdownTimeout.current = setTimeout(
                () => setIntentDropdownOpen(false),
                150
              );
            }}
          >
            <div className="border border-white/10 text-white rounded-md px-4 py-2 bg-[rgba(70,70,70,0.25)] text-sm font-medium cursor-pointer select-none flex justify-between items-center">
              <span
                className={intent && intent !== "Intent" ? "" : "text-gray-400"}
              >
                {intent && intent !== "Intent" ? intent : "Intent"}
              </span>
              <svg
                className={`ml-2 transition-transform duration-200 ${
                  intentDropdownOpen ? "rotate-180" : "rotate-90"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L10 8L14 12"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {intentDropdownOpen && (
              <div className="absolute left-full top-0 ml-2 w-48 bg-[rgba(70,70,70,0.25)] border border-white/10 rounded-md shadow-lg z-10 text-sm">
                {intentOptions.map((option, idx) => (
                  <div
                    key={option}
                    className={`px-4 py-2 cursor-pointer hover:bg-[#3a0147] ${
                      option === intent
                        ? "bg-[#a259f7]/20 text-white"
                        : idx === 0
                        ? "text-gray-400"
                        : "text-white"
                    } rounded-md`}
                    onClick={() => {
                      setIntent(option);
                      setIntentDropdownOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex">
            <button
              onClick={handleGenerate}
              disabled={loading || !textInput || !goal}
              className={`btn btn--default font-medium${
                loading || !textInput || !goal ? "" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full mt-10">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {generatedPost && (
              <>
                <div className="">
                  <div className="text-white text-xl mb-4 font-medium">
                    Post
                  </div>
                  <div className="bg-[rgba(70,70,70,0.25)] border border-white/10 rounded-md p-6">
                    {isEditing ? (
                      <div>
                        <textarea
                          className="w-full border border-white/10 text-white rounded-lg p-4 text-base focus:outline-none focus:ring-2 focus:ring-[#a259f7]/40 transition-all duration-200 resize-none bg-black/40"
                          rows={10}
                          value={generatedPost}
                          onChange={(e) => setGeneratedPost(e.target.value)}
                          placeholder="Edit your post..."
                        />
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={handleEditToggle}
                            className="btn btn--default font-medium"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-200 text-base leading-relaxed mb-6 whitespace-pre-wrap min-h-[120px]">
                        {generatedPost}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handleCopy}
                    title="Copy to Clipboard"
                    className={`p-3 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all duration-200 ${
                      isCopied ? "bg-green-500/20 text-green-400" : ""
                    }`}
                  >
                    {isCopied ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    title="Edit Post"
                    className="p-3 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all duration-200"
                  >
                    {isEditing ? (
                      <Save className="w-5 h-5" />
                    ) : (
                      <Edit3 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleBasedPersonalization;
