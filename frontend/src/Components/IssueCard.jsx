import { Link } from "react-router-dom";

const statusStyle = {
  Pending: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Resolved: "bg-green-100 text-green-700",
};

const IssueCard = ({ complaint, onUpvote, actionTo, actionLabel = "View" }) => {
  const locationText =
    complaint.locationText || complaint.location || "Unknown location";

  return (
    <div className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h3 className="text-xl font-semibold">{complaint.title}</h3>
        <p className="text-gray-600 mt-2">{complaint.description}</p>
        <p className="text-sm text-gray-500 mt-1">📍 {locationText}</p>
        <p className="text-sm text-gray-500 mt-1">
          Category: {complaint.category || "General"}
        </p>

        <span
          className={`inline-block mt-4 px-4 py-1 rounded-full text-sm ${
            statusStyle[complaint.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {complaint.status}
        </span>

        {/* 🔥 UPVOTE BUTTON */}
        <div className="mt-4">
          <button
            onClick={() => onUpvote(complaint._id)}
            className="bg-blue-500 text-white px-4 py-1 rounded-full hover:opacity-90"
          >
            👍 {complaint.upvotes || 0}
          </button>
        </div>
      </div>

      {actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#2EC4B6] text-[#0A2540] font-medium hover:opacity-90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default IssueCard;
