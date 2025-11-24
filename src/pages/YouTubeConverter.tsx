import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { Loader2, ClipboardCopy, Pencil, Check } from "lucide-react";

type ResultType = {
  post: string;
  metadata: {
    hashtags: string[];
    tone: string;
    length: number;
    model: string;
    tokens_used: number;
  };
};

const YouTubeToPost = () => {
  const toneOptions = [
    { value: "", label: "Select Tone" },
    { value: "educational", label: "Educational" },
    { value: "inspirational", label: "Inspirational" },
    { value: "story", label: "Story-driven" },
  ];

  // Custom dropdown state
  const [customDropdownOpen, setCustomDropdownOpen] = useState(false);
  const customDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        customDropdownRef.current &&
        !customDropdownRef.current.contains(event.target as Node)
      ) {
        setCustomDropdownOpen(false);
      }
    }
    if (customDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [customDropdownOpen]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePost, setEditablePost] = useState("");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  // Removed unused toneDropdownOpen state

  const handleSubmit = async () => {
    setValidationWarning(null);
    if (!youtubeUrl) {
      setValidationWarning("Please enter a YouTube Shorts URL.");
      return;
    }
    let chosenTone = tone;
    if (!tone) {
      chosenTone = "educational"; // fallback
      setTone("educational");
    }
    if (!import.meta.env.VITE_API_BASE_URL) {
      setValidationWarning("API base URL environment variable is missing! Check your .env setup.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setIsEditing(false);
    try {
      console.log("fetching post");
      console.log("youtubeUrl", youtubeUrl);
      console.log("tone", chosenTone);
      console.log("import.meta.env.VITE_API_BASE_URL", import.meta.env.VITE_API_BASE_URL);
      console.log("url", `${import.meta.env.VITE_API_BASE_URL}/yt-to-post`);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/yt-to-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ youtubeUrl, tone: chosenTone }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Network response was not ok");
      }
      const data = await response.json();
      setResult(data);
      setEditablePost(data.post);
    } catch (err: any) {
      setError(err.message || "Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editablePost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="min-h-screen">
      {/* <div className="pt-4"> */}
        <Header
          title="YouTube Shorts to Post Converter"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showBackButton
        />
      {/* </div> */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Input Section */}
        <div className="space-y-6 mb-12">
          <div>
            <input
              type="text"
              className="w-full border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-gray-400 bg-[rgba(70,70,70,0.25)] text-base"
              placeholder="YouTube Shorts URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
          <div className="relative" ref={customDropdownRef}>
            <button
              type="button"
              className="w-full border border-white/10 text-white rounded-md px-3 py-2 bg-[rgba(70,70,70,0.25)] text-base shadow-lg z-10 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/30"
              onClick={() => setCustomDropdownOpen((open) => !open)}
            >
              <span>
                {toneOptions.find((opt) => opt.value === tone)?.label ||
                  "Select Tone"}
              </span>
              <svg
                className={`ml-2 transition-transform duration-200 ${
                  customDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 8L10 12L14 8"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {customDropdownOpen && (
              <div className="absolute left-0 top-full w-full bg-[rgba(70,70,70,0.25)] border border-white/10 rounded-md shadow-lg z-20 mt-1 overflow-hidden">
                {toneOptions.map((opt, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === toneOptions.length - 1;
                  const isSelected = tone === opt.value;
                  // Add rounded corners to highlight for first/last option
                  const highlightClass =
                    isSelected || customDropdownOpen
                      ? `${isFirst ? "rounded-t-md" : ""} ${
                          isLast ? "rounded-b-md" : ""
                        }`
                      : "";
                  return (
                    <div
                      key={opt.value || "empty"}
                      className={`px-4 py-2 cursor-pointer text-white transition-colors ${
                        isSelected ? `bg-white/10 ${highlightClass}` : ""
                      } hover:bg-white/10 ${highlightClass}`.trim()}
                      onClick={() => {
                        setTone(opt.value);
                        setCustomDropdownOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading || !youtubeUrl}
              className={`btn btn--default font-medium${loading || !youtubeUrl ? "" : ""}`}
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
          {/* Validation warning */}
          {validationWarning && (
            <div className="text-yellow-300 text-center mt-4">{validationWarning}</div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-8 bg-red-900/20 border border-red-500/30 rounded-md p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-md flex items-center justify-center">
                <span className="text-red-400 text-xl">⚠</span>
              </div>
              <div>
                <h3 className="text-red-400 font-semibold">
                  Generation Failed
                </h3>
                <p className="text-red-300/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Generated Post Box (for styling/demo) */}
        {/* <div className="mt-8 opacity-80 pointer-events-none select-none">
          <div className="text-white text-lg mb-4 font-medium">
            Post (Preview)
          </div>
          <div
            className="border border-white/20 rounded-md mx-auto"
            style={{
              background: "rgba(70,70,70,0.25)",
              minHeight: "180px",
              maxWidth: "100%",
              width: "100%",
              padding: "2.5rem",
            }}
          >
            <div
              className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap"
              style={{ minHeight: "120px" }}
            >
              Large Language Models (LLMs) have rapidly transformed the
              landscape of artificial intelligence by demonstrating remarkable
              capabilities in understanding and generating human-like text.
              These models are trained on vast amounts of data from books,
              websites, and other textual sources, allowing them to grasp
              context, tone, and subtle nuances of language. Beyond simple
              question-answering, LLMs can summarize long documents, translate
              languages, draft creative writing, and even assist in coding
              tasks. Their versatility makes them valuable tools in education,
              customer support, research, and content creation. However,
              alongside their impressive benefits, ethical considerations like
              bias, misinformation, and responsible usage continue to shape
              ongoing discussions about their role in society.
            </div>
          </div> */}
          {/* Action buttons and hashtags below the box */}
          {/* <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <button className="p-2 border border-white/10 rounded-lg text-gray-300 bg-white/10">
                <ClipboardCopy className="w-5 h-5" />
              </button>
              <button className="p-2 border border-white/10 rounded-lg text-gray-300 bg-white/10">
                <Pencil className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Education", "Career", "Technology", "Linkedin", "Posts"].map(
                (hashtag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    #{hashtag}
                  </span>
                )
              )}
            </div>
          </div>
        </div> */}

        {/* Results Section */}
        {result && (
          <div className="mt-8">
            <div className="text-white text-lg mb-4 font-medium">Post</div>
            <div
              className="border border-white/20 rounded-md mx-auto"
              style={{
                background: "rgba(70,70,70,0.25)",
                minHeight: "180px",
                maxWidth: "100%",
                width: "100%",
                padding: "2.5rem",
              }}
            >
              {isEditing ? (
                <div>
                  <textarea
                    className="w-full border border-white/20 text-white rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 resize-none bg-transparent"
                    rows={6}
                    value={editablePost}
                    onChange={(e) => setEditablePost(e.target.value)}
                    placeholder="Edit your post..."
                    style={{ minHeight: "120px" }}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap"
                  style={{ minHeight: "120px" }}
                >
                  {editablePost}
                </div>
              )}
            </div>
            {/* Action buttons and hashtags below the box */}
            <div className="flex flex-col items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  title="Copy to Clipboard"
                  className={`p-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all duration-200 ${
                    copied ? "bg-green-500/20" : "bg-white/10"
                  }`}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <ClipboardCopy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  title="Edit Post"
                  className="p-2 border border-white/10 rounded-lg text-gray-300 bg-white/10"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {result.metadata.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeToPost;
