import React from "react";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleLinear } from "@visx/scale";
import { filledArray } from "./utils";
import { color as d3Color } from "d3-color";

const SIZE = 400;
const SIZE_INNER = 80;
const ARCS_LENGTH = 12;
const PIES_LENGTH = 1;
const RINGS_SPACING = 0.9;
const RING_WIDTH = (SIZE - SIZE_INNER) / PIES_LENGTH;
const ARCS_SPACING = 0.01;
const ARC_STARTING_ANGLE = (2 * Math.PI) / ARCS_LENGTH;
const BACKGROUND_COLOR = "#e4e3d8";

const arcs = filledArray(ARCS_LENGTH);
const pies = filledArray(PIES_LENGTH);

// Given a number form 0 to 1 interpolateRainbow
// will generate an rgb color of the rainbow
// Create an Array of colors
const COLORS = arcs.map((d, i) => interpolateRainbow(i / ARCS_LENGTH));
const opacityScale = scaleLinear({
    domain: [5, 0],
    range: [0.3, 1]
});

const arcsData = [];

for (let i = 0; i < ARCS_LENGTH; i++) {
    let startAngle = i * ARC_STARTING_ANGLE;
    let endAngle = (i + 1) * ARC_STARTING_ANGLE;
    arcsData.push({ startAngle, endAngle });
}

const WheelArc = ({
    i,
    innerRadius,
    outerRadius,
    opacity,
    arcCords: { startAngle, endAngle }
}) => {
    return (
        <Arc
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            opacity={opacity}
            padAngle={ARCS_SPACING}
            cornerRadius={5}
            fill={COLORS[i]}
        >
            {({ path }) => <CustomArc path={path} i={i} opacity={opacity} />}
        </Arc>
    );
};

const CustomArc = ({ path, i, opacity }) => (
    <>
        <path d={path()} fill={COLORS[i]} opacity={opacity} />
        <text
            fill="white"
            x={path.centroid(path)[0]}
            y={path.centroid(path)[1]}
            dy=".33em"
            fontSize={8}
            textAnchor="middle"
            pointerEvents="none"
        >
            {d3Color(COLORS[i]).formatHex()}
        </text>
    </>
);

const ColorWheel = ({ innerRadius, outerRadius, arcsData, opacity }) => {
    return arcsData.map((arcCords, i) => (
        <WheelArc
            key={`keysdc-${i}`}
            i={i}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            arcCords={arcCords}
            opacity={opacity}
        />
    ));
};

export function VisWheel({ width, height, events = true }) {
    return (
        <div>
            <svg width={width} height={height}>
                <rect width={width} height={height} fill={BACKGROUND_COLOR} rx={14} />
                <Group top={height / 2} left={width / 2}>
                    {pies.map((el, key) => (
                        <g key={`wheels-${key}`}>
                            <ColorWheel
                                innerRadius={(SIZE - (key + RINGS_SPACING) * RING_WIDTH) / 2}
                                outerRadius={(SIZE - key * RING_WIDTH) / 2}
                                arcsData={arcsData}
                                opacity={opacityScale(key)}
                            />
                        </g>
                    ))}
                </Group>
            </svg>
        </div>
    );
}

export default VisWheel;
