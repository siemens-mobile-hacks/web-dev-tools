import { Component, createSignal, For } from "solid-js";
import { CodeMirror } from "@/components/Editor/CodeMirror";
import { codemirrorVkpLanguage } from "@/components/Editor/codemirrorVkpLanguage";
import { Button, Col, Form, Row } from "solid-bootstrap";
import { SWILIB_PLATFORMS } from "@/api/swilib";
import { useTemporaryFilesStore } from "@/store/temporaryFiles";
import { makePersistedSignal } from "@/utils/makePersistedSignal";
import { useNavigate } from "@solidjs/router";

const SwilibCheckPage: Component = () => {
	const navigate = useNavigate();
	const [busy, setBusy] = createSignal(false);
	const [temproraryFiles, setTemproraryFiles] = useTemporaryFilesStore();
	const [platform, setPlatform] = makePersistedSignal(createSignal("ELKA"), { name: 'swilibPlatform' });

	const handleInput = async (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file)
			return;
		input.blur();
		const text = await file.text();
		setTemproraryFiles("swilibVkp", text);
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setBusy(true);
		try {
			navigate(`/swilib/analysis/target/?target=${platform()}`);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div class="d-flex flex-column h-100">
			<Row class="align-items-center justify-content-sm-between mb-3">
				<Col xs="auto">
					<Row>
						<Col xs="auto">
							<Button variant="outline-primary" onClick={handleSubmit} disabled={busy()}>
								Check swilib.vkp
							</Button>
						</Col>
						<Col xs="auto">
							<Form.Select value={platform()} onChange={(e) => setPlatform(e.currentTarget.value)}>
								<For each={SWILIB_PLATFORMS}>{(platform) =>
									<option value={platform}>{platform}</option>
								}</For>
							</Form.Select>
						</Col>
					</Row>
				</Col>
				<Col xs="auto">
					<Form.Control type="file" onInput={handleInput} accept=".vkp" />
				</Col>
			</Row>
			<CodeMirror
				value={temproraryFiles.swilibVkp}
				extensions={[
					codemirrorVkpLanguage(),
				]}
				onChange={(content) => setTemproraryFiles("swilibVkp", content)}
			/>
		</div>
	);
};

export default SwilibCheckPage;
