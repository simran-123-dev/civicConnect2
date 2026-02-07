import { Link, useParams } from "react-router-dom";
import { getComplaintById } from "../utils/complaints";

const statusStyle = {
	Pending: "bg-red-100 text-red-700",
	"In Progress": "bg-yellow-100 text-yellow-800",
	Resolved: "bg-green-100 text-green-700",
};

const ComplaintDetail = () => {
	const { id } = useParams();
	const complaint = getComplaintById(id);

	if (!complaint) {
		return (
			<div className="min-h-screen bg-[#F8F9FA] px-6 py-20">
				<div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
					<h1 className="text-2xl font-semibold text-[#0A2540]">
						Complaint not found
					</h1>
					<Link
						to="/my-complaints"
						className="inline-block mt-6 text-[#2EC4B6] font-medium"
					>
						Back to My Complaints
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F9FA] px-6 py-20">
			<div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
				<h1 className="text-3xl font-semibold text-[#0A2540] mb-6">
					Complaint #{complaint.id}
				</h1>

				<p className="text-gray-600 mb-4">
					Issue: <strong>{complaint.title}</strong>
				</p>
				<p className="text-gray-600 mb-4">
					Location: {complaint.locationText || complaint.location || "-"}
				</p>
				<p className="text-gray-600 mb-4">
					Category: {complaint.category || "General"}
				</p>
				<p className="text-gray-600 mb-4">Date: {complaint.date || "-"}</p>
				<p className="text-gray-600 mb-6">
					Description: {complaint.description}
				</p>

				<span
					className={`inline-block px-4 py-1 rounded-full text-sm ${
						statusStyle[complaint.status] || "bg-gray-100 text-gray-700"
					}`}
				>
					{complaint.status}
				</span>

				{complaint.remarks && (
					<div className="mt-6">
						<h2 className="text-lg font-semibold text-[#0A2540] mb-2">
							Admin Remarks
						</h2>
						<p className="text-gray-600">{complaint.remarks}</p>
					</div>
				)}

				{complaint.mediaName && (
					<div className="mt-6">
						<h2 className="text-lg font-semibold text-[#0A2540] mb-2">
							Uploaded Media
						</h2>
						<p className="text-gray-600">{complaint.mediaName}</p>
					</div>
				)}

				{complaint.proofName && (
					<div className="mt-6">
						<h2 className="text-lg font-semibold text-[#0A2540] mb-2">
							Proof
						</h2>
						<p className="text-gray-600">{complaint.proofName}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ComplaintDetail;
