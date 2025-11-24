import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import { UserPreferences as UserPrefs } from "../services/api";

interface GenerationSetupProps {
  onGenerate: (config: {
    numberOfPosts: number;
    startDate: string;
    customTopics: string[];
    userInputs: any;
  }) => void;
  userPreferences: UserPrefs | null;
  isGenerating: boolean;
}

const GenerationSetup: React.FC<GenerationSetupProps> = ({
  onGenerate,
  userPreferences,
  isGenerating,
}) => {
  const [numberOfPosts, setNumberOfPosts] = useState(15);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [userInputs, setUserInputs] = useState({
    role: userPreferences?.role || "Founder",
    industry: userPreferences?.industry || "",
    contentTone: userPreferences?.contentTone || "Professional",
    targetAudience: userPreferences?.targetAudience || "",
  });

  const defaultTopics = {
    Founder: [
      "startup lessons",
      "leadership challenges",
      "building company culture",
      "fundraising insights",
      "product development",
      "scaling teams",
      "market validation",
      "customer feedback",
      "business strategy",
      "work-life balance",
      "networking tips",
      "industry trends",
      "innovation mindset",
      "failure recovery",
      "success metrics",
    ],
    "SaaS Founder": [
      "SaaS metrics",
      "product-market fit",
      "customer acquisition",
      "churn reduction",
      "pricing strategy",
      "user onboarding",
      "feature prioritization",
      "technical debt",
      "API design",
      "security practices",
      "scalability challenges",
      "team building",
      "investor relations",
      "competitive analysis",
      "market trends",
    ],
    "Content Marketer": [
      "content strategy",
      "audience engagement",
      "brand storytelling",
      "social media trends",
      "content creation tools",
      "SEO tips",
      "campaign performance",
      "influencer marketing",
      "email marketing",
      "video content",
      "content distribution",
      "analytics insights",
      "creative process",
      "brand voice",
      "content planning",
    ],
    Freelancer: [
      "client acquisition",
      "pricing strategies",
      "project management",
      "work-life balance",
      "skill development",
      "networking tips",
      "portfolio building",
      "client communication",
      "time management",
      "financial planning",
      "market positioning",
      "service delivery",
      "business growth",
      "remote work",
      "professional development",
    ],
  };

  const roles = [
    "Founder",
    "SaaS Founder",
    "Content Marketer",
    "Freelancer",
    "Agency Owner",
    "Product Manager",
    "Marketing Manager",
    "Sales Manager",
    "Consultant",
    "Coach",
  ];
  const tones = [
    "Professional",
    "Casual",
    "Inspirational",
    "Educational",
    "Humorous",
    "Authoritative",
    "Conversational",
    "Motivational",
  ];

  const addCustomTopic = () => {
    if (newTopic.trim() && !customTopics.includes(newTopic.trim())) {
      setCustomTopics([...customTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeCustomTopic = (index: number) => {
    setCustomTopics(customTopics.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      numberOfPosts,
      startDate,
      customTopics,
      userInputs,
    });
  };

  const getSuggestedTopics = () => {
    const roleTopics =
      defaultTopics[userInputs.role as keyof typeof defaultTopics] ||
      defaultTopics.Founder;
    return roleTopics.slice(0, 10);
  };

  const addSuggestedTopic = (topic: string) => {
    if (!customTopics.includes(topic)) {
      setCustomTopics([...customTopics, topic]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-purple-600 rounded-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Generate Content Calendar
          </h2>
        </div>
        <p className="text-gray-400">
          Create {numberOfPosts} days of engaging LinkedIn content tailored to
          your audience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Configuration */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Basic Configuration</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Posts
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={numberOfPosts}
                onChange={(e) => setNumberOfPosts(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent border border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent border border-white/10"
              />
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Your Profile</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Role
              </label>
              <select
                value={userInputs.role}
                onChange={(e) =>
                  setUserInputs({ ...userInputs, role: e.target.value })
                }
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent border border-white/10"
              >
                {roles.map((role) => (
                  <option
                    key={role}
                    value={role}
                    className="bg-[#232323] text-white"
                  >
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={userInputs.industry}
                onChange={(e) =>
                  setUserInputs({ ...userInputs, industry: e.target.value })
                }
                placeholder="e.g., Technology, SaaS, Marketing"
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent border border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Tone
              </label>
              <select
                value={userInputs.contentTone}
                onChange={(e) =>
                  setUserInputs({ ...userInputs, contentTone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent border border-white/10"
              >
                {tones.map((tone) => (
                  <option
                    key={tone}
                    value={tone}
                    className="bg-[#232323] text-white"
                  >
                    {tone}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={userInputs.targetAudience}
                onChange={(e) =>
                  setUserInputs({
                    ...userInputs,
                    targetAudience: e.target.value,
                  })
                }
                placeholder="e.g., Entrepreneurs, B2B decision makers"
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent border border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Custom Topics */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Content Topics</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Add Custom Topics (Optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCustomTopic())
                  }
                  placeholder="Enter a topic you'd like to write about"
                  className="flex-1 px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent border border-white/10"
                />
                <button
                  type="button"
                  onClick={addCustomTopic}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {customTopics.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Your Custom Topics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {customTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                    >
                      <span>{topic}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomTopic(index)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-400 mb-2">
                Suggested topics for {userInputs.role}:
              </p>
              <div className="flex flex-wrap gap-2">
                {getSuggestedTopics().map((topic, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSuggestedTopic(topic)}
                    disabled={customTopics.includes(topic)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      customTopics.includes(topic)
                        ? "bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed"
                        : "bg-gray-600 text-gray-300 border-gray-500 hover:bg-gray-500 hover:text-white"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="p-4 mt-2 rounded-[5px]"
              style={{
                background: "rgba(70,70,70,0.11)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <p className="text-blue-300 text-sm">
                <strong>💡 Tip:</strong> If you don't add custom topics, we'll
                use suggested topics based on your role. The AI will generate
                diverse, engaging content across different themes like
                educational posts, personal stories, insights, and tips.
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isGenerating}
            className={`btn flex items-center space-x-2 mx-auto rounded-lg font-medium px-8 py-3 text-white transition-colors${
              !isGenerating ? " btn--default" : ""
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Content...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {numberOfPosts} Posts</span>
              </>
            )}
          </button>

          {isGenerating && (
            <p className="text-sm text-gray-400 mt-2">
              This may take a few minutes. We're creating personalized content
              for you.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default GenerationSetup;
