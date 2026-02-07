import IssueCard from "../Components/IssueCard";
import { getMyComplaints } from "../utils/complaints";

const MyComplaints = () => {
  const complaints = getMyComplaints();

  return (
    <div className="min-h-screen px-10 py-20 bg-gray-50">
      <h2 className="text-4xl font-semibold text-[#0A2540] mb-12">
        My Complaints
      </h2>

      <div className="grid gap-6">
        {complaints.length === 0 && (
          <p className="text-gray-500">No complaints yet.</p>
        )}

        {complaints.map((c) => (
          <IssueCard
            key={c.id}
            complaint={c}
            actionTo={`/complaints/${c.id}`}
            actionLabel="View Details"
          />
        ))}
      </div>
    </div>
  );
};

export default MyComplaints;
