import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Zap,
  Settings,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { calendarAPI, UserPreferences, Post } from "../services/api";

interface SmartSchedulerProps {
  userPreferences: UserPreferences | null;
  posts: Post[];
  onScheduleComplete: (posts: Post[]) => void;
}

const SmartScheduler: React.FC<SmartSchedulerProps> = ({
  userPreferences,
  posts,
  onScheduleComplete,
}) => {
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulingOptions, setSchedulingOptions] = useState({
    startDate: new Date().toISOString().split("T")[0],
    skipWeekends: true,
    optimizeForEngagement: true,
    distributeEvenly: true,
    respectTimeZone: true,
    maxPostsPerDay: 2,
  });
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [preview, setPreview] = useState<any[]>([]);

  const draftPosts = posts.filter((p) => p.status === "draft");

  const handleSmartSchedule = async () => {
    if (selectedPosts.length === 0) {
      alert("Please select posts to schedule");
      return;
    }

    try {
      setIsScheduling(true);

      const postsToSchedule = selectedPosts.map((id) => {
        const post = posts.find((p) => p._id === id);
        return {
          title: post?.title,
          content: post?.content,
          theme: post?.theme,
          hashtags: post?.hashtags,
        };
      });

      const scheduledPosts = await calendarAPI.smartSchedule(postsToSchedule, {
        ...userPreferences,
        schedulingOptions,
      });

      onScheduleComplete(scheduledPosts);

      // Clear selection and reset
      setSelectedPosts([]);
      setPreview([]);
    } catch (error) {
      console.error("Error in smart scheduling:", error);
      alert("Error scheduling posts. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  const generatePreview = () => {
    if (selectedPosts.length === 0 || !userPreferences) return;

    const activeWeekdays: number[] = [];
    if (userPreferences.weeklySchedule) {
      Object.entries(userPreferences.weeklySchedule).forEach(
        ([day, active]) => {
          if (active) {
            const dayIndex = {
              sunday: 0,
              monday: 1,
              tuesday: 2,
              wednesday: 3,
              thursday: 4,
              friday: 5,
              saturday: 6,
            }[day];
            if (dayIndex !== undefined) activeWeekdays.push(dayIndex);
          }
        }
      );
    }

    const startDate = new Date(schedulingOptions.startDate);
    let currentDate = new Date(startDate);
    const preferredTimes = userPreferences.preferredPostingTimes || ["10:00"];

    const previewData = [];
    let timeIndex = 0;
    let postsToday = 0;

    for (let i = 0; i < selectedPosts.length; i++) {
      // Find next valid posting day
      while (
        (schedulingOptions.skipWeekends &&
          (currentDate.getDay() === 0 || currentDate.getDay() === 6)) ||
        (activeWeekdays.length > 0 &&
          !activeWeekdays.includes(currentDate.getDay())) ||
        postsToday >= schedulingOptions.maxPostsPerDay
      ) {
        if (postsToday >= schedulingOptions.maxPostsPerDay) {
          currentDate.setDate(currentDate.getDate() + 1);
          postsToday = 0;
          timeIndex = 0;
        } else {
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      const post = posts.find((p) => p._id === selectedPosts[i]);
      if (post) {
        previewData.push({
          postId: post._id,
          title: post.title,
          theme: post.theme,
          scheduledDate: new Date(currentDate),
          scheduledTime: preferredTimes[timeIndex % preferredTimes.length],
          dayOfWeek: currentDate.toLocaleDateString("en-US", {
            weekday: "short",
          }),
        });
      }

      postsToday++;
      timeIndex++;

      if (
        timeIndex >= preferredTimes.length &&
        postsToday < schedulingOptions.maxPostsPerDay
      ) {
        timeIndex = 0;
      } else if (postsToday >= schedulingOptions.maxPostsPerDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        postsToday = 0;
        timeIndex = 0;
      }
    }

    setPreview(previewData);
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const selectAllPosts = () => {
    setSelectedPosts(draftPosts.map((p) => p._id));
  };

  const clearSelection = () => {
    setSelectedPosts([]);
    setPreview([]);
  };

  React.useEffect(() => {
    if (selectedPosts.length > 0) {
      generatePreview();
    } else {
      setPreview([]);
    }
  }, [selectedPosts, schedulingOptions]);

  if (!userPreferences) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 border border-white/10 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Setup Required
        </h3>
        <p className="text-gray-400">
          Please configure your preferences first to use smart scheduling.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-purple-600 rounded-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Smart Scheduler</h2>
        </div>
        <p className="text-gray-400">
          AI-powered scheduling based on your preferences and optimal posting
          times
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Post Selection */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Select Posts to Schedule
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={selectAllPosts}
                className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-sm px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {draftPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No draft posts available</p>
                <p className="text-sm text-gray-500">
                  Generate some content first
                </p>
              </div>
            ) : (
              draftPosts.map((post) => (
                <div
                  key={post._id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPosts.includes(post._id)
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  onClick={() => togglePostSelection(post._id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-4 h-4 rounded border-2 mt-1 flex items-center justify-center ${
                        selectedPosts.includes(post._id)
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedPosts.includes(post._id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm px-2 py-1 bg-gray-700 text-gray-300 rounded">
                          {post.theme}
                        </span>
                      </div>
                      <p className="text-white text-sm line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">
              {selectedPosts.length} of {draftPosts.length} posts selected
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{
                  width:
                    draftPosts.length > 0
                      ? `${(selectedPosts.length / draftPosts.length) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Scheduling Options */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Scheduling Options</span>
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={schedulingOptions.startDate}
                onChange={(e) =>
                  setSchedulingOptions((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-white/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Posts Per Day
              </label>
              <select
                value={schedulingOptions.maxPostsPerDay}
                onChange={(e) =>
                  setSchedulingOptions((prev) => ({
                    ...prev,
                    maxPostsPerDay: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-white/20 focus:border-purple-500"
              >
                <option value={1}>1 post per day</option>
                <option value={2}>2 posts per day</option>
                <option value={3}>3 posts per day</option>
                <option value={4}>4 posts per day</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedulingOptions.skipWeekends}
                  onChange={(e) =>
                    setSchedulingOptions((prev) => ({
                      ...prev,
                      skipWeekends: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Skip weekends</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedulingOptions.optimizeForEngagement}
                  onChange={(e) =>
                    setSchedulingOptions((prev) => ({
                      ...prev,
                      optimizeForEngagement: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">
                  Optimize for engagement
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedulingOptions.distributeEvenly}
                  onChange={(e) =>
                    setSchedulingOptions((prev) => ({
                      ...prev,
                      distributeEvenly: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Distribute evenly</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Schedule Preview</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {preview.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg"
              >
                <div className="text-center">
                  <div className="text-white font-semibold">
                    {item.scheduledDate.getDate()}
                  </div>
                  <div className="text-xs text-gray-400">{item.dayOfWeek}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {item.scheduledTime}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-400">{item.theme}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {preview.length} posts scheduled over{" "}
              {Math.ceil(
                (preview[preview.length - 1]?.scheduledDate.getTime() -
                  preview[0]?.scheduledDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </div>
            <button
              onClick={handleSmartSchedule}
              disabled={isScheduling || selectedPosts.length === 0}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
            >
              {isScheduling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Schedule Posts</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Smart Insights */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Smart Insights</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-600/20 border border-blue-600/50 rounded-lg">
            <Target className="w-6 h-6 text-blue-400 mb-2" />
            <div className="text-sm text-white font-medium">Optimal Times</div>
            <div className="text-xs text-gray-300">
              {userPreferences.preferredPostingTimes.join(", ")}
            </div>
          </div>

          <div className="p-4 bg-green-600/20 border border-green-600/50 rounded-lg">
            <Calendar className="w-6 h-6 text-green-400 mb-2" />
            <div className="text-sm text-white font-medium">Active Days</div>
            <div className="text-xs text-gray-300">
              {Object.entries(userPreferences.weeklySchedule)
                .filter(([_, active]) => active)
                .map(([day]) => day.slice(0, 3))
                .join(", ")}
            </div>
          </div>

          <div className="p-4 bg-purple-600/20 border border-purple-600/50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
            <div className="text-sm text-white font-medium">Content Focus</div>
            <div className="text-xs text-gray-300">
              {userPreferences.businessGoals.slice(0, 2).join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartScheduler;
