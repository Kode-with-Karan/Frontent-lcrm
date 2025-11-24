import React, { useState } from "react";
import { X, Save, Calendar, Clock, Hash, Type, Sparkles } from "lucide-react";
import { Post } from "../services/api";

interface PostEditorProps {
  post: Post;
  onSave: (postId: string, updates: Partial<Post>) => void;
  onClose: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    theme: post.theme,
    scheduledDate: post.scheduledDate,
    scheduledTime: post.scheduledTime,
    hashtags: post.hashtags.join(", "),
    status: post.status,
    notes: post.notes || "",
  });

  const themes = [
    "Educational",
    "Personal Story",
    "Insight",
    "Question",
    "CTA",
    "Tips",
    "Industry News",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: Partial<Post> = {
      title: formData.title,
      content: formData.content,
      theme: formData.theme,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      hashtags: formData.hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      status: formData.status,
      notes: formData.notes,
    };

    onSave(post._id, updates);
  };

  const getCharacterCount = () => {
    return formData.content.length;
  };

  const getCharacterCountColor = () => {
    const count = getCharacterCount();
    if (count > 1300) return "text-red-400";
    if (count > 1100) return "text-yellow-400";
    return "text-gray-400";
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${getThemeColor(
                formData.theme
              )}`}
            ></div>
            <h2 className="text-xl font-semibold text-white">Edit Post</h2>
            <span className="text-sm text-gray-400">({formData.theme})</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter post title"
                  />
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Type className="w-4 h-4" />
                    <span>Content Theme</span>
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) =>
                      setFormData({ ...formData, theme: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Time</span>
                    </label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledTime: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Hashtags</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hashtags}
                    onChange={(e) =>
                      setFormData({ ...formData, hashtags: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Separate hashtags with commas"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Separate hashtags with commas (e.g., #business, #growth,
                    #tips)
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Add any notes or reminders for this post"
                  />
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Post Content
                    </label>
                    <span className={`text-xs ${getCharacterCountColor()}`}>
                      {getCharacterCount()}/1300 characters
                    </span>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={16}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                    placeholder="Write your LinkedIn post content here..."
                  />
                  {getCharacterCount() > 1300 && (
                    <p className="text-xs text-red-400 mt-1">
                      Content exceeds LinkedIn's recommended character limit
                    </p>
                  )}
                </div>

                {/* Preview */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </h4>
                  <div className="bg-white rounded-lg p-4 text-gray-900 text-sm">
                    <div className="whitespace-pre-wrap break-words">
                      {formData.content || "Your content will appear here..."}
                    </div>
                    {formData.hashtags && (
                      <div className="mt-3 text-blue-600">
                        {formData.hashtags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag)
                          .map((tag, index) => (
                            <span key={index} className="mr-2">
                              {tag.startsWith("#") ? tag : `#${tag}`}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>Generated by {post.generatedBy}</span>
                <span>•</span>
                <span>
                  Created {new Date(post.scheduledDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
