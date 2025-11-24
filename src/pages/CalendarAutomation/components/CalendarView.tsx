import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  Circle,
  RefreshCw,
} from "lucide-react";
import { Post } from "../services/api";

interface CalendarViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onUpdatePost: (postId: string, updates: Partial<Post>) => void;
  onDeletePost: (postId: string) => void;
  onDragPost?: (
    postId: string,
    newDate: Date,
    newTime?: string
  ) => Promise<void>;
  onBulkOperation?: (
    operation: string,
    postIds: string[],
    data?: any
  ) => Promise<void>;
  onRefresh?: () => void;
  loading: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onSelectPost,
  onUpdatePost,
  onDeletePost,
  onDragPost,
  onBulkOperation,
  onRefresh,
  loading,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  React.useEffect(() => {
    const handler = (event: CustomEvent) => {
      if (event.detail && event.detail.date) {
        const jumpDate = new Date(event.detail.date);
        if (!isNaN(jumpDate.getTime())) {
          setCurrentDate(jumpDate);
        }
      }
    };
    window.addEventListener('jumpToCalendarDate', handler as EventListener);
    return () => window.removeEventListener('jumpToCalendarDate', handler as EventListener);
  }, []);

  React.useEffect(() => {
    if (posts && posts.length > 0) {
      console.log('First 10 posts:', posts.slice(0, 10).map(post => ({ _id: post._id, status: post.status, userId: post.userId, scheduledDate: post.scheduledDate })));
    }
  }, [posts]);

  React.useEffect(() => {
    // For selected date, print all matching posts for today (UTC)
    const today = new Date();
    const todayStr = today.toISOString().substring(0, 10);
    const targetDayPosts = posts.filter(
      p => typeof p.scheduledDate === 'string' && p.scheduledDate.substring(0, 10) === todayStr
    );
    console.log('TODAY POSTS:', targetDayPosts);
  }, [posts]);

  // Theme color mapping
  const getThemeColor = (theme: string) => {
    const colors = {
      Educational: "bg-blue-600",
      "Personal Story": "bg-purple-600",
      Insight: "bg-green-600",
      Question: "bg-yellow-600",
      CTA: "bg-red-600",
      Tips: "bg-indigo-600",
      "Industry News": "bg-orange-600",
    };
    return colors[theme as keyof typeof colors] || "bg-gray-600";
  };

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case "scheduled":
        return <Clock className="w-3 h-3 text-blue-400" />;
      default:
        return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const getPostsForDate = (date: Date) => {
    // Always use UTC date string for comparison
    const utcDateString = date.toISOString().substring(0, 10);
    return posts.filter((post) => {
      if (typeof post.scheduledDate === 'string' && post.scheduledDate.length >= 10) {
        return post.scheduledDate.substring(0, 10) === utcDateString;
      }
      const postDate = new Date(post.scheduledDate);
      return !isNaN(postDate.getTime()) && postDate.toISOString().substring(0, 10) === utcDateString;
    });
  };

  // Navigation handlers
  const navigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  // Drag and drop handlers with better positioning
  const handleDragStart = (e: React.DragEvent, post: Post) => {
    e.dataTransfer.setData("text/plain", post._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverCell(dateKey);
  };

  const handleDragLeave = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear if we're really leaving this cell
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      if (dragOverCell === dateKey) {
        setDragOverCell(null);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOverCell(null);

    const postId = e.dataTransfer.getData("text/plain");
    const post = posts.find((p) => p._id === postId);

    if (!post || !onDragPost) return;

    // Create normalized dates for comparison (local date, not time-dependent)
    const normalizeDate = (d: Date) => {
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();
      return new Date(year, month, day);
    };

    const currentPostDate = normalizeDate(new Date(post.scheduledDate));
    const targetDate = normalizeDate(date);

    // Don't move if it's the same date
    if (currentPostDate.getTime() === targetDate.getTime()) {
      return;
    }

    try {
      // Ensure we pass the exact target date (normalized to avoid timezone issues)
      await onDragPost(postId, targetDate, post.scheduledTime);
    } catch (error) {
      console.error("Error moving post:", error);
    }
  };

  // Status change handler
  const handleStatusChange = (
    postId: string,
    newStatus: "draft" | "scheduled" | "published"
  ) => {
    onUpdatePost(postId, { status: newStatus });
  };

  // Bulk operations handlers
  const handleBulkStatusChange = async (status: string) => {
    if (onBulkOperation && selectedPosts.length > 0) {
      try {
        await onBulkOperation("update_status", selectedPosts, { status });
        setSelectedPosts([]);
      } catch (error) {
        console.error("Error updating posts:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (onBulkOperation && selectedPosts.length > 0) {
      if (window.confirm(`Delete ${selectedPosts.length} posts?`)) {
        try {
          await onBulkOperation("delete", selectedPosts);
          setSelectedPosts([]);
        } catch (error) {
          console.error("Error deleting posts:", error);
        }
      }
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days =
    viewMode === "month"
      ? getDaysInMonth(currentDate)
      : getDaysInWeek(currentDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("prev")}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("next")}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`p-2 rounded-lg transition-colors ${
                loading
                  ? "opacity-50 cursor-not-allowed text-gray-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              title="Refresh calendar"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          )}
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm rounded-md transition-colors bg-[rgba(70,70,70,0.25)] text-white hover:bg-white hover:text-black"
          >
            Today
          </button>
          <div
            className="flex rounded-lg p-1"
            style={{ background: "rgba(70,70,70,0.25)" }}
          >
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                viewMode === "month"
                  ? "bg-white text-black font-semibold"
                  : "bg-[rgba(70,70,70,0.25)] text-white hover:bg-white hover:text-black"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                viewMode === "week"
                  ? "bg-white text-black font-semibold"
                  : "bg-[rgba(70,70,70,0.25)] text-white hover:bg-white hover:text-black"
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPosts.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800 rounded-lg border border-white/20 shadow-lg p-4">
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                {selectedPosts.length} post
                {selectedPosts.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => handleBulkStatusChange(e.target.value)}
                  className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-white/20"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Change Status
                  </option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedPosts([])}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div
        className="rounded-xl overflow-hidden mt-8"
        style={{
          background: "rgba(70,70,70,0.11)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-transparent border-b border-white/10">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-base font-medium text-white text-center border-r border-white/10 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {viewMode === "month"
            ? (() => {
                const daysArr = getDaysInMonth(currentDate);
                // Pad the start with empty cells if the first day is not Sunday
                const firstDayOfWeek = daysArr[0].getDay();
                const emptyStart = Array.from(
                  { length: firstDayOfWeek },
                  (_, i) => <div key={`empty-start-${i}`}></div>
                );
                // Pad the end with empty cells if the last day is not Saturday
                const lastDayOfWeek = daysArr[daysArr.length - 1].getDay();
                const emptyEnd = Array.from(
                  { length: 6 - lastDayOfWeek },
                  (_, i) => <div key={`empty-end-${i}`}></div>
                );
                return [
                  ...emptyStart,
                  ...daysArr.map((day, index) => {
                    const dayPosts = getPostsForDate(day);
                    const isToday =
                      day.toDateString() === new Date().toDateString();
                    const isCurrentMonth =
                      day.getMonth() === currentDate.getMonth();
                    const dateKey = `${day.getFullYear()}-${String(
                      day.getMonth() + 1
                    ).padStart(2, "0")}-${String(day.getDate()).padStart(
                      2,
                      "0"
                    )}`;
                    const isDraggedOver = dragOverCell === dateKey;
                    return (
                      <div
                        key={index}
                        onDragOver={(e) => handleDragOver(e, dateKey)}
                        onDrop={(e) => handleDrop(e, day)}
                        onDragLeave={(e) => handleDragLeave(e, dateKey)}
                        className={`min-h-[110px] p-2 border-r border-b border-white/10 transition-all bg-transparent ${
                          isToday ? "ring-2 ring-white" : ""
                        } ${isCurrentMonth ? "" : "opacity-40"} ${
                          isDraggedOver
                            ? "bg-blue-500/20 ring-1 ring-blue-400"
                            : ""
                        } last:border-r-0`}
                      >
                        <div
                          className={`text-base font-medium mb-2 text-white`}
                        >
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayPosts.slice(0, 3).map((post) => (
                            <div
                              key={post._id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, post)}
                              onClick={() => onSelectPost(post)}
                              className={`p-1 rounded text-xs cursor-move hover:opacity-80 transition-opacity ${getThemeColor(
                                post.theme
                              )} text-white`}
                              title="Drag to move to another date"
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate flex-1">
                                  {post.theme}
                                </span>
                                {getStatusIcon(post.status)}
                              </div>
                              <div className="text-xs opacity-75">
                                {post.scheduledTime}
                              </div>
                            </div>
                          ))}
                          {dayPosts.length > 3 && (
                            <div className="text-xs text-gray-400 text-center">
                              +{dayPosts.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }),
                  ...emptyEnd,
                ];
              })()
            : (days as Date[]).map((day, index) => {
                const dayPosts = getPostsForDate(day);
                const isToday =
                  day.toDateString() === new Date().toDateString();
                const dateKey = `${day.getFullYear()}-${String(
                  day.getMonth() + 1
                ).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
                const isDraggedOver = dragOverCell === dateKey;

                return (
                  <div
                    key={index}
                    onDragOver={(e) => handleDragOver(e, dateKey)}
                    onDrop={(e) => handleDrop(e, day)}
                    onDragLeave={(e) => handleDragLeave(e, dateKey)}
                    className={`min-h-[110px] p-2 border-r border-b border-white/10 transition-all bg-transparent ${
                      isToday ? "ring-2 ring-white" : ""
                    } ${
                      isDraggedOver ? "bg-blue-500/20 ring-1 ring-blue-400" : ""
                    } last:border-r-0`}
                  >
                    <div className={`text-base font-medium mb-2 text-white`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 3).map((post) => (
                        <div
                          key={post._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, post)}
                          onClick={() => onSelectPost(post)}
                          className={`p-1 rounded text-xs cursor-move hover:opacity-80 transition-opacity ${getThemeColor(
                            post.theme
                          )} text-white`}
                          title="Drag to move to another date"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate flex-1">
                              {post.theme}
                            </span>
                            {getStatusIcon(post.status)}
                          </div>
                          <div className="text-xs opacity-75">
                            {post.scheduledTime}
                          </div>
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="text-xs text-gray-400 text-center">
                          +{dayPosts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Posts List */}
      <div
        className="rounded-xl mt-8"
        style={{
          background: "rgba(70,70,70,0.11)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">All Posts</h3>
          <p className="text-sm text-white/70">
            Manage all your scheduled content
          </p>
        </div>
        <div className="divide-y divide-white/10">
          {posts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-white/70 mb-2">No posts scheduled</div>
              <div className="text-sm text-white/40">
                Generate content to get started
              </div>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div key={post._id || `${post.scheduledDate}-${idx}` } className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${getThemeColor(
                          post.theme
                        )}`}
                      ></span>
                      <span className="text-white font-medium">
                        {post.theme}
                      </span>
                      {getStatusIcon(post.status)}
                      <span className="text-xs text-white/70 capitalize">
                        {post.status}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-white/60">
                      <span>
                        {new Date(post.scheduledDate).toLocaleDateString()}
                      </span>
                      <span>{post.scheduledTime}</span>
                      <span>{post.generatedBy} Generated</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <select
                      value={post.status}
                      onChange={(e) =>
                        handleStatusChange(post._id, e.target.value as any)
                      }
                      className="bg-transparent text-white text-xs rounded px-2 py-1 border border-white/20 focus:border-white/50 focus:ring-1 focus:ring-white/30"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                    <button
                      onClick={() => onSelectPost(post)}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletePost(post._id)}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
