import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share,
} from "lucide-react";
import { Post } from "../services/api";

interface AnalyticsProps {
  posts: Post[];
}

const Analytics: React.FC<AnalyticsProps> = ({ posts }) => {
  // Backend-driven analytics state
  const [backendThemeStats, setBackendThemeStats] = useState<
    null | { theme: string; count: number }[]
  >(null);
  const [backendUpcomingPosts, setBackendUpcomingPosts] = useState<
    null | Post[]
  >(null);

  useEffect(() => {
    // Try to fetch analytics from backend
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/calendar/analytics");
        if (res.ok) {
          const data = await res.json();
          setBackendThemeStats(data.themeStats || null);
          setBackendUpcomingPosts(data.upcomingPosts || null);
        }
      } catch {
        setBackendThemeStats(null);
        setBackendUpcomingPosts(null);
      }
    };
    fetchAnalytics();
  }, []);

  const getPostStats = () => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const scheduled = posts.filter((p) => p.status === "scheduled").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    const aiGenerated = posts.filter((p) => p.generatedBy === "AI").length;
    return { total, published, scheduled, drafts, aiGenerated };
  };

  const getThemeStats = () => {
    if (backendThemeStats) return backendThemeStats;
    const themeCount = posts.reduce((acc, post) => {
      acc[post.theme] = (acc[post.theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(themeCount)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getEngagementStats = () => {
    const publishedPosts = posts.filter(
      (p) => p.status === "published" && p.engagement
    );
    if (publishedPosts.length === 0) {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        avgEngagementRate: 0,
      };
    }
    const totalViews = publishedPosts.reduce(
      (sum, post) => sum + (post.engagement?.views || 0),
      0
    );
    const totalLikes = publishedPosts.reduce(
      (sum, post) => sum + (post.engagement?.likes || 0),
      0
    );
    const totalComments = publishedPosts.reduce(
      (sum, post) => sum + (post.engagement?.comments || 0),
      0
    );
    const totalShares = publishedPosts.reduce(
      (sum, post) => sum + (post.engagement?.shares || 0),
      0
    );
    const totalEngagements = totalLikes + totalComments + totalShares;
    const avgEngagementRate =
      totalViews > 0 ? (totalEngagements / totalViews) * 100 : 0;
    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagementRate,
    };
  };

  const getUpcomingPosts = () => {
    if (backendUpcomingPosts) return backendUpcomingPosts;
    const today = new Date();
    return posts
      .filter((post) => {
        const postDate = new Date(post.scheduledDate);
        return postDate >= today && post.status !== "published";
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime()
      )
      .slice(0, 5);
  };

  const getThemeColor = (theme: string) => {
    const colors = {
      Educational: "bg-blue-500",
      "Personal Story": "bg-purple-500",
      Insight: "bg-green-500",
      Question: "bg-yellow-500",
      CTA: "bg-red-500",
      Tips: "bg-indigo-500",
      "Industry News": "bg-pink-500",
    };
    return colors[theme as keyof typeof colors] || "bg-gray-500";
  };

  const stats = getPostStats();
  const themeStats = getThemeStats();
  const engagementStats = getEngagementStats();
  const upcomingPosts = getUpcomingPosts();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Content Analytics</h2>
        </div>
        <p className="text-gray-400">
          Track your content performance and posting patterns
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Posts */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-300">Total Posts</p>
              <p className="text-2xl font-bold text-blue-200">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        {/* Published */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300">Published</p>
              <p className="text-2xl font-bold text-green-200">
                {stats.published}
              </p>
            </div>
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        {/* Scheduled */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-300">Scheduled</p>
              <p className="text-2xl font-bold text-cyan-200">
                {stats.scheduled}
              </p>
            </div>
            <div className="p-2 bg-cyan-600 rounded-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        {/* Drafts */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-300">Drafts</p>
              <p className="text-2xl font-bold text-yellow-200">
                {stats.drafts}
              </p>
            </div>
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        {/* AI Generated */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-300">AI Generated</p>
              <p className="text-2xl font-bold text-purple-200">
                {stats.aiGenerated}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Stats */}
      {stats.published > 0 && (
        <div className="rounded-lg p-6"
          style={{background: "rgba(70,70,70,0.11)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <h3 className="text-lg font-semibold text-white mb-4">
            Engagement Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-2">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                {engagementStats.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Total Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg mx-auto mb-2">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                {engagementStats.totalLikes.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Total Likes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mx-auto mb-2">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                {engagementStats.totalComments.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Total Comments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-2">
                <Share className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                {engagementStats.totalShares.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Total Shares</p>
            </div>
          </div>
          {engagementStats.avgEngagementRate > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">Average Engagement Rate</p>
              <p className="text-xl font-bold text-green-400">
                {engagementStats.avgEngagementRate.toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Themes */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Content by Theme
          </h3>
          {themeStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No content themes to display</p>
            </div>
          ) : (
            <div className="space-y-3">
              {themeStats.map(({ theme, count }) => {
                const percentage = (count / stats.total) * 100;
                return (
                  <div key={theme} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getThemeColor(
                            theme
                          )}`}
                        ></div>
                        <span className="text-sm text-gray-300">{theme}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {count} posts
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getThemeColor(theme)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Upcoming Posts */}
        <div
          className="rounded-[5px] p-6"
          style={{
            background: "rgba(70,70,70,0.11)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Upcoming Posts
          </h3>
          {upcomingPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No upcoming posts scheduled</p>
              <p className="text-sm text-gray-500 mt-1">
                Generate content to fill your calendar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center space-x-3 p-3 rounded-[5px]"
                  style={{
                    background: "rgba(70,70,70,0.11)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${getThemeColor(
                      post.theme
                    )}`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {post.theme}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.scheduledDate).toLocaleDateString()} at{" "}
                      {post.scheduledTime}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.status === "scheduled"
                        ? "bg-blue-600 text-blue-100"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              ))}
              {posts.filter((p) => {
                const postDate = new Date(p.scheduledDate);
                return postDate >= new Date() && p.status !== "published";
              }).length > 5 && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  +
                  {posts.filter((p) => {
                    const postDate = new Date(p.scheduledDate);
                    return postDate >= new Date() && p.status !== "published";
                  }).length - 5}{" "}
                  more posts scheduled
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">
          📊 Analytics Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-300">
          <div>
            <p>
              <strong>Consistency is key:</strong> Maintain regular posting to
              build audience engagement.
            </p>
          </div>
          <div>
            <p>
              <strong>Theme variety:</strong> Mix different content themes to
              keep your audience engaged.
            </p>
          </div>
          <div>
            <p>
              <strong>Timing matters:</strong> Monitor when your audience is
              most active for better reach.
            </p>
          </div>
          <div>
            <p>
              <strong>Track performance:</strong> Analyze which themes get the
              most engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
