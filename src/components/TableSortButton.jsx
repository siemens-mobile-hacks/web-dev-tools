import { createSignal } from "solid-js";

function TableSortButton(props) {
	let [sorted, setSorted] = createSignal(false);

	let changeSort = (e) => {
		e.preventDefault();
		let sortValue = (props.value == 'ASC' ? 'DESC' : 'ASC');
		setSorted(true);
		props.onChange(sortValue);
	};

	return (
		<span class="table-sort-btn" onClick={changeSort}>
			{props.children}
			{sorted() ? (props.value == 'ASC' ? ' ▴ ' : ' ▾ ') : ''}
		</span>
	);
}

export default TableSortButton;
