import React, { useState } from 'react';
import { DaySlopePoint } from '../../utils/analyticsUtils';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface WeeklyChartProps {
  days: DaySlopePoint[];
  weeklyAverage: number;
  onSelectDate: (dateStr: string) => void;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  days,
  weeklyAverage,
  onSelectDate,
}) => {
  // Mode: 'percent' (0-100% normalized) or 'raw' (raw weight points)
  const [viewMode, setViewMode] = useState<'percent' | 'raw'>('percent');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Geometry Dimensions
  const svgWidth = 440;
  const svgHeight = 170;
  const paddingLeft = 38;
  const paddingRight = 20;
  const paddingTop = 22;
  const paddingBottom = 28;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Max Y value depending on mode
  const maxRawWeight = Math.max(
    10,
    ...days.map((d) => d.rawTotalWeight || d.rawCompletedWeight || 0)
  );
  const maxY = viewMode === 'percent' ? 100 : Math.ceil(maxRawWeight / 5) * 5 || 25;

  // Calculate coordinates (X, Y) for each of the 7 days
  const points = days.map((day, index) => {
    const x = paddingLeft + (index / (days.length - 1)) * chartWidth;
    const value = viewMode === 'percent' ? day.completedWeightScore : day.rawCompletedWeight;
    const y = paddingTop + chartHeight - (value / maxY) * chartHeight;
    return { x, y, value, day };
  });

  // Build smooth cubic Bezier curve string
  let curvePath = '';
  let areaPath = '';

  if (points.length > 0) {
    curvePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const controlX1 = p0.x + (p1.x - p0.x) / 2;
      const controlY1 = p0.y;
      const controlX2 = p0.x + (p1.x - p0.x) / 2;
      const controlY2 = p1.y;
      curvePath += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${p1.x} ${p1.y}`;
    }

    // Closed Area path for gradient fill under the curve
    const bottomY = paddingTop + chartHeight;
    areaPath = `${curvePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }

  // Active point for details (hovered or selected day)
  const activePoint =
    hoveredIndex !== null
      ? points[hoveredIndex]
      : points.find((p) => p.day.isSelected) || points[points.length - 1];

  // Benchmark line Y (80% target in percent mode)
  const target80Y =
    viewMode === 'percent'
      ? paddingTop + chartHeight - (80 / maxY) * chartHeight
      : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors space-y-3.5">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              7-Day Productivity Slope
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Real-time slope trajectory of completed weights
            </p>
          </div>
        </div>

        {/* Units Switcher: % vs Raw Weight Points */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => setViewMode('percent')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
              viewMode === 'percent'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Weight %
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
              viewMode === 'raw'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Raw Points
          </button>
        </div>
      </div>

      {/* Slope Movement Stat Banner */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {activePoint.day.dayLabel} Trajectory
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {viewMode === 'percent'
                ? `${activePoint.day.completedWeightScore}%`
                : `${activePoint.day.rawCompletedWeight} / ${activePoint.day.rawTotalWeight} pts`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({activePoint.day.completedTasksCount}/{activePoint.day.activeTasksCount} tasks ✓)
            </span>
          </div>
        </div>

        {/* Slope Movement Indicator */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Slope Delta
          </span>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            {activePoint.day.slopeDelta > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="w-3 h-3" />
                +{activePoint.day.slopeDelta}%
              </span>
            ) : activePoint.day.slopeDelta < 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                <TrendingDown className="w-3 h-3" />
                {activePoint.day.slopeDelta}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                <Minus className="w-3 h-3" />
                0%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SVG Slope Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Area Gradient under curve */}
            <linearGradient id="slopeAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>

            {/* Glowing stroke gradient for the slope line */}
            <linearGradient id="slopeStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Dotted Y-Axis Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const yVal = paddingTop + chartHeight - ratio * chartHeight;
            const labelValue = Math.round(ratio * maxY);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={yVal}
                  x2={svgWidth - paddingRight}
                  y2={yVal}
                  stroke="currentColor"
                  strokeDasharray="3 4"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={yVal + 3.5}
                  textAnchor="end"
                  className="text-[9px] font-bold fill-slate-400"
                >
                  {labelValue}{viewMode === 'percent' ? '%' : ''}
                </text>
              </g>
            );
          })}

          {/* 80% Benchmark Reference Line (if in percent mode) */}
          {target80Y !== null && (
            <line
              x1={paddingLeft}
              y1={target80Y}
              x2={svgWidth - paddingRight}
              y2={target80Y}
              stroke="#10b981"
              strokeDasharray="2 2"
              strokeWidth="1.2"
              opacity="0.6"
            />
          )}

          {/* Area Fill under the Slope Curve */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#slopeAreaGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* The Smooth Slope Line Path */}
          {curvePath && (
            <path
              d={curvePath}
              fill="none"
              stroke="url(#slopeStrokeGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 drop-shadow-sm"
            />
          )}

          {/* Data Points on the Curve */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isSelected = pt.day.isSelected;

            let pointColor = '#10b981';
            if (pt.day.completedWeightScore < 50 && pt.day.hasActivity) {
              pointColor = '#f43f5e';
            } else if (pt.day.completedWeightScore < 80 && pt.day.hasActivity) {
              pointColor = '#f59e0b';
            }

            return (
              <g
                key={pt.day.dateStr}
                className="cursor-pointer group"
                onClick={() => onSelectDate(pt.day.dateStr)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Active Highlight Glow Ring */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="11"
                    fill={pointColor}
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}

                {/* Outer Node Border */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered || isSelected ? '6.5' : '4.5'}
                  fill="white"
                  stroke={pointColor}
                  strokeWidth="2.5"
                  className="transition-all duration-150 drop-shadow-xs"
                />

                {/* Center Core */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered || isSelected ? '3' : '2'}
                  fill={pointColor}
                />

                {/* X-Axis Day Labels */}
                <text
                  x={pt.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className={`text-[10px] font-bold transition-colors ${
                    isSelected
                      ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold'
                      : 'fill-slate-500 dark:fill-slate-400 group-hover:fill-slate-900'
                  }`}
                >
                  {pt.day.shortDay}
                </text>
                <text
                  x={pt.x}
                  y={svgHeight}
                  textAnchor="middle"
                  className={`text-[9px] ${
                    pt.day.isToday
                      ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold'
                      : 'fill-slate-400'
                  }`}
                >
                  {pt.day.dayNumber}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info & Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Click any curve point to jump to that day</span>
        </span>
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-slate-400">7-Day Avg:</span>
          <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            {weeklyAverage}%
          </span>
        </div>
      </div>
    </div>
  );
};
