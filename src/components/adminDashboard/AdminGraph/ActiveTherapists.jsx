import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function ActiveTherapistGraph({ title = "Active Therapists" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/admin/graph/therapist`);
      const result = await response.json();
      if (result.success && result.data) {
        const formattedData = result.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          therapists: item.therapistCount,
        }));
        setData(formattedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[250px] bg-[#0d0d0d] rounded-lg border border-primary/20">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] rounded-xl p-4 border border-primary/20 shadow-md h-[300px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="text-primary w-4 h-4" />
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="date" stroke="#aaa" style={{ fontSize: "10px" }} />
            <YAxis stroke="#aaa" style={{ fontSize: "10px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="therapists"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ r: 3, fill: "#fff" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
