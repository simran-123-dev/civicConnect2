import IssueCard from "../Components/IssueCard";
import { getMyComplaints } from "../utils/complaints";

const MyComplaints = () => {
  const complaints = getMyComplaints();

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#0A2540] mb-2">
            My Complaints
          </h2>
          <p className="text-gray-500">
            Track the issues you’ve reported and check their progress.
          </p>
        </div>

        {/* GRID */}
        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-[#0A2540] mb-2">
              No complaints yet
            </h3>
            <p className="text-gray-500">
              You haven’t reported any civic issues so far.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="h-full transition-all duration-200 hover:-translate-y-1"
              >
                <IssueCard
                  complaint={c}
                  actionTo={`/complaints/${c.id}`}
                  actionLabel="View Details"
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyComplaints;
