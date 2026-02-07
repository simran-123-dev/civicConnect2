import React, { useEffect, useState } from "react";

// Lightweight analytics dashboard that does not require external chart libs.
// Shows a simple time-series (counts per day) in a small inline SVG and a table.

const buildDateISO = (d) => d.toISOString().slice(0, 10);

const AnalyticsDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      setError("");
      try {
        const to = new Date();
        const from = new Date(Date.now() - 29 * 24 * 3600 * 1000); // last 30 days
        const res = await fetch(`/api/analytics/trends?groupBy=day&from=${buildDateISO(from)}&to=${buildDateISO(to)}`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        // json is [{ _id: "YYYY-MM-DD", count: N }, ...]
        // normalize to full range of dates (fill zeros)
        const map = {};
        json.forEach((r) => { map[r._id] = r.count; });
        const series = [];
        for (let i = 0; i < 30; i++) {
          const dt = new Date(from.getTime() + i * 24 * 3600 * 1000);
          const key = buildDateISO(dt);
          series.push({ date: key, count: map[key] || 0 });
        }
        setData(series);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const max = data.reduce((m, p) => Math.max(m, p.count), 0) || 1;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        {loading ? (
          <div className="p-6 bg-white rounded shadow">Loading analytics...</div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded shadow text-red-700">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Complaints — last 30 days</h2>

              {/* inline svg sparkline */}
              <div className="w-full h-40">
                <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="w-full h-full">
                  {/* grid */}
                  {[0,1,2,3,4].map(i => (
                    <line key={i} x1={0} y1={(i*40)+20} x2={600} y2={(i*40)+20} stroke="#eee" strokeWidth="1" />
                  ))}

                  {/* path */}
                  {data.length > 0 && (() => {
                    const w = 600 / (data.length - 1 || 1);
                    const points = data.map((p, i) => {
                      const x = i * w;
                      const y = 140 - Math.round((p.count / max) * 120);
                      return `${x},${y}`;
                    }).join(' ');
                    return (
                      <polyline fill="none" stroke="#2EC4B6" strokeWidth="3" points={points} />
                    );
                  })()}
                </svg>
              </div>

              {/* summary */}
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Total complaints (30d): </span>
                {data.reduce((s, p) => s + p.count, 0)}
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-3">Daily counts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d) => (
                      <tr key={d.date} className="border-b">
                        <td className="p-2">{d.date}</td>
                        <td className="p-2 font-mono">{d.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
