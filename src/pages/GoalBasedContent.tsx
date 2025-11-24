import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  TrendingUp,
  Briefcase,
  Sparkles,
  ClipboardCopy,
  ClipboardCheck,
  Edit,
  Save,
  Loader2,
  Megaphone,
} from "lucide-react";
import axios from "axios";
import Header from "../components/Header";

const GoalBasedContent = () => {
  const [goal, setGoal] = useState("");
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const goalDropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goalRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const goalOptions = [
    { label: "Select a strategic goal", value: "" },
    { label: "Build sales pipeline", value: "build sales pipeline" },
    { label: "Get inbound leads", value: "get inbound leads" },
    { label: "Attract speaking gigs / PR", value: "attract speaking gigs / pr" },
    { label: "Gain investor visibility", value: "gain investor visibility" },
    { label: "Grow audience / email list", value: "grow audience / email list" },
    { label: "Drive site traffic / SaaS signups", value: "drive site traffic / saas signups" },
  ];

  const [idea, setIdea] = useState("");
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editablePost, setEditablePost] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle click outside to close dropdown and update position
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        goalRef.current &&
        !goalRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        console.log("Closing dropdown due to click outside"); // Debug log
        setGoalDropdownOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (goalRef.current && goalDropdownOpen) {
        const rect = goalRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    if (goalDropdownOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition);
      window.addEventListener("resize", updateDropdownPosition);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
      if (goalDropdownTimeout.current) {
        clearTimeout(goalDropdownTimeout.current);
      }
    };
  }, [goalDropdownOpen]);

  const generatePost = async () => {
    setIsLoading(true);
    setCopied(false);
    setIsEditing(false);
    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        throw new Error("API base URL missing. Set VITE_API_BASE_URL in your .env");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/goal/generate`,
        {
          goal,
          idea,
        }
      );
      setPost(response.data.post);
      setEditablePost(response.data.post);
    } catch (error: any) {
      console.error("Error generating post:", error);
      const msg = error?.response?.data?.error || error.message || "Failed to generate post.";
      setPost(`⚠️ ${msg}`);
      setEditablePost(`⚠️ ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editablePost);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Strategic Goal-Based Content Generator"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
            className="rounded-md p-6"
          >
            <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">
              Lead Generation
            </h3>
            <p className="text-gray-400 text-xs mb-3">
              Create posts designed to attract and convert potential clients or
              customers.
            </p>
            <ul className="text-[11px] text-gray-300 space-y-1">
              <li>• Problem-solution frameworks</li>
              <li>• Case study storytelling</li>
              <li>• Value proposition posts</li>
              <li>• Call-to-action optimization</li>
            </ul>
          </div>

          <div
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
            className="rounded-md p-6"
          >
            <Megaphone className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">
              Brand Awareness
            </h3>
            <p className="text-gray-400 text-xs mb-3">
              Build recognition and establish your presence in your industry.
            </p>
            <ul className="text-[11px] text-gray-300 space-y-1">
              <li>• Thought leadership content</li>
              <li>• Industry insights sharing</li>
              <li>• Behind-the-scenes stories</li>
              <li>• Trend commentary</li>
            </ul>
          </div>

          <div
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
            className="rounded-md p-6"
          >
            <Briefcase className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">
              Career Growth
            </h3>
            <p className="text-gray-400 text-xs mb-3">
              Position yourself for new opportunities and career advancement.
            </p>
            <ul className="text-[11px] text-gray-300 space-y-1">
              <li>• Achievement showcases</li>
              <li>• Skills demonstrations</li>
              <li>• Learning journey posts</li>
              <li>• Network engagement</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-gray-300 mb-1">
              Strategic Goal
            </label>
            <div className="relative w-full" ref={goalRef}>
              <div
                className="border border-gray-600 text-white rounded-md px-3 py-2 bg-[rgba(70,70,70,0.25)] text-xs font-medium cursor-pointer select-none flex justify-between items-center"
                onClick={() => {
                  const newOpenState = !goalDropdownOpen;
                  setGoalDropdownOpen(newOpenState);
                  if (newOpenState && goalRef.current) {
                    const rect = goalRef.current.getBoundingClientRect();
                    setDropdownPosition({
                      top: rect.bottom + window.scrollY,
                      left: rect.left + window.scrollX,
                      width: rect.width,
                    });
                  }
                }}
              >
                <span className={goal ? "" : "text-gray-400"}>
                  {goalOptions.find((opt) => opt.value === goal)?.label || "Select a strategic goal"}
                </span>
                <svg
                  className={`ml-2 transition-transform duration-200 ${
                    goalDropdownOpen ? "rotate-180" : "rotate-90"
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
              {goalDropdownOpen &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    className="bg-[#464646] border border-gray-600 rounded-md shadow-lg z-[9999]"
                    style={{
                      position: "absolute",
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width,
                      maxHeight: "200px",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                      scrollbarColor: "#6b7280 #374151",
                      minWidth: "300px",
                    }}
                  >
                    {goalOptions.map((option) => (
                      <div
                        key={option.value || option.label}
                        className={`px-3 py-3 cursor-pointer hover:bg-[#3a0147] text-xs border-b border-gray-600 rounded-md whitespace-nowrap ${
                          option.value === goal
                            ? "bg-[#a259f7]/20 text-white"
                            : option.value === ""
                            ? "text-gray-400"
                            : "text-white"
                        }`}
                        onClick={() => {
                          console.log("Clicked option:", option.value); // Debug log
                          console.log("Setting goal to:", option.value); // Debug log
                          if (option.value) {
                            setGoal(option.value);
                            console.log("Goal set to:", option.value); // Debug log
                          }
                          setGoalDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>,
                  document.body
                )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Post Idea</label>
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
              className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
              placeholder="e.g., How we simplified customer onboarding"
            />
          </div>

          <div className="flex justify-center mt-2">
            <button
              onClick={generatePost}
              disabled={isLoading || !goal || !idea}
              className={`btn btn--default font-medium flex justify-center items-center rounded-md ${
                isLoading || !goal || !idea ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ minWidth: 120, letterSpacing: "0.03em" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="font-semibold tracking-wider">Generate Strategic Post</span>
                </>
              )}
            </button>
          </div>
        </div>

        {post && (
          <div style={{ background: "rgba(70, 70, 70, 0.25)" }} className="rounded-md p-6">
            <h3 className="text-base font-semibold text-white mb-3 flex justify-between items-center">
              Generated Post
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-purple-400 hover:text-purple-300"
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
              </button>
            </h3>

            <textarea
              readOnly={!isEditing}
              value={editablePost}
              onChange={(e) => setEditablePost(e.target.value)}
              className="w-full text-xs text-gray-200 bg-gray-800 border border-gray-600 rounded-md p-3 min-h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex items-center justify-end space-x-2 mt-3">
              <button
                onClick={copyToClipboard}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalBasedContent;