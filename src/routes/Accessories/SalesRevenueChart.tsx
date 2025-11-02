import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface SalesRevenueChartProps {
  revenue: number;
  percentageChange: number;
  selectedPeriod: "24 hours" | "7 days" | "30 days";
  onPeriodChange: (period: "24 hours" | "7 days" | "30 days") => void;
}

const SalesRevenueChart: React.FC<SalesRevenueChartProps> = ({
  revenue,
  percentageChange,
  selectedPeriod,
  onPeriodChange,
}) => {
  // Mock chart data for 12 months
  const chartData = [
    { month: "Jan", value: 120, date: "Jan 24, 2025" },
    { month: "Feb", value: 180, date: "Feb 24, 2025" },
    { month: "Mar", value: 150, date: "Mar 24, 2025" },
    { month: "Apr", value: 200, date: "Apr 24, 2025" },
    { month: "May", value: 220, date: "May 24, 2025" },
    { month: "Jun", value: 250, date: "Jun 24, 2025" },
    { month: "Jul", value: 280, date: "Jul 24, 2025" },
    { month: "Aug", value: 300, date: "Aug 24, 2025" },
    { month: "Sep", value: 320, date: "Sep 24, 2025" },
    { month: "Oct", value: 290, date: "Oct 24, 2025" },
    { month: "Nov", value: 310, date: "Nov 24, 2025" },
    { month: "Dec", value: 330, date: "Dec 24, 2025" },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black px-3 py-2 rounded-lg shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]">
          <div className="flex flex-col gap-[2px] font-['Poppins',sans-serif] font-medium leading-4 text-xs tracking-[0.06px]">
            <p className="text-white">{data.value} Ticket Sales</p>
            <p className="text-[#f4f4f4]">{data.date}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom active dot component
  const CustomActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <g>
        {/* Vertical dashed line */}
        <line
          x1={cx}
          y1={0}
          x2={cx}
          y2={213}
          stroke="#7417c6"
          strokeDasharray="4 4"
          strokeOpacity={0.5}
        />
        {/* Dot */}
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="white"
          stroke="#7417c6"
          strokeWidth={2}
        />
      </g>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col border overflow-hidden border-[#eaeaea] rounded-[10px] items-start relative w-full">
        {/* Heading */}
        <div className="content-stretch flex gap-4 items-center pb-4 pt-4 px-5 relative w-full bg-[#ffffff]">
          <p className="flex-[1_0_0] font-['Poppins',sans-serif] font-medium leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-[#2d2d2d] whitespace-pre-wrap">
            Sales
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white border-b-0 border-l-0 border-r-0 border-t-2 border-[#eaeaea] border-solid flex flex-col gap-5 items-start p-5 relative rounded-xl shrink-0 w-full">
          {/* Number and tabs */}
          <div className="flex gap-4 items-start relative shrink-0 w-full">
            {/* Number and badge */}
            <div className="flex flex-1 flex-col gap-3 items-start justify-center relative shrink-0">
              <p className="font-['Poppins',sans-serif] font-normal leading-[40px] text-[30px] text-[#2d2d2d]">
                {formatCurrency(revenue)}
              </p>
              {/* Change and text */}
              <div className="flex gap-2 items-center relative shrink-0">
                <div className="flex gap-[2px] items-center justify-center relative shrink-0">
                  <div className="relative shrink-0 size-4 overflow-hidden">
                    <TrendingUp className="size-4 text-[#17b26a]" />
                  </div>
                  <p className="font-['Poppins',sans-serif] font-medium leading-[20px] text-[14px] text-[#17b26a] text-center">
                    {percentageChange > 0 ? "+" : ""}
                    {percentageChange}%
                  </p>
                </div>
                <p className="font-['Poppins',sans-serif] font-medium leading-[20px] text-[14px] text-[#535862]">
                  vs last 30 days
                </p>
              </div>
            </div>

            {/* Period tabs */}
            <div className="bg-[#f4f4f4] cursor-pointer flex gap-1 items-center p-1 relative rounded-[10px] shrink-0">
              <button
                onClick={() => onPeriodChange("24 hours")}
                className={`border border-solid flex gap-2 h-8 items-center justify-center px-3 py-3 relative rounded-lg shrink-0 w-[82px] transition-colors ${
                  selectedPeriod === "24 hours"
                    ? "bg-white border-[#d5b9ee]"
                    : "border-[#dfdfdf] hover:bg-white/50"
                }`}
              >
                <p
                  className={`font-['Poppins',sans-serif] font-medium leading-4 text-xs text-center tracking-[0.06px] ${
                    selectedPeriod === "24 hours"
                      ? "text-[#7417c6]"
                      : "text-[#777777]"
                  }`}
                >
                  24 hours
                </p>
              </button>
              <button
                onClick={() => onPeriodChange("7 days")}
                className={`border border-solid flex gap-2 h-8 items-center justify-center px-3 py-3 relative rounded-lg shrink-0 transition-colors ${
                  selectedPeriod === "7 days"
                    ? "bg-white border-[#d5b9ee]"
                    : "border-[#dfdfdf] hover:bg-white/50"
                }`}
              >
                <p
                  className={`font-['Poppins',sans-serif] font-medium leading-4 text-xs text-center tracking-[0.06px] ${
                    selectedPeriod === "7 days"
                      ? "text-[#7417c6]"
                      : "text-[#777777]"
                  }`}
                >
                  7 days
                </p>
              </button>
              <button
                onClick={() => onPeriodChange("30 days")}
                className={`border border-solid flex gap-2 h-8 items-center justify-center px-3 py-3 relative rounded-lg shrink-0 transition-colors ${
                  selectedPeriod === "30 days"
                    ? "bg-white border-[#d5b9ee]"
                    : "border-[#dfdfdf] hover:bg-white/50"
                }`}
              >
                <p
                  className={`font-['Poppins',sans-serif] font-medium leading-4 text-xs text-center tracking-[0.06px] ${
                    selectedPeriod === "30 days"
                      ? "text-[#7417c6]"
                      : "text-[#777777]"
                  }`}
                >
                  30 days
                </p>
              </button>
            </div>
          </div>

          {/* Chart wrapper */}
          <div className="flex flex-col items-start relative shrink-0 w-full">
            <div className="h-[240px] relative shrink-0 w-full">
              <ResponsiveContainer width="100%" height={213}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7417c6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7417c6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="2 2"
                    vertical={false}
                    horizontal={true}
                    stroke="#eaeaea"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#535862",
                      fontSize: 12,
                      fontFamily: "Poppins",
                      fontWeight: 400,
                    }}
                    interval={0}
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis hide={true} domain={["auto", "auto"]} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    allowEscapeViewBox={{ x: true, y: true }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7417c6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={<CustomActiveDot />}
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* Bottom border line */}
              <div className="h-[22px] relative shrink-0 w-full border-t border-[#eaeaea] mt-[5px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRevenueChart;
