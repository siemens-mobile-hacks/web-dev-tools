import { A } from "@solidjs/router";
import { Component, createResource, For, Show } from "solid-js";
import { Spinner } from "solid-bootstrap";
import { BACKEND_URL } from "@/utils/env";
import { getAvailableCpuSymbolsFiles, getAvailableSwilibDevices, SWILIB_PLATFORMS } from "@/api/swilib";

const ReFilesPage: Component = () => {
	const [response] = createResource(async () => {
		const [cpu, devices] = await Promise.all([
			getAvailableCpuSymbolsFiles(),
			getAvailableSwilibDevices(),
		]);
		return { cpu, devices };
	});

	return <>
		<Show when={response.loading}>
			<Spinner animation="border" role="status">
				<span class="visually-hidden">Loading...</span>
			</Spinner>
		</Show>

		<Show when={response.error}>
			<div class="alert alert-danger" role="alert">
				Can't load data from the server. Please, reload the page.
			</div>
		</Show>

		<Show when={response()}>{(response) => <>
			<h5>Swilib data types for dissasembler</h5>
			<table class="table table-bordered table-hover" style={{width: "auto"}}>
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
				<For each={SWILIB_PLATFORMS}>{(platform) =>
					<tr>
						<td>
							{platform}
						</td>
						<td>
							<A
								href={`${BACKEND_URL}/api/disassembler/download/types/${platform}/swilib-types-${platform}.h`}
								target="_blank"
								rel="noopener"
							>
								<i class="bi bi-file-earmark-code"></i> swilib-types-{platform}.h
							</A>
						</td>
					</tr>
				}</For>
				</tbody>
			</table>

			<h5>Firmware symbols for dissasembler</h5>

			<div class="text-info mb-3">
				<i class="bi bi-info-circle"></i> {' '}
				For IDA Pro, only symbol names are available, without associated data types.
			</div>

			<table class="table table-bordered table-hover" style={{width: "auto"}}>
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
				<For each={response().devices}>{(device) =>
					<tr>
						<td>
							{device.target}
						</td>
						<td>
							{device.platform}
						</td>
						<td>
							<A
								href={`${BACKEND_URL}/api/swilib/download/${device.target}/symbols-${device.target}.txt`}
								target="_blank"
								rel="noopener"
							>
								<i class="bi bi-file-earmark-code"></i> symbols-{device.target}.txt
							</A>
						</td>
						<td>
							<A
								href={`${BACKEND_URL}/api/swilib/download/${device.target}/symbols-${device.target}.idc`}
								target="_blank"
								rel="noopener"
							>
								<i class="bi bi-file-earmark-code"></i> symbols-{device.target}.idc
							</A>
						</td>
					</tr>
				}</For>
				</tbody>
			</table>

			<h5>CPU IO registers</h5>

			<div class="text-info mb-3">
				<i class="bi bi-info-circle"></i> {' '}
				If your device is not listed below, select the generic PMB8875 (for X75 or SG) or PMB8876 (for ELKA or NSG).
			</div>

			<table class="table table-bordered table-hover" style={{ width: "auto" }}>
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
					<For each={response().cpu}>{(cpuSymbolsFile) =>
						<tr>
							<td>
								{cpuSymbolsFile.name}
							</td>
							<td>
								{cpuSymbolsFile.cpu}
							</td>
							<td>
								<A
									href={`${BACKEND_URL}/api/disassembler/download/cpu/${cpuSymbolsFile.ghidra}`}
									target="_blank"
									rel="noopener"
								>
									<i class="bi bi-file-earmark-code"></i> {cpuSymbolsFile.ghidra}
								</A>
							</td>
							<td>
								<A
									href={`${BACKEND_URL}/api/disassembler/download/cpu/${cpuSymbolsFile.ida}`}
									target="_blank"
									rel="noopener"
								>
									<i class="bi bi-file-earmark-code"></i> {cpuSymbolsFile.ida}
								</A>
							</td>
						</tr>
					}</For>
				</tbody>
			</table>
		</>}</Show>
	</>;
};

export default ReFilesPage;
