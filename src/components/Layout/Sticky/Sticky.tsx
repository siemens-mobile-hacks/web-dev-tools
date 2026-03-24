import "./Sticky.scss";
import { ParentComponent } from "solid-js";

export const Sticky: ParentComponent = (props) => {
	return (
		<div class="sticky">
			{props.children}
		</div>
	);
};
