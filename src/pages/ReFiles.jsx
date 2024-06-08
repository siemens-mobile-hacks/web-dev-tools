import { A } from "@solidjs/router";
import { SWILIB_TOOLS_API } from "~/utils";
import { fetchPhones } from "~/components/Swilib/PhonesTabs";
import { createResource } from "solid-js";
import { Spinner } from "solid-bootstrap";

function ReFiles() {
	let [apiResult] = createResource(fetchPhones);

	return (<>
		<Show when={apiResult.loading}>
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		</Show>

		<Show when={apiResult.error}>
			<div class="alert alert-danger" role="alert">
				Can't load data from the server. Please, reload the page.
			</div>
		</Show>

		<Show when={!apiResult.loading && !apiResult.error}>
			<h5>CPU IO registers</h5>
			<table class="table table-bordered table-hover" style="width: auto">
				<thead>
					<tr>
						<th>
							Phone
						</th>
						<th>
							Ghidra
						</th>
						<th>
							IDA Pro
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={["pmb8876", "pmb8875"]}>{(platform) =>
						<tr>
							<td>
								{platform}
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/registers-${platform}.txt`} target="_blank">
									<i class="bi bi-file-earmark-code"></i> registers-{platform}.txt
								</A>
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/registers-${platform}.idc`} target="_blank">
									<i class="bi bi-file-earmark-code"></i> registers-{platform}.idc
								</A>
							</td>
						</tr>
					}</For>
				</tbody>
			</table>

			<h5>Swilib data types for dissasembler</h5>
			<table class="table table-bordered table-hover" style="width: auto">
				<thead>
					<tr>
						<th>
							Phone
						</th>
						<th>
							Ghidra / IDA Pro
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={["ELKA", "NSG", "X75", "SG"]}>{(platform) =>
						<tr>
							<td>
								{platform}
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/swilib-types-${platform}.h`} target="_blank">
									<i class="bi bi-file-earmark-code"></i> swilib-types-{platform}.h
								</A>
							</td>
						</tr>
					}</For>
				</tbody>
			</table>

			<hr />

			<h5>Firmware symbols for dissasembler</h5>
			<table class="table table-bordered table-hover" style="width: auto">
				<thead>
					<tr>
						<th>
							Phone
						</th>
						<th>
							Platform
						</th>
						<th>
							Ghidra
						</th>
						<th>
							IDA Pro
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={apiResult().all}>{(phone) =>
						<tr>
							<td>
								{phone.name}
							</td>
							<td>
								{phone.platform}
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/symbols-${phone.name}.txt`} target="_blank">
									<i class="bi bi-file-earmark-code"></i> symbols-{phone.name}.txt
								</A>
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/symbols-${phone.name}.idc`} target="_blank">
									<i class="bi bi-file-earmark-code"></i> symbols-{phone.name}.idc
								</A>
							</td>
						</tr>
					}</For>
				</tbody>
			</table>
		</Show>
	</>);
}

export default ReFiles;
