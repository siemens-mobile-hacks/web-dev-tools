import { SwiType } from '~/swilib';

function SwilibEntryType(props) {
	switch (props.value) {
		case SwiType.FUNCTION: return <i class="bi bi-c-circle-fill text-muted"></i>;
		case SwiType.POINTER: return <i class="bi bi-arrow-up-right-circle text-muted"></i>;
		case SwiType.VALUE: return <i class="bi bi-info-circle text-muted"></i>;
	}
	return <i class="bi bi-x-circle"></i>;
}

export default SwilibEntryType;
