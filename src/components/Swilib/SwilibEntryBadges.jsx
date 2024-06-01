import { SwiFlags } from '~/swilib';

function SwilibEntryBadges(props) {
	let badges = [];
	if ((props.value & SwiFlags.FROM_PATCH))
		badges.push(<span class="badge small rounded-pill bg-danger" title="Function from patch. Don't use in the ELF's!">PATCH</span>);
	if ((props.value & SwiFlags.BUILTIN))
		badges.push(<span class="badge small rounded-pill bg-info" title="Built-in function from ELFLoader.">LOADER</span>);
	if ((props.value & SwiFlags.THUMB))
		badges.push(<span class="badge small rounded-pill bg-warning" title="Function alias for THUMB patches. Don't use in ELF's!">THUMB</span>);
	if ((props.value & SwiFlags.STUB))
		badges.push(<span class="badge small rounded-pill bg-warning" title="This SWI-call is used by the phone OS. Don't use in ELF's!">STUB</span>);
	return badges;
}

export default SwilibEntryBadges;
