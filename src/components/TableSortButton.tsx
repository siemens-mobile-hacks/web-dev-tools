import { createSignal, ParentProps, Component } from "solid-js";

interface TableSortButtonProps {
	value: 'ASC' | 'DESC';
	onChange: (v: 'ASC' | 'DESC') => void;
}

export const TableSortButton: Component<ParentProps<TableSortButtonProps>> = (props) => {
	const [sorted, setSorted] = createSignal(false);

	const changeSort = (e: MouseEvent) => {
		e.preventDefault();
		const sortValue = (props.value == 'ASC' ? 'DESC' : 'ASC');
		setSorted(true);
		props.onChange(sortValue);
	};

	return (
		<span class="table-sort-btn" onClick={changeSort}>
			{props.children}
			{sorted() ? (props.value == 'ASC' ? ' ▴ ' : ' ▾ ') : ''}
		</span>
	);
};
