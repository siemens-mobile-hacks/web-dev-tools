import { SwiFlags } from '~/swilib';

function SwilibEntryBadges(props) {
	let badges = [];
	if ((props.value & SwiFlags.FROM_PATCH))
		badges.push(<span class="badge small rounded-pill bg-danger" title="Function from patch. Don't use in the ELF's!">PATCH</span>);
	if ((props.value & SwiFlags.BUILTIN))
		badges.push(<span class="badge small rounded-pill bg-info" title="Built-in function from ELFLoader.">LOADER</span>);
	if ((props.value & SwiFlags.DIRTY))
		badges.push(<span class="badge small rounded-pill bg-danger" title="Some phone models define this entry in swilib.vkp.">DIRTY</span>);
	return badges;
}

export default SwilibEntryBadges;
