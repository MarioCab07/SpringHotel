const DetailPanel = ({
  item,
  onMarkClean,
  onMarkInProgress,
  onReportIssue,
  onViewMore,
  onDelete,
  markLoading,
  inProgressLoading,
  isAdmin,
  role
}) => {

  if (!item) {
    return (
      <div className="w-80 h-full flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-full flex items-center justify-center text-gray-500">
          <p className="text-sm">
            Select a task to view details
          </p>
        </div>
      </div>
    );
  }

  const isCleaned = item.status === "COMPLETED";
  const isInProgress = item.status === "IN_PROGRESS";
  const isCanceled = item.status === "CANCELED";
  const canShowButtons =
    role === "CLEANING_STAFF" ||
    role === "ADMIN" ||
    role === "EMPLOYEE";

  return (
    <div className="w-80 h-full flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {item.room}
        </h2>

        <p className="text-sm text-gray-600 text-center capitalize mb-4">
          {item.status.replace("_", " ").toLowerCase()}
        </p>

        {/* CANCELED MESSAGE */}
        {isCanceled && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-center">
            <p className="text-sm font-medium">This service was canceled</p>
          </div>
        )}

        {item.description && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Special request:</p>
            <p className="text-sm text-gray-900">{item.description}</p>
          </div>
        )}
      </div>

      {canShowButtons && (
        <div className="flex flex-col gap-3 mt-auto">

          {/* ------- MARK CLEAN BUTTON ------- */}
          <button
            onClick={() => onMarkClean(item)}
            disabled={markLoading || isCleaned || isCanceled}
            className={`w-full px-5 py-2 rounded-lg text-sm font-semibold transition-all
              ${
                isCleaned || isCanceled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : markLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#D9C696] hover:bg-[#c5b386] text-gray-900 shadow"
              }`}
          >
            {isCanceled
              ? "Canceled"
              : isCleaned
              ? "Already Cleaned"
              : markLoading
              ? "Marking…"
              : "Mark as clean"}
          </button>

          {/* ------- MARK IN PROGRESS BUTTON ------- */}
          <button
            onClick={() => onMarkInProgress(item)}
            disabled={inProgressLoading || isInProgress || isCleaned || isCanceled}
            className={`w-full px-5 py-2 rounded-lg text-sm font-semibold transition-all
              ${
                isInProgress || isCleaned || isCanceled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : inProgressLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800 text-white shadow"
              }`}
          >
            {isCanceled
              ? "Cannot modify"
              : isInProgress
              ? "Already In Progress"
              : isCleaned
              ? "Cannot revert"
              : inProgressLoading
              ? "Marking…"
              : "Mark as In Progress"}
          </button>

          {/* VIEW MORE */}
          <button
            onClick={() => onViewMore(item)}
            className="w-full px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold shadow"
          >
            View more
          </button>

          {isAdmin && (
            <button
              onClick={() => onDelete(item)}
              className="w-full px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailPanel;
