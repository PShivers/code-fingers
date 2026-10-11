import React from "react";

const ResultsChart = ({ timeline = [], wpm = 0, errors = 0 }) => {
	// If timeline has fewer than 2 points, generate a representative curve from start to finish
	const data = timeline.length >= 2 ? timeline : [
		{ time: 0, wpm: Math.round(wpm * 0.8), rawWpm: Math.round(wpm * 0.8), errors: 0 },
		{ time: 1, wpm: Math.round(wpm * 0.95), rawWpm: Math.round(wpm * 0.98), errors: 0 },
		{ time: 2, wpm: wpm, rawWpm: Math.round(wpm * 1.05), errors: errors },
	];

	const width = 600;
	const height = 180;
	const padding = { top: 20, right: 30, bottom: 30, left: 45 };

	const innerWidth = width - padding.left - padding.right;
	const innerHeight = height - padding.top - padding.bottom;

	const maxTime = Math.max(...data.map((d) => d.time), 1);
	const maxWpm = Math.max(...data.map((d) => Math.max(d.wpm || 0, d.rawWpm || 0)), wpm, 30);
	const yMax = Math.ceil((maxWpm * 1.15) / 10) * 10;

	const getX = (t) => padding.left + (t / maxTime) * innerWidth;
	const getY = (val) => padding.top + innerHeight - (val / yMax) * innerHeight;

	// Build SVG points string
	const wpmPoints = data.map((d) => `${getX(d.time)},${getY(d.wpm)}`).join(" ");
	const rawPoints = data.map((d) => `${getX(d.time)},${getY(d.rawWpm || d.wpm)}`).join(" ");

	// Area path under WPM curve
	const areaPath = `M ${getX(data[0].time)},${padding.top + innerHeight} L ${wpmPoints.split(" ").join(" L ")} L ${getX(data[data.length - 1].time)},${padding.top + innerHeight} Z`;

	// Y-axis ticks
	const yTicks = [0, Math.round(yMax / 2), yMax];
	// X-axis ticks (seconds)
	const xTicks = [0, Math.round(maxTime / 2), Math.round(maxTime)];

	return (
		<div style={{ width: "100%", maxWidth: "680px", margin: "1rem auto 0" }}>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				style={{ width: "100%", height: "auto", overflow: "visible" }}
			>
				<defs>
					<linearGradient id="wpmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="var(--caret)" stopOpacity="0.25" />
						<stop offset="100%" stopColor="var(--caret)" stopOpacity="0.0" />
					</linearGradient>
				</defs>

				{/* Grid horizontal lines */}
				{yTicks.map((tick) => (
					<g key={tick}>
						<line
							x1={padding.left}
							y1={getY(tick)}
							x2={width - padding.right}
							y2={getY(tick)}
							stroke="var(--dim)"
							strokeOpacity="0.2"
							strokeDasharray="4 4"
						/>
						<text
							x={padding.left - 8}
							y={getY(tick) + 4}
							fill="var(--dim)"
							fontSize="10"
							fontFamily="monospace"
							textAnchor="end"
						>
							{tick}
						</text>
					</g>
				))}

				{/* X-axis ticks */}
				{xTicks.map((t, idx) => (
					<text
						key={idx}
						x={getX(t)}
						y={height - 8}
						fill="var(--dim)"
						fontSize="10"
						fontFamily="monospace"
						textAnchor={idx === 0 ? "start" : idx === xTicks.length - 1 ? "end" : "middle"}
					>
						{t}s
					</text>
				))}

				{/* Area gradient under WPM */}
				<path d={areaPath} fill="url(#wpmGradient)" />

				{/* Raw WPM line (secondary dashed) */}
				<polyline
					fill="none"
					stroke="var(--dim)"
					strokeWidth="1.5"
					strokeDasharray="3 3"
					strokeOpacity="0.7"
					points={rawPoints}
				/>

				{/* Net WPM line (primary glowing) */}
				<polyline
					fill="none"
					stroke="var(--caret)"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					points={wpmPoints}
				/>

				{/* Error points */}
				{data.filter((d) => d.errors > 0).map((d, i) => (
					<circle
						key={i}
						cx={getX(d.time)}
						cy={getY(d.wpm)}
						r="3.5"
						fill="var(--err)"
						stroke="var(--bg)"
						strokeWidth="1.5"
					/>
				))}
			</svg>

			{/* Legend */}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "1.5rem",
					marginTop: "0.25rem",
					fontSize: "0.75rem",
					fontFamily: "monospace",
					color: "var(--dim)",
				}}
			>
				<span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
					<span style={{ width: "12px", height: "3px", background: "var(--caret)", borderRadius: "2px" }} />
					wpm
				</span>
				<span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
					<span style={{ width: "12px", height: "2px", background: "var(--dim)", borderStyle: "dashed" }} />
					raw
				</span>
				{errors > 0 && (
					<span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
						<span style={{ width: "6px", height: "6px", background: "var(--err)", borderRadius: "50%" }} />
						errors
					</span>
				)}
			</div>
		</div>
	);
};

export default ResultsChart;
