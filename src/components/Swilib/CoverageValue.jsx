function SwilibCoverageValue(props) {
	return (
		<Switch>
			<Match when={props.value == null}>
				<td></td>
			</Match>
			<Match when={props.value == 200}>
				<td class="text-center" title={`Function present on all models in ${props.platform} (builtin)`}>
					<i class="bi bi-check-circle-fill text-info"></i>
				</td>
			</Match>
			<Match when={props.value == -200}>
				<td class="text-center" title={`Function not available on all models in ${props.platform}`}>
					<i class="bi bi-x-circle text-secondary"></i>
				</td>
			</Match>
			<Match when={props.value == 100}>
				<td class="text-center" title={`Function present on all models in ${props.platform}`}>
					<i class="bi bi-check-circle-fill text-success"></i>
				</td>
			</Match>
			<Match when={props.value == 0}>
				<td class="text-center" title={`Function missing on all models in ${props.platform}`}>
					<i class="bi bi-x-circle-fill text-danger"></i>
				</td>
			</Match>
			<Match when={props.value >= 90}>
				<td class="text-center" title={`Function present on ${props.value}% models in ${props.platform}`}>
					<span class="badge small rounded-pill bg-success">{props.value.toFixed(0)}%</span>
				</td>
			</Match>
			<Match when={props.value >= 50}>
				<td class="text-center" title={`Function present on ${props.value}% models in ${props.platform}`}>
					<span class="badge small rounded-pill bg-warning text-dark">{props.value.toFixed(0)}%</span>
				</td>
			</Match>
			<Match when={props.value >= 0}>
				<td class="text-center" title={`Function present on ${props.value}% models in ${props.platform}`}>
					<span class="badge small rounded-pill bg-danger">{props.value.toFixed(0)}%</span>
				</td>
			</Match>
		</Switch>
	);
}

export default SwilibCoverageValue;
