import { createResource } from "solid-js";

let phonesCache;

async function fetchPhones() {
	if (!phonesCache)
		phonesCache = (await fetch(`http://localhost:4000/phones.json`)).json();
	return phonesCache;
}

function SwilibPhonesTabs(props) {
	let [apiResult] = createResource(fetchPhones);
	return (
		<div style="min-height: 48px">
			<Show when={!apiResult.loading && !apiResult.error}>
				<div class="d-flex justify-content-between">
					<For each={apiResult().all}>{(phone) =>
						<a
							class="text-center text-decoration-none"
							classList={{
								'fw-bold': props.selectedPhone == phone.name
							}}
							href={`/swilib/phone/?model=${phone.name}`}
							title={`Swilib info for ${phone.name}`}
						>
							<small>{phone.model}</small><br />
							<sup class="text-muted">
								v{phone.sw}
							</sup>
						</a>
					}</For>
				</div>
			</Show>
		</div>
	);
}

export default SwilibPhonesTabs;
