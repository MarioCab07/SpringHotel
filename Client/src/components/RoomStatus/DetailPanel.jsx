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
  if (!item) return null;

  const isCleaned = item.status === "COMPLETED";
  const isInProgress = item.status === "IN_PROGRESS";

  const canShowButtons = role === "CLEANING_STAFF" || role === "ADMIN";

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 p-6 overflow-y-auto rounded-2xl ml-6 shadow-lg">
      <h2 className="text-xl font-serif text-gray-800 text-center mb-4">
        {item.room}
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
      </p>

      <p className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full mb-6">
        Special request: {item.description || "—"}
      </p>

      {canShowButtons && (
        <div className="flex flex-col space-y-5">
          <button onClick={() => onMarkClean(item)} disabled={markLoading || isCleaned} className={`w-full font-medium py-2 rounded-full text-white transition ${isCleaned ? "bg-gray-300 cursor-not-allowed opacity-60" : markLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#f2789f] hover:bg-[#e76b91]"}`}>
            {isCleaned ? "Already Cleaned" : markLoading ? "Marcando…" : "Mark as clean"}
          </button>

          <button onClick={() => onMarkInProgress(item)} disabled={inProgressLoading || isInProgress || isCleaned} className={`w-full font-medium py-2 rounded-full text-white transition ${isInProgress || isCleaned ? "bg-gray-300 cursor-not-allowed opacity-60" : inProgressLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
            {isInProgress ? "Already In Progress" : isCleaned ? "Cannot Revert" : inProgressLoading ? "Revirtiendo…" : "Mark as In Progress"}
          </button>

          <button onClick={() => onViewMore(item)} className="w-full bg-[#f2789f] hover:bg-[#e76b91] text-white font-medium py-2 rounded-full">
            View more
          </button>

          {isAdmin && (
            <button onClick={() => onDelete(item)} className="w-full bg-[#f2789f] hover:bg-[#e76b91] text-white font-medium py-2 rounded-full">
              Delete
            </button>
          )}
      </div>
      )}
    </aside>
  );
};

export default DetailPanel;