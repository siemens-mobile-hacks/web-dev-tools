function SwilibCoverageValue(props) {
	if (props.value == null)
		return <td></td>;

	if (props.value == 100) {
		return (
			<td class="text-center" title={`Function present on all models in ${props.platform}`}>
				<i class="bi bi-check-circle-fill text-success"></i>
			</td>
		);
	} else if (props.value == 0) {
		return (
			<td class="text-center" title={`Function missing on all models in ${props.platform}`}>
				<i class="bi bi-x-circle-fill text-danger"></i>
			</td>
		);
	} else if (props.value >= 90) {
		return (
			<td class="text-center" title={`Function present on ${props.value}% models in ${props.platform}`}>
				<span class="badge small rounded-pill bg-success">{props.value.toFixed(0)}%</span>
			</td>
		);
	} else if (props.value >= 50) {
		return (
			<td class="text-center" title={`Function present on ${props.value}% models in ${props.platform}`}>
				<span class="badge small rounded-pill bg-warning text-dark">{props.value.toFixed(0)}%</span>
			</td>
		);
	} else {
		return (
			<td class="text-center" title={`Function present on ${props.value}% models in ${props.platform}`}>
				<span class="badge small rounded-pill bg-danger">{props.value.toFixed(0)}%</span>
			</td>
		);
	}
}

export default SwilibCoverageValue;
