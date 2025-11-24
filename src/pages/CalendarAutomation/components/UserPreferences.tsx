import React, { useState } from "react";
import {
  Settings,
  User,
  Briefcase,
  Target,
  Clock,
  Bell,
  Save,
} from "lucide-react";
import { UserPreferences as UserPrefs } from "../services/api";

interface UserPreferencesProps {
  preferences: UserPrefs;
  onUpdate: (updates: Partial<UserPrefs>) => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({
  preferences,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(preferences);
  const [newPostingTime, setNewPostingTime] = useState("");
  const [newCustomPrompt, setNewCustomPrompt] = useState("");

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

  const businessGoalOptions = [
    "brand_awareness",
    "thought_leadership",
    "lead_generation",
    "networking",
    "customer_education",
    "product_awareness",
    "client_acquisition",
    "content_engagement",
    "brand_building",
    "showcase_expertise",
    "community_building",
    "personal_branding",
  ];

  const handleSave = () => {
    onUpdate(formData);
  };

  const addPostingTime = () => {
    if (
      newPostingTime &&
      !formData.preferredPostingTimes.includes(newPostingTime)
    ) {
      setFormData({
        ...formData,
        preferredPostingTimes: [
          ...formData.preferredPostingTimes,
          newPostingTime,
        ],
      });
      setNewPostingTime("");
    }
  };

  const removePostingTime = (timeToRemove: string) => {
    setFormData({
      ...formData,
      preferredPostingTimes: formData.preferredPostingTimes.filter(
        (time) => time !== timeToRemove
      ),
    });
  };

  const addCustomPrompt = () => {
    if (
      newCustomPrompt.trim() &&
      !formData.customPrompts.includes(newCustomPrompt.trim())
    ) {
      setFormData({
        ...formData,
        customPrompts: [...formData.customPrompts, newCustomPrompt.trim()],
      });
      setNewCustomPrompt("");
    }
  };

  const removeCustomPrompt = (index: number) => {
    setFormData({
      ...formData,
      customPrompts: formData.customPrompts.filter((_, i) => i !== index),
    });
  };

  const toggleBusinessGoal = (goal: string) => {
    const currentGoals = formData.businessGoals;
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];

    setFormData({ ...formData, businessGoals: updatedGoals });
  };

  const toggleWeekday = (day: keyof typeof formData.weeklySchedule) => {
    setFormData({
      ...formData,
      weeklySchedule: {
        ...formData.weeklySchedule,
        [day]: !formData.weeklySchedule[day],
      },
    });
  };

  const formatGoalLabel = (goal: string) => {
    return goal
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-green-600 rounded-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">User Preferences</h2>
        </div>
        <p className="text-gray-400">
          Customize your content generation settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
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
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                placeholder="e.g., Technology, SaaS, Marketing"
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                placeholder="e.g., Entrepreneurs, B2B decision makers"
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Tone
              </label>
              <select
                value={formData.contentTone}
                onChange={(e) =>
                  setFormData({ ...formData, contentTone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
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
          </div>
        </div>

        {/* Business Goals */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Business Goals</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {businessGoalOptions.map((goal) => (
              <label
                key={goal}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.businessGoals.includes(goal)}
                  onChange={() => toggleBusinessGoal(goal)}
                  className="w-4 h-4 text-green-600 bg-gray-600 border-gray-500 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-300">
                  {formatGoalLabel(goal)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Posting Schedule */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Posting Schedule</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Active Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(formData.weeklySchedule).map(
                  ([day, active]) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        toggleWeekday(
                          day as keyof typeof formData.weeklySchedule
                        )
                      }
                      className={`p-2 text-xs rounded-[5px] transition-colors border border-white/10 ${
                        active
                          ? "bg-white text-[#232323] font-semibold shadow"
                          : "bg-[rgba(70,70,70,0.11)] text-white hover:bg-white/10"
                      }`}
                      style={{ minWidth: 36 }}
                    >
                      {day.slice(0, 3)}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Posting Times
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="time"
                  value={newPostingTime}
                  onChange={(e) => setNewPostingTime(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
                />
                <button
                  type="button"
                  onClick={addPostingTime}
                  className="px-4 py-2 rounded-[5px] bg-white hover:bg-gray-200 text-[#232323] transition-colors border border-white/10"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferredPostingTimes.map((time) => (
                  <span
                    key={time}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-white text-[#232323] text-sm rounded-full border border-white/10"
                  >
                    <span>{time}</span>
                    <button
                      type="button"
                      onClick={() => removePostingTime(time)}
                      className="hover:text-red-300 transition-colors rounded-[5px] px-2 py-1 bg-transparent border border-white/10"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Preferences */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>Content Preferences</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contentPreferences.includeEmojis}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contentPreferences: {
                        ...formData.contentPreferences,
                        includeEmojis: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-green-600 bg-gray-600 border-gray-500 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-300">Include Emojis</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contentPreferences.includeHashtags}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contentPreferences: {
                        ...formData.contentPreferences,
                        includeHashtags: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-green-600 bg-gray-600 border-gray-500 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-300">Include Hashtags</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contentPreferences.includeQuestions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contentPreferences: {
                        ...formData.contentPreferences,
                        includeQuestions: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-green-600 bg-gray-600 border-gray-500 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-300">Include Questions</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contentPreferences.includeCTA}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contentPreferences: {
                        ...formData.contentPreferences,
                        includeCTA: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-green-600 bg-gray-600 border-gray-500 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-300">Include CTA</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Hashtags
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.contentPreferences.maxHashtags}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contentPreferences: {
                        ...formData.contentPreferences,
                        maxHashtags: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Length
                </label>
                <select
                  value={formData.contentPreferences.preferredPostLength}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contentPreferences: {
                        ...formData.contentPreferences,
                        preferredPostLength: e.target.value as
                          | "short"
                          | "medium"
                          | "long",
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
                >
                  <option value="short" className="bg-[#232323] text-white">
                    Short (≤500 chars)
                  </option>
                  <option value="medium" className="bg-[#232323] text-white">
                    Medium (500-1000 chars)
                  </option>
                  <option value="long" className="bg-[#232323] text-white">
                    Long (1000+ chars)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Prompts */}
      <div
        className="rounded-[5px] p-6"
        style={{
          background: "rgba(70,70,70,0.11)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Custom Prompts</span>
        </h3>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCustomPrompt}
              onChange={(e) => setNewCustomPrompt(e.target.value)}
              placeholder="Add a custom prompt for content generation"
              className="flex-1 px-3 py-2 rounded-[5px] text-white focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent border border-white/10"
            />
            <button
              type="button"
              onClick={addCustomPrompt}
              className="px-4 py-2 rounded-[5px] bg-white hover:bg-gray-200 text-[#232323] transition-colors border border-white/10"
            >
              Add
            </button>
          </div>

          {formData.customPrompts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Your Custom Prompts:</p>
              {formData.customPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-3 rounded-[5px] bg-transparent border border-white/10"
                >
                  <span className="flex-1 text-sm text-gray-300">{prompt}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomPrompt(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors rounded-[5px] px-2 py-1 bg-transparent border border-white/10"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-white hover:bg-gray-200 text-[#232323] font-medium rounded-[5px] transition-colors flex items-center space-x-2 mx-auto border border-white/10"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};

export default UserPreferences;
