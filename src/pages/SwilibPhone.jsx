import { createResource, createSignal, createMemo, createEffect, on } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { Spinner } from 'solid-bootstrap';
import { Form } from 'solid-bootstrap';
import { Button } from 'solid-bootstrap';
import { Badge } from 'solid-bootstrap';
import { getPlatformByPhone, formatId, SwiFlags } from '~/swilib';

import TableSortButton from '~/components/TableSortButton';
import SwilibEntryType from "~/components/Swilib/EntryType";
import SwilibEntryBadges from "~/components/Swilib/EntryBadges";
import SwilibEntryWarnings from "~/components/Swilib/EntryWarnings";
import SwilibEntryName from "~/components/Swilib/EntryName";
import SwilibPhonesTabs from '~/components/Swilib/PhonesTabs';
import { SWILIB_TOOLS_API } from '~/utils';

function getRowColor(entry, swilib) {
	if (swilib[entry.id]?.error)
		return 'table-danger';
	if (entry.name == null)
		return '';
	if ((entry.flags & SwiFlags.BUILTIN))
		return 'table-info';
	if (swilib[entry.id]?.value == null)
		return 'table-warning';
	return '';
}

function SwilibTableRow(props) {
	return (
		<>
			<tr class={getRowColor(props.entry, props.swilib)}>
				<td classList={{ 'text-muted': props.entry.name == null }}>
					{formatId(props.entry.id)}
				</td>
				<td classList={{ 'text-muted': props.entry.name == null }} hidden={!props.showEntryOffset}>
					{formatId(props.entry.id * 4)}
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
					<Show when={props.swilib[props.entry.id]?.error}>
						<div class="text-danger">
							<i class="bi bi-exclamation-triangle"></i> {props.swilib[props.entry.id].error}
						</div>
					</Show>
				</td>
				<td classList={{ 'text-muted': props.entry.name == null }} hidden={!props.showOriginalSymbol}>
					<Show when={props.swilib[props.entry.id]?.symbol}>
						{props.swilib[props.entry.id].symbol}
					</Show>
				</td>
				<td classList={{ 'text-muted': props.entry.name == null }}>
					<Show when={props.swilib[props.entry.id]?.value != null}>
						{props.swilib[props.entry.id].value.toString(16).padStart(8, '0').toUpperCase()}
					</Show>
				</td>
			</tr>
		</>
	);
}

function SwilibTable(props) {
	let [tableIdSort, setTableIdSort] = createSignal('ASC');
	let [isHidden, setIsHidden] = createSignal(false);

	let functions = createMemo(() => {
		let sortAsc = tableIdSort() == 'ASC';

		let newFunctions = [...props.functions];

		newFunctions.sort((a, b) => sortAsc ? a.id - b.id : b.id - a.id);

		if (props.filterByType == 'errors') {
			newFunctions = newFunctions.filter((entry) => props.swilib[entry.id]?.error != null);
		} else if (props.filterByType == 'errors-plus-missing') {
			newFunctions = newFunctions.filter((entry) => props.swilib[entry.id]?.error != null || props.swilib[entry.id]?.value == null);
		}

		return newFunctions;
	});

	createEffect(on(props.collapseSignal, (needCollapse) => setIsHidden(needCollapse), { defer: true }));

	return (
		<div hidden={functions().length == 0}>
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
						<th class="text-center" hidden={!props.showEntryOffset}>
							<small>OFF</small>
						</th>
						<th style="width:100%">
							<small>Function</small>
						</th>
						<th class="text-center" hidden={!props.showOriginalSymbol}>
							<small>Name in VKP</small>
						</th>
						<th class="text-center">
							<small>Value</small>
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={functions()}>{(row) =>
						<SwilibTableRow
							entry={row}
							showOldNames={props.showOldNames}
							showEntryOffset={props.showEntryOffset}
							showOriginalSymbol={props.showOriginalSymbol}
							swilib={props.swilib}
						/>
					}</For>
				</tbody>
			</table>
		</div>
	);
}

function SwilibStatistic(props) {
	let calcPct = (v) => (v / props.stat.total * 100).toFixed(0);
	return (
		<div class="mb-3">
			<Badge title="Good functions." bg="success fs-6">OK: {props.stat.good} | {calcPct(props.stat.good)}%</Badge>
			{' '}
			<Badge title="Bad functions." bg="danger fs-6">BAD: {props.stat.bad} | {calcPct(props.stat.bad)}%</Badge>
			{' '}
			<Badge title="Missing functions." bg="warning text-dark fs-6">MISS: {props.stat.missing}| {calcPct(props.stat.missing)}%</Badge>
		</div>
	);
}

async function swilibFetcher(params) {
	let [swilib, summary] = await Promise.all([
		(await fetch(`${SWILIB_TOOLS_API}/${params.model}.json`)).json(),
		(await fetch(`${SWILIB_TOOLS_API}/summary.json`)).json(),
	]);
	return { swilib, summary };
}

function SwilibPhone() {
	let [searchParams] = useSearchParams();
	let [groupByFile, setGroupByFile] = createSignal(false);
	let [globalCollapsed, setGlobalCollapsed] = createSignal(false);
	let [showOldNames, setShowOldNames] = createSignal(true);
	let [showEntryOffset, setShowEntryOffset] = createSignal(false);
	let [showOriginalSymbol, setShowOriginalSymbol] = createSignal(false);
	let [filterByType, setFilterByType] = createSignal('all');
	let [apiResult] = createResource(() => ({ model: searchParams.model }), swilibFetcher);

	let summary = createMemo(() => apiResult()?.summary);
	let swilib = createMemo(() => apiResult()?.swilib.entries);
	let swilibStat = createMemo(() => apiResult()?.swilib.stat);
	let swilibPatchId = createMemo(() => apiResult()?.swilib.patchId);

	let showBadFunctions = () => {
		setFilterByType('errors');
	};

	let functionsByFile = createMemo(() => {
		if (summary()) {
			if (groupByFile()) {
				let result = {};
				for (let entry of summary().functions) {
					result[entry.file] = result[entry.file] || [];
					result[entry.file].push(entry);
				}
				return result;
			} else {
				return { 'swilib.h': summary().functions };
			}
		}
		return {};
	});

	return (
		<>
			<div class="mb-2">
				<SwilibPhonesTabs selectedPhone={searchParams.model} />
			</div>

			<div class="d-flex justify-content-start mb-3">
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

				<div class="align-self-center me-3">
					<Form.Check
						type="checkbox"
						id="show-offsets"
						label="Show offsets"
						checked={showEntryOffset()}
						onChange={(e) => setShowEntryOffset(e.target.checked)}
					/>
				</div>

				<div class="align-self-center me-3">
					<Form.Check
						type="checkbox"
						id="show-original-sym"
						label="Show names in .VKP"
						checked={showOriginalSymbol()}
						onChange={(e) => setShowOriginalSymbol(e.target.checked)}
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

			<div class="d-flex flex-row mb-3">
				<span class="me-3"><i class="bi bi-funnel"></i> Show functions:</span>
				<Form.Check
					inline
					type="radio"
					id="filter-type-all"
					name="filter-type"
					label="All"
					value="all"
					checked={filterByType() == 'all'}
					onChange={(e) => e.target.checked && setFilterByType(e.target.value)}
				/>
				<Form.Check
					inline
					type="radio"
					class="text-danger"
					id="filter-type-errors"
					name="filter-type"
					label="With errors"
					value="errors"
					checked={filterByType() == 'errors'}
					onChange={(e) => e.target.checked && setFilterByType(e.target.value)}
				/>
				<Form.Check
					inline
					type="radio"
					class="text-danger"
					id="filter-type-errors-missing"
					name="filter-type"
					label="With errors + missing"
					value="errors-plus-missing"
					checked={filterByType() == 'errors-plus-missing'}
					onChange={(e) => e.target.checked && setFilterByType(e.target.value)}
				/>
			</div>

			<div class="d-flex flex-row mb-3">
				<Button
					class="me-3" as="a" variant="outline-success" size="sm" target="_blank" rel="noopener"
					href="#"
				>
					<i class="bi bi-download"></i> Normalized <b>.vkp</b>
				</Button>

				<Button
					class="me-3" as="a" variant="outline-success" size="sm" target="_blank" rel="noopener"
					href="#"
				>
					<i class="bi bi-download"></i> Library as <b>swi.blib</b>
				</Button>

				<Button
					class="me-3" as="a" variant="outline-primary" size="sm" target="_blank" rel="noopener"
					href={`https://patches.kibab.com/patches/details.php5?id=${swilibPatchId()}`}
				>
					<i class="bi bi-browser-chrome"></i> Open on Kibab
				</Button>
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
				<Show when={swilibStat().bad > 0}>
					<div class="alert alert-danger" role="alert">
						Swilib has <b>{swilibStat().bad}</b> fatal errors!!!
						<Button variant="outline-danger ms-3" size="sm" onClick={showBadFunctions} hidden={filterByType() == 'errors'}>
							Show bad functions
						</Button>
					</div>
				</Show>

				<SwilibStatistic stat={swilibStat()} />

				<For each={Object.keys(functionsByFile())}>{(file) =>
					<SwilibTable
						collapseSignal={globalCollapsed}
						filterByType={filterByType()}
						file={file}
						showOldNames={showOldNames()}
						showEntryOffset={showEntryOffset()}
						showOriginalSymbol={showOriginalSymbol()}
						functions={functionsByFile()[file]}
						swilib={swilib()}
					/>
				}</For>
			</Show>
		</>
	);
}

export default SwilibPhone;
