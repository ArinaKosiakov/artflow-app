import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Youtube,
  Video,
  Check,
  Trash2,
  Pencil,
  FolderOpen,
  X,
  Search,
} from "lucide-react";
import { ContentIdea } from "../hooks/useAppHandlers";
import CustomSpinner from "../components/CustomSpinner";

interface Content {
  id: string;
  title: string;
  platform?: string;
  deadline: string;
  done: boolean;
  details: string;
  order: number;
}
type Platform =
  | "all"
  | "youtube"
  | "tiktok"
  | "instagram"
  | "twitter"
  | "facebook";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "all", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
];

interface ContentViewProps {
  contentIdeas: Content[];
  darkMode: boolean;
  isSavingContent?: boolean;
  contentLoading?: boolean;
  onToggleContent: (id: string) => void;
  onDeleteContent: (id: string) => void;
  onEditContent: (content: Content) => void;
  onSaveContent: (content: Omit<ContentIdea, "id">, id?: string) => void;
}

export default function ContentView({
  contentIdeas,
  darkMode,
  onToggleContent,
  onDeleteContent,
  onEditContent,
  onSaveContent,
  isSavingContent,
  contentLoading,
}: ContentViewProps) {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null);

  const filteredContentIdeas = useMemo(() => {
    return contentIdeas.filter((content) => {
      const matchesName = content.title
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      const deadline = content.deadline ? new Date(content.deadline) : null;
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      const matchesFrom = !from || (deadline && deadline >= from);
      const matchesTo = !to || (deadline && deadline <= to);

      const matchesPlatform =
        !platformFilter || content.platform === platformFilter;

      return matchesName && matchesFrom && matchesTo && matchesPlatform;
    });
  }, [contentIdeas, nameFilter, dateFrom, dateTo, platformFilter]);

  const hasActiveFilters = nameFilter || dateFrom || dateTo || platformFilter;

  const clearFilters = () => {
    setNameFilter("");
    setDateFrom("");
    setDateTo("");
    setPlatformFilter(null);
  };
  const inputBase = `w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400"
  }`;
  return (
    <div className="max-w-4xl">
      {contentLoading ||
        (isSavingContent && <CustomSpinner darkMode={darkMode} />)}
      {/* Filter Bar */}
      <div
        className={`mb-6 p-4 rounded-xl border ${
          darkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Name filter */}
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder={t("common.filterByName") ?? "Filter by name…"}
              className={`${inputBase} pl-9`}
            />
          </div>

          {/* Date from */}
          <div className="relative sm:w-44">
            <Calendar
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`${inputBase} pl-9`}
              title={t("common.deadlineFrom") ?? "Deadline from"}
            />
          </div>

          {/* Date to */}
          <div className="relative sm:w-44">
            <Calendar
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`${inputBase} pl-9`}
              title={t("common.deadlineTo") ?? "Deadline to"}
            />
          </div>
          {/* Platform filter */}
          <div className="sm:w-44">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as Platform)}
              className={`${inputBase} cursor-pointer`}
            >
              {PLATFORMS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-600"
              }`}
            >
              <X className="w-4 h-4" />
              {t("common.clear") ?? "Clear"}
            </button>
          )}
        </div>

        {/* Results count */}
        {hasActiveFilters && (
          <p
            className={`mt-2 text-xs ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {filteredContentIdeas.length} of {contentIdeas.length}{" "}
            {t("common.results") ?? "projects"}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {contentIdeas.length === 0 && (
          <div className="col-span-2 text-center py-20">
            <FolderOpen
              className={`w-16 h-16 ${darkMode ? "text-gray-600" : "text-gray-300"} mx-auto mb-4`}
            />
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              {t("content.noContent")}
            </p>
          </div>
        )}
        {filteredContentIdeas.map((content) => (
          <div
            key={content.id}
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-6 hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => onToggleContent(content.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    content.done
                      ? "bg-purple-500 border-purple-500"
                      : `${darkMode ? "border-gray-600 hover:border-purple-400" : "border-gray-300 hover:border-purple-400"}`
                  }`}
                >
                  {content.done && <Check className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${content.done ? `line-through ${darkMode ? "text-gray-500" : "text-gray-400"}` : `${darkMode ? "text-white" : "text-gray-800"}`}`}
                  >
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div
                      className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {content.platform === "youtube" ? (
                        <Youtube className="w-4 h-4" />
                      ) : (
                        <Video className="w-4 h-4" />
                      )}
                      <span className="capitalize">{content.platform}</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(content.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditContent(content)}
                    className={`${darkMode ? "text-gray-500 hover:text-purple-400" : "text-gray-400 hover:text-purple-500"} transition-colors`}
                    title={t("common.edit")}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteContent(content.id)}
                    className={`${darkMode ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"} transition-colors`}
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
