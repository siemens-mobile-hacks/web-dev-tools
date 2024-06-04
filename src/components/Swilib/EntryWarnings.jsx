import { SwiFlags } from '~/swilib';

function SwilibEntryWarnings(props) {
	let badges = [];
	if ((props.value & SwiFlags.FROM_PATCH))
		badges.push(<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> Function from patch. Don't use in ELF's!</span>);
	if ((props.value & SwiFlags.BUILTIN))
		badges.push(<span class="text-info"><i class="bi bi-info-circle"></i> Built-in function from ELFLoader.</span>);
	if ((props.value & SwiFlags.THUMB))
		badges.push(<span class="text-warning"><i class="bi bi-exclamation-triangle"></i> Function alias for THUMB patches. Don't use in ELF's!</span>);
	if ((props.value & SwiFlags.STUB))
		badges.push(<span class="text-warning"><i class="bi bi-exclamation-triangle"></i> This SWI-call is used by the phone OS. Don't use in ELF's!</span>);
	return badges.length ? <div {...props}>{badges}</div> : <></>;
}

export default SwilibEntryWarnings;
