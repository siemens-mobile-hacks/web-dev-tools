export const SwiType = {
	EMPTY:		0,
	FUNCTION:	1,
	POINTER:	2,
	VALUE:		3,
};

export const SwiFlags = {
	BUILTIN:		1 << 0,
	FROM_PATCH:		1 << 1,
	THUMB:			1 << 2,
	STUB:			1 << 3,
	HALF_BUILTIN:	1 << 4,
};

export function formatId(id) {
	return id.toString(16).padStart(3, '0').toUpperCase();
}

export function getPlatformByPhone(phone) {
	let m = phone.match(/^(.*?)(?:v|sw)([\d+_]+)$/i);
	let model = m[1];
	if (/^(EL71|EL71C|E71C|E71|CL61|M72|C1F0)$/i.test(model))
		return "ELKA";
	if (/^(C81|S75|SL75|S68|S7C)$/i.test(model))
		return "NSG";
	if (/^(CX75|ME75|CF75|M75|C75|C72)$/i.test(model))
		return "X75";
	return "SG";
}
