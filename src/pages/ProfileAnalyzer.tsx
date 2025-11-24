import { useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Loader2,
  ClipboardCopy,
  ClipboardCheck,
  RefreshCcw,
} from "lucide-react";
import Header from "../components/Header";

const ProfileAnalyzer = () => {
  const [rawInput, setRawInput] = useState("");
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{original: {Headline: string, About: string, Experience: string}, rewritten: {Headline: string, About: string, Experience: string}, raw: string} | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const goals = [
    "Attract investors",
    "Generate leads",
    "Build personal brand",
    "Find new opportunities",
    "Establish thought leadership",
    "Network with industry leaders",
  ];

  const parseInput = (text: string) => {
    const sections = {
      name: "",
      headline: "",
      about: "",
      experience: "",
    };

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((l) => l.length > 0);

    // First pass: handle labeled input like "Name:", "Headline:", "About:", "Experience:" (case-insensitive)
    const labelRegex = /^(name|headline|about|experience)\s*:\s*(.*)$/i;
    let currentLabel: null | "about" | "experience" = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(labelRegex);
      if (match) {
        const label = match[1].toLowerCase();
        const value = match[2] || "";
        if (label === "name") sections.name = value.trim();
        if (label === "headline") sections.headline = value.trim();
        if (label === "about") {
          sections.about = value.trim();
          currentLabel = sections.about ? null : "about"; // continue collecting if empty after colon
        } else if (label === "experience") {
          sections.experience = value.trim();
          currentLabel = sections.experience ? null : "experience";
        } else {
          currentLabel = null;
        }
        continue;
      }

      // If the previous line started an unlabeled multiline section, keep appending until a new label appears
      if (currentLabel === "about") {
        const maybeLabel = line.match(labelRegex);
        if (maybeLabel) {
          // encountered next labeled section, step back one to let outer loop process it
          i -= 1;
          currentLabel = null;
          continue;
        }
        sections.about = (sections.about + " " + line).trim();
        continue;
      }
      if (currentLabel === "experience") {
        const maybeLabel = line.match(labelRegex);
        if (maybeLabel) {
          i -= 1;
          currentLabel = null;
          continue;
        }
        sections.experience = (sections.experience + " " + line).trim();
        continue;
      }
    }

    // Fallbacks: if headline/about/experience not found via labels, use previous heuristic parsing
    if (!sections.name && lines.length > 0) {
      sections.name = lines[0];
    }

    if (!sections.headline) {
      let headlineIdx = 1;
      while (
        headlineIdx < lines.length &&
        (lines[headlineIdx].toLowerCase().includes("connection") ||
          lines[headlineIdx].length < 2)
      ) {
        headlineIdx++;
      }
      if (headlineIdx < lines.length) {
        sections.headline = lines[headlineIdx];
      }
    }

    if (!sections.about) {
      let aboutStart = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].replace(/\s/g, "").toLowerCase().startsWith("aboutabout")) {
          aboutStart = i;
          break;
        }
        if (lines[i].replace(/\s/g, "").toLowerCase() === "about") {
          aboutStart = i;
          break;
        }
      }
      if (aboutStart !== -1) {
        const aboutLines: string[] = [];
        for (let j = aboutStart + 1; j < lines.length; j++) {
          if (
            /^(activity|experience|education|skills|message|more)$/i.test(
              lines[j].replace(/\s/g, "")
            )
          )
            break;
          if (lines[j].length === 0) break;
          aboutLines.push(lines[j]);
        }
        sections.about = aboutLines
          .join(" ")
          .replace(/…see more/g, "")
          .trim();
      }
    }

    if (!sections.experience) {
      let experienceStart = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].replace(/\s/g, "").toLowerCase() === "experience") {
          experienceStart = i;
          break;
        }
      }
      if (experienceStart !== -1) {
        const experienceLines: string[] = [];
        for (let j = experienceStart + 1; j < lines.length; j++) {
          if (
            /^(activity|education|skills|message|more|about)$/i.test(
              lines[j].replace(/\s/g, "")
            )
          )
            break;
          if (lines[j].length === 0) break;
          experienceLines.push(lines[j]);
        }
        sections.experience = experienceLines
          .join(" ")
          .replace(/…see more/g, "")
          .trim();
    }
    }

    return sections;
  };

  const submitProfile = async () => {
    setIsLoading(true);
    const parsed = parseInput(rawInput);

    // Backend requires headline, about, and experience to be non-empty
    if (!parsed.headline || !parsed.about || !parsed.experience) {
      alert("Please ensure your input contains Headline, About, and Experience sections.");
      setIsLoading(false);
      return;
    }

    const payload = {
      name: parsed.name || 'Information not available',
      headline: parsed.headline,
      about: parsed.about,
      experience: parsed.experience,
      goal: goal || 'Attract SaaS investors',
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/profile/analyze`,
        payload
      );

      if (res.data?.original && res.data?.rewritten) {
        setAnalysis({
          original: res.data.original,
          rewritten: res.data.rewritten,
          raw: res.data.raw || null,
        });
      } else {
        console.error("Unexpected response structure:", res.data);
        alert("Failed to analyze profile. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Failed to analyze profile. Please try again.";
      alert(errorMsg);
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (!analysis) return;
    const text = `Headline: ${analysis.rewritten.Headline}\n\nAbout: ${analysis.rewritten.About}\n\nExperience: ${analysis.rewritten.Experience}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="LinkedIn Profile Optimizer"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="max-w-4xl mx-auto px-6 py-10 text-white">
        <div className="space-y-6">
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={`Paste your full LinkedIn profile text here in this format:\n\nName: John Doe\nHeadline: Tech Enthusiast | Product Builder\nAbout: I specialize in...\nExperience: Engineer at X; PM at Y`}
            rows={10}
            className="w-full p-4 border border-gray-600 rounded-lg text-white bg-[rgba(70,70,70,0.25)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
            className="w-full px-4 py-3 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" style={{ background: "rgba(70, 70, 70, 0.85)" }}>
              Select Goal
            </option>
            {goals.map((g) => (
              <option
                key={g}
                value={g}
                style={{ background: "rgba(70, 70, 70, 0.85)" }}
              >
                {g}
              </option>
            ))}
          </select>

          <button
            onClick={submitProfile}
            disabled={isLoading || !rawInput || !goal}
            className={
              `btn btn--default font-medium flex justify-center items-center rounded-md mx-auto` +
              (isLoading || !rawInput || !goal ? "" : "")
            }
            style={{ minWidth: 120, letterSpacing: "0.03em" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="font-semibold tracking-wider">
                  Analyze Profile
                </span>
              </>
            )}
          </button>
        </div>

        <div
          className="mt-10 p-6 rounded-lg"
          style={{ background: "rgba(70, 70, 70, 0.25)" }}
        >
          {analysis ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">
                🔄 Original vs Optimized
              </h2>
              {["Headline", "About", "Experience"].map((field) => (
                <div key={field}>
                  <h3 className="font-semibold mb-1">{field}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-sm">
                      <p className="text-red-300 whitespace-pre-wrap">
                        {analysis.original[field as keyof typeof analysis.original]}
                      </p>
                    </div>
                    <div className="p-3 bg-green-900/20 border border-green-500/30 rounded text-sm">
                      <p className="text-green-300 whitespace-pre-wrap">
                        {analysis.rewritten[field as keyof typeof analysis.rewritten]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {analysis.raw && (
                <div>
                  <h3 className="font-semibold mb-2 text-yellow-400">
                    🔍 Raw Response
                  </h3>
                  <pre
                    className="text-yellow-300 text-xs p-3 rounded whitespace-pre-wrap"
                    style={{ background: "rgba(70, 70, 70, 0.25)" }}
                  >
                    {analysis.raw}
                  </pre>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={submitProfile}
                  className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                >
                  <RefreshCcw className="mr-2 w-4 h-4" /> Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  {copied ? (
                    <ClipboardCheck className="mr-2 w-4 h-4" />
                  ) : (
                    <ClipboardCopy className="mr-2 w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy Result"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              Your optimized profile will appear here after submission.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAnalyzer;
