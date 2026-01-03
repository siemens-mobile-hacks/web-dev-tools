import { Component } from "solid-js";
import { Badge } from "solid-bootstrap";
import { TargetSwilibAnalysis } from "@/api/swilib";

interface SwilibStatisticProps {
	statistic: TargetSwilibAnalysis['statistic'];
}

export const SwilibStatistic: Component<SwilibStatisticProps> = (props) => {
	const getPercent = (v: number) => (v / props.statistic.total * 100).toFixed(0);
	return (
		<div class="mb-3">
			<Badge
				title="Good functions."
				bg="success fs-6"
			>
				OK: {props.statistic.good} | {getPercent(props.statistic.good)}%
			</Badge>
			{' '}
			<Badge
				title="Bad functions."
				bg="danger fs-6"
			>
				BAD: {props.statistic.bad} | {getPercent(props.statistic.bad)}%
			</Badge>
			{' '}
			<Badge
				title="Missing functions."
				bg="warning text-dark fs-6"
			>
				MISS: {props.statistic.missing}| {getPercent(props.statistic.missing)}%
			</Badge>
		</div>
	);
};
