import IssueCard from "../Components/IssueCard";
import { getMyComplaints } from "../utils/complaints";

const MyComplaints = () => {
  const complaints = getMyComplaints();

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-20 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-4xl font-semibold text-[#0A2540]">
              My Complaints
            </h2>
            <span className="bg-[#2EC4B6]/20 text-[#0A2540] px-4 py-1 rounded-full text-sm font-medium">
              {total} Total
            </span>
          </div>

          <p className="text-gray-600 text-lg">
            Track the issues you’ve reported and monitor their progress.
          </p>
        </div>

        {/* STATS ROW */}
        {total > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Total Complaints</p>
              <p className="text-3xl font-semibold text-[#0A2540] mt-2">{total}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-3xl font-semibold text-red-500 mt-2">{pending}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-3xl font-semibold text-yellow-500 mt-2">{inProgress}</p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {total === 0 ? (
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-2xl font-semibold text-[#0A2540] mb-3">
              No complaints yet
            </h3>
            <p className="text-gray-500">
              You haven’t reported any civic issues so far.
            </p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="transition duration-200 hover:-translate-y-1"
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
