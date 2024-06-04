import { on, createResource, createSignal, createMemo, createEffect } from "solid-js";
import { format as dateFormat } from 'date-fns';
import { Form } from 'solid-bootstrap';
import { Spinner } from 'solid-bootstrap';
import { Button } from 'solid-bootstrap';
import { Modal } from 'solid-bootstrap';
import { getPlatformByPhone, formatId } from '~/swilib';
import hljs from '~/hljs';

import TableSortButton from '~/components/TableSortButton';
import SwilibEntryType from "~/components/Swilib/EntryType";
import SwilibEntryBadges from "~/components/Swilib/EntryBadges";
import SwilibEntryWarnings from "~/components/Swilib/EntryWarnings";
import SwilibEntryName from "~/components/Swilib/EntryName";
import SwilibCoverageValue from "~/components/Swilib/CoverageValue";
import SwilibPhonesTabs from "~/components/Swilib/PhonesTabs";
import { SWILIB_TOOLS_API } from "~/utils";

/*
TODO:
1. group by categories
2. show function brief by click
3. per-model table + errors
4. patterns table
5. files for RE
*/

function SwilibEntryCoverageMatrix(props) {
	let phonesByPlatform = {};
	let supportedByPhone = {};
	let maxPhonesCnt = 0;
	for (let phone in props.functionsByPhone) {
		let platform = getPlatformByPhone(phone);
		phonesByPlatform[platform] = phonesByPlatform[platform] || [];
		phonesByPlatform[platform].push(phone);
		supportedByPhone[phone] = props.functionsByPhone[phone].includes(props.id);
		maxPhonesCnt = Math.max(maxPhonesCnt, phonesByPlatform[platform].length);
	}

	return (
		<table class="table table-bordered table-hover" style="width: auto">
			<tbody>
				<For each={["ELKA", "NSG", "X75", "SG"]}>{(platform) =>
					<tr>
						<th>{platform}</th>
						<For each={phonesByPlatform[platform]}>{(phone) =>
							<td>
								<Show when={supportedByPhone[phone]}>
									<div class="text-success">
										<i class="bi bi-check-circle-fill"></i> {phone}
									</div>
								</Show>
								<Show when={!supportedByPhone[phone]}>
									<div class="text-danger">
										<i class="bi bi-x-circle-fill"></i> {phone}
									</div>
								</Show>
							</td>
						}</For>
						<Show when={phonesByPlatform[platform].length < maxPhonesCnt}>
							<td colspan={10}></td>
						</Show>
					</tr>
				}</For>
			</tbody>
		</table>
	);
}

function SwilibEntryInfo(props) {
	let [showModal, setShowModal] = createSignal(true);
	return (
		<Modal size="lg" centered show={showModal()} onHide={() => setShowModal(false)} onExited={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					<b>ID:</b> {formatId(props.entry.id)}, <b>offset:</b> {formatId(props.entry.id * 4)}
					&nbsp;&nbsp;
					<SwilibEntryBadges value={props.entry.flags} />
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div innerHTML={hljs.highlight(props.entry.name || "/* Unused */", { language: 'c' }).value}></div>
				<SwilibEntryWarnings value={props.entry.flags} class="my-3" />
				<Show when={props.entry.aliases.length > 0}>
					<div class="my-3">
						<span class="text-muted">
							<i class="bi bi-info-square"></i> Old names:
						</span>
						{' '} {props.entry.aliases.join(', ')}
					</div>
				</Show>
				<Show when={props.entry.name}>
					<div class="mt-3">
						<SwilibEntryCoverageMatrix id={props.entry.id} functionsByPhone={props.functionsByPhone} />
					</div>
				</Show>
			</Modal.Body>
		</Modal>
	);
}

function SwilibTableRow(props) {
	return (
		<>
			<tr
				style="cursor: pointer"
				onClick={() => props.onOpenEntryInfo(props.entry)}
			>
				<td classList={{ 'text-muted': props.entry.name == null }}>
					{formatId(props.entry.id)}
				</td>
				<td classList={{ 'text-muted': props.entry.name == null }}>
					<div class="d-flex justify-content-between align-items-center">
						<div>
							<SwilibEntryType value={props.entry.type} />
							&nbsp;&nbsp;
							<SwilibEntryName signature={props.entry.name} />
						</div>
						<SwilibEntryBadges value={props.entry.flags} />
					</div>
					<Show when={props.showOldNames}>
						{props.entry.aliases.map((aliasName) =>
							<div>
								<i class="bi bi-info-square"></i>
								&nbsp;&nbsp;
								<small class="text-muted">Old name:</small>
								&nbsp;
								<small>{aliasName}</small>
							</div>
						)}
					</Show>
				</td>
				<SwilibCoverageValue value={props.entry.coverage[0]} platform="ELKA" />
				<SwilibCoverageValue value={props.entry.coverage[1]} platform="NSG" />
				<SwilibCoverageValue value={props.entry.coverage[2]} platform="X75" />
				<SwilibCoverageValue value={props.entry.coverage[3]} platform="SG" />
			</tr>
		</>
	);
}

function SwilibTable(props) {
	let [tableIdSort, setTableIdSort] = createSignal('ASC');
	let [isHidden, setIsHidden] = createSignal(false);
	let [entryInfo, setEntryInfo] = createSignal(false);

	let functions = createMemo(() => {
		let sortAsc = tableIdSort() == 'ASC';
		props.functions.sort((a, b) => sortAsc ? a.id - b.id : b.id - a.id);
		return props.functions;
	}, [], { equals: () => false });

	createEffect(on(props.collapseSignal, (needCollapse) => setIsHidden(needCollapse), { defer: true }));

	let onOpenEntryInfo = (entry) => {
		setEntryInfo(entry);
	};

	return (
		<div>
			<h4 onClick={() => setIsHidden(!isHidden())} style={{ cursor: 'pointer' }}>
				<i class={`bi ${isHidden() ? 'bi-plus-square' : 'bi-dash-square'}`}></i> {' '}
				{props.file}
			</h4>
			<table class="table table-bordered table-hover table-sticky-header test" style="width: 100%; max-width: 900px" hidden={isHidden()}>
				<thead class="thead-dark">
					<tr>
						<th class="text-center">
							<TableSortButton value={tableIdSort()} onChange={setTableIdSort}>
								<small>ID</small>
							</TableSortButton>
						</th>
						<th style="width:100%">
							<small>Function</small>
						</th>
						<th class="text-center">
							<small>ELKA</small>
						</th>
						<th class="text-center">
							<small>NSG</small>
						</th>
						<th class="text-center">
							<small>X75</small>
						</th>
						<th class="text-center">
							<small>SG</small>
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={functions()}>{(row) =>
						<SwilibTableRow
							entry={row}
							onOpenEntryInfo={onOpenEntryInfo}
							showOldNames={props.showOldNames}
						/>
					}</For>
				</tbody>
			</table>
			<Show when={entryInfo()}>
				<SwilibEntryInfo
					file={props.file}
					entry={entryInfo()}
					functionsByPhone={props.functionsByPhone}
					onHide={() => setEntryInfo(false)}
				/>
			</Show>
		</div>
	);
}

function Swilib() {
	let [groupByFile, setGroupByFile] = createSignal(false);
	let [apiResult] = createResource(async () => {
		return (await fetch(`${SWILIB_TOOLS_API}/summary.json`)).json();
	});
	let [globalCollapsed, setGlobalCollapsed] = createSignal(false);
	let [showOldNames, setShowOldNames] = createSignal(true);

	let functionsByFile = createMemo(() => {
		if (!apiResult.loading && !apiResult.error) {
			if (groupByFile()) {
				let result = {};
				for (let entry of apiResult().functions) {
					result[entry.file] = result[entry.file] || [];
					result[entry.file].push(entry);
				}
				return result;
			} else {
				return { 'swilib.h': apiResult().functions };
			}
		}
		return {};
	});

	return <>
		<div class="mb-3">
			<div class="mb-2">
				<SwilibPhonesTabs />
			</div>

			<div class="d-flex justify-content-start">
				<div class="align-self-center me-3">
					<Form.Check
						type="checkbox"
						id="group-by-c-header"
						label="Group by C-header"
						checked={groupByFile()}
						onChange={(e) => setGroupByFile(e.target.checked)}
					/>
				</div>

				<div class="align-self-center me-3">
					<Form.Check
						type="checkbox"
						id="show-old-names"
						label="Show old names"
						checked={showOldNames()}
						onChange={(e) => setShowOldNames(e.target.checked)}
					/>
				</div>

				<Button variant="outline-primary" onClick={() => setGlobalCollapsed(!globalCollapsed())}>
					<Show when={!globalCollapsed()}>
						<i class="bi bi-eye-slash"></i> Collapse all
					</Show>
					<Show when={globalCollapsed()}>
						<i class="bi bi-eye"></i> Expand all
					</Show>
				</Button>
			</div>
		</div>

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
			<div class="alert alert-info" role="alert">
				Next free ID: <b>{apiResult().nextId.toString(16).padStart(3, '0').toUpperCase()}</b>,
				last update: <b>{dateFormat(new Date(apiResult().timestamp || 0), 'yyyy-MM-dd HH:mm')}</b>
			</div>

			<For each={Object.keys(functionsByFile())}>{(file) =>
				<SwilibTable
					collapseSignal={globalCollapsed}
					file={file}
					functions={functionsByFile()[file]}
					functionsByPhone={apiResult().functionsByPhone}
					showOldNames={showOldNames()}
				/>
			}</For>
		</Show>
	</>;
}

export default Swilib;
