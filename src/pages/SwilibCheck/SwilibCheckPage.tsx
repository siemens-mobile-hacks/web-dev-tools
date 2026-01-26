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

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		navigate(`/swilib/analysis/target/?target=${platform()}`);
	};

	return (
		<div class="d-flex flex-column h-100 gap-3">
			<Row class="align-items-center justify-content-sm-between">
				<Col xs="auto">
					<Row>
						<Col xs="auto">
							<Button type="submit" onClick={handleSubmit}>Check swilib.vkp</Button>
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
