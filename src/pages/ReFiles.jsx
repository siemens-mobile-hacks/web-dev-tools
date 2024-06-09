import { A } from "@solidjs/router";
import { PMB887X_DEV_API, SWILIB_TOOLS_API } from "~/utils";
import { createResource } from "solid-js";
import { Spinner } from "solid-bootstrap";

export async function fetchPhones() {
	return (await fetch(`${SWILIB_TOOLS_API}/phones.json`)).json();
}

export async function fetchCpuFiles() {
	return (await fetch(`${SWILIB_TOOLS_API}/cpu-files.json`)).json();
}

function ReFiles() {
	let [phones] = createResource(fetchPhones);
	let [cpuFiles] = createResource(fetchCpuFiles);

	return (<>
		<Show when={phones.loading}>
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		</Show>

		<Show when={phones.error}>
			<div class="alert alert-danger" role="alert">
				Can't load data from the server. Please, reload the page.
			</div>
		</Show>

		<Show when={!phones.loading && !phones.error}>
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
								<A href={`${SWILIB_TOOLS_API}/swilib-types-${platform}.h`}>
									<i class="bi bi-file-earmark-code"></i> swilib-types-{platform}.h
								</A>
							</td>
						</tr>
					}</For>
				</tbody>
			</table>

			<h5>Firmware symbols for dissasembler</h5>

			<div class="text-info mb-3">
				<i class="bi bi-info-circle"></i> For IDA Pro, only symbol names are available, without associated data types.
			</div>

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
					<For each={phones().all}>{(phone) =>
						<tr>
							<td>
								{phone.name}
							</td>
							<td>
								{phone.platform}
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/symbols-${phone.name}.txt`}>
									<i class="bi bi-file-earmark-code"></i> symbols-{phone.name}.txt
								</A>
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/symbols-${phone.name}.idc`}>
									<i class="bi bi-file-earmark-code"></i> symbols-{phone.name}.idc
								</A>
							</td>
						</tr>
					}</For>
				</tbody>
			</table>
		</Show>

		<Show when={cpuFiles.loading}>
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		</Show>

		<Show when={cpuFiles.error}>
			<div class="alert alert-danger" role="alert">
				Can't load data from the server. Please, reload the page.
			</div>
		</Show>

		<Show when={!cpuFiles.loading && !cpuFiles.error}>
			<h5>CPU IO registers</h5>

			<div class="text-info mb-3">
				<i class="bi bi-info-circle"></i> If your device is not listed below, select the generic PMB8875 (for X75 or SG) or PMB8876 (for ELKA or NSG).
			</div>

			<table class="table table-bordered table-hover" style="width: auto">
				<thead>
					<tr>
						<th>
							Device
						</th>
						<th>
							CPU
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
					<For each={cpuFiles()}>{(file) =>
						<tr>
							<td>
								{file.name}
							</td>
							<td>
								{file.cpu}
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/${file.ghidra}`} download={file.ghidra}>
									<i class="bi bi-file-earmark-code"></i> {file.ghidra}
								</A>
							</td>
							<td>
								<A href={`${SWILIB_TOOLS_API}/${file.ida}`} download={file.ida}>
									<i class="bi bi-file-earmark-code"></i> {file.ida}
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
