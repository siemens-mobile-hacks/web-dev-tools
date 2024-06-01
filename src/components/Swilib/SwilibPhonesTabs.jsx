function SwilibPhonesTabs(props) {
	return (
		<div class="d-flex justify-content-between">
			<For each={props.phones}>{(phone) =>
				<a
					class="text-center text-decoration-none"
					classList={{
						'fw-bold': props.selectedPhone == phone
					}}
					href={`/swilib/phone/?model=${phone}`}
					title={`Swilib info for ${phone}`}
				>
					<small>{phone.split("v")[0]}</small><br />
					<sup class="text-muted">
						v{phone.split("v")[1]}
					</sup>
				</a>
			}</For>
		</div>
	);
}

export default SwilibPhonesTabs;
