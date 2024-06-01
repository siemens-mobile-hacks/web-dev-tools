function SwilibEntryName(props) {
	if (!props.signature)
		return <small class="text-muted">Unused.</small>;

	let m = props.signature.trim().match(/^(.*?)\s+([*]+)?([\w\d]+)\s*\((.+?)?\)$/is);
	if (m) {
		return (
			<>
				<small class="text-muted">
					{m[1]}&nbsp;{m[2] || ""}
				</small>
				<span class="text-primary">{m[3]}</span>
				<span class="text-muted">({m[4] != "" && m[4] != "void" ? "…" : "void"})</span>
			</>
		);
	}
	return props.signature;
}

export default SwilibEntryName;
