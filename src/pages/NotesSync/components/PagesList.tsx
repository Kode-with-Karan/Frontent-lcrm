import { Loader2, FileText, Calendar, ExternalLink, Eye } from "lucide-react";
import type { Page } from "../services/api";

interface PagesListProps {
  pages: Page[];
  selectedPage: Page | null;
  onPageSelect: (page: Page) => void;
  isLoading: boolean;
  disabled?: boolean;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  allowSkip?: boolean;
  onSkip?: () => void;
}

const PagesList = ({
  pages,
  selectedPage,
  onPageSelect,
  isLoading,
  disabled = false,
  title = "Pages",
  subtitle,
  emptyMessage = "No pages found. Please check your Notion workspace.",
  allowSkip = false,
  onSkip,
}: PagesListProps) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  const formatTitle = (title: string) => {
    if (!title || title.trim() === "") return "Untitled Page";
    return title;
  };

  const getContentPreview = (page: Page) => {
    if (page.content_preview) return page.content_preview;
    if (page.properties) {
      // Try to extract content from properties
      const textProperties = Object.values(page.properties).filter(
        (prop: any) => prop.type === "rich_text" && prop.rich_text?.length > 0
      );
      if (textProperties.length > 0) {
        return (textProperties[0] as any).rich_text[0]?.plain_text || "";
      }
    }
    return "No preview available";
  };
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>
            {title} ({pages.length})
          </span>
        </h3>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {pages.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No pages found</p>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
          {allowSkip && onSkip && (
            <button
              onClick={onSkip}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              Skip and Continue
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => !disabled && onPageSelect(page)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-purple-500 ${
                selectedPage?.id === page.id
                  ? "border-purple-500 bg-purple-900/20"
                  : "border-gray-600 bg-gray-700 hover:bg-gray-600"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <h4 className="text-white font-medium text-sm">
                      {formatTitle(page.title)}
                    </h4>
                  </div>

                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {getContentPreview(page)}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(page.last_edited_time).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Page</span>
                    </div>
                  </div>
                </div>

                {page.url && (
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {selectedPage?.id === page.id && (
                <div className="mt-3 pt-3 border-t border-purple-500/30">
                  <div className="flex items-center space-x-2 text-purple-400 text-xs">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Selected - Ready to generate content</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}{" "}
      {pages.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-xs">
            {disabled
              ? "Complete previous steps to select a page"
              : "Select a page to preview its content and generate LinkedIn posts"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PagesList;
