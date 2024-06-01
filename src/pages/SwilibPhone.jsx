import { createResource, createSignal, createMemo, createEffect, on } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { Spinner } from 'solid-bootstrap';
import { Form } from 'solid-bootstrap';
import { Button } from 'solid-bootstrap';
import { Badge } from 'solid-bootstrap';
import { getPlatformByPhone, formatId, SwiFlags } from '~/swilib';

import TableSortButton from '~/components/TableSortButton';
import SwilibEntryType from "~/components/Swilib/SwilibEntryType";
import SwilibEntryBadges from "~/components/Swilib/SwilibEntryBadges";
import SwilibEntryWarnings from "~/components/Swilib/SwilibEntryWarnings";
import SwilibEntryName from "~/components/Swilib/SwilibEntryName";

function getRowColor(swilib, entry) {
	if (swilib.errors[entry.id])
		return 'table-danger';
	if (entry.name == null)
		return '';
	if ((entry.flags & SwiFlags.BUILTIN))
		return 'table-info';
	if (swilib.values[entry.id] == null)
		return 'table-warning';
	return '';
}

function SwilibTableRow(props) {
	return (
		<>
			<tr class={getRowColor(props.swilib, props.entry)}>
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
					<Show when={props.swilib.errors[props.entry.id]}>
						<div class="text-danger">
							<i class="bi bi-exclamation-triangle"></i> {props.swilib.errors[props.entry.id]}
						</div>
					</Show>
				</td>
				<td classList={{ 'text-muted': props.entry.name == null }}>
					<Show when={props.swilib.values[props.entry.id] != null}>
						{props.swilib.values[props.entry.id].toString(16).padStart(8, '0').toUpperCase()}
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
			newFunctions = newFunctions.filter((entry) => props.swilib.errors[entry.id]);
		} else if (props.filterByType == 'errors-plus-missing') {
			newFunctions = newFunctions.filter((entry) => props.swilib.errors[entry.id] || props.swilib.values[entry.id] == null);
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
							swilib={props.swilib}
						/>
					}</For>
				</tbody>
			</table>
		</div>
	);
}

function SwilibStatistic(props) {
	let errorsCnt = 0;
	let missingCnt = 0;
	let goodCnt = 0;
	let totalCnt = props.swilib.values.length;

	for (let id = 0; id < totalCnt; id++) {
		if (props.swilib.errors[id]) {
			errorsCnt++;
		} else if (props.swilib.missing.includes(id)) {
			missingCnt++;
		} else {
			goodCnt++;
		}
	}

	let calcPct = (v) => (v / totalCnt * 100).toFixed(0);

	return (
		<div class="mb-3">
			<Badge title="Good functions." bg="success fs-6">OK: {goodCnt} | {calcPct(goodCnt)}%</Badge>
			{' '}
			<Badge title="Bad functions." bg="danger fs-6">BAD: {errorsCnt} | {calcPct(errorsCnt)}%</Badge>
			{' '}
			<Badge title="Missing functions." bg="warning text-dark fs-6">MISS: {missingCnt}| {calcPct(missingCnt)}%</Badge>
		</div>
	);
}

async function swilibFetcher(params) {
	let [swilib, summary] = await Promise.all([
		(await fetch(`http://localhost:4000/functions-phone-${params.model}.json`)).json(),
		(await fetch(`http://localhost:4000/functions-${params.groupByFile ? 'summary-by-file' : 'summary'}.json`)).json(),
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
	let [apiResult] = createResource(() => ({ model: searchParams.model, groupByFile: groupByFile() }), swilibFetcher);

	let showBadFunctions = () => {
		setFilterByType('errors');
	};

	return (
		<>
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
				<Show when={Object.keys(apiResult().swilib.errors).length > 0}>
					<div class="alert alert-danger" role="alert">
						Swilib has <b>{Object.keys(apiResult().swilib.errors).length}</b> fatal errors!!!
						<Button variant="outline-danger ms-3" size="sm" onClick={showBadFunctions} hidden={filterByType() == 'errors'}>
							Show bad functions
						</Button>
					</div>
				</Show>

				<SwilibStatistic swilib={apiResult().swilib} />

				<For each={Object.keys(apiResult().summary.files)}>{(file) =>
					<SwilibTable
						collapseSignal={globalCollapsed}
						filterByType={filterByType()}
						file={file}
						functions={apiResult().summary.files[file]}
						showOldNames={showOldNames()}
						showEntryOffset={showEntryOffset()}
						swilib={apiResult().swilib}
					/>
				}</For>
			</Show>
		</>
	);
}

export default SwilibPhone;
