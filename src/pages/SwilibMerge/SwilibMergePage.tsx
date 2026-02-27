import { Component, createSignal, For } from "solid-js";
import { CodeMirror } from "@/components/Editor/CodeMirror";
import { codemirrorVkpLanguage } from "@/components/Editor/codemirrorVkpLanguage";
import { Button, Col, Form, Nav, Row } from "solid-bootstrap";
import { SWILIB_PLATFORMS } from "@/api/swilib";
import { useTemporaryFilesStore } from "@/store/temporaryFiles";
import { makePersistedSignal } from "@/utils/makePersistedSignal";
import { useNavigate } from "@solidjs/router";

const SwilibMergePage: Component = () => {
	const navigate = useNavigate();
	const [selectedFile, setSelectedFile] = createSignal('source');
	const [temporaryFiles, setTemproraryFiles] = useTemporaryFilesStore();
	const [platform, setPlatform] = makePersistedSignal(createSignal("ELKA"), { name: 'swilibPlatform' });

	const handleInput = async (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file)
			return;

		const patchBuffer = await file.arrayBuffer();
		const decoder = new TextDecoder('windows-1251');
		const patchText = decoder.decode(patchBuffer);
		if (selectedFile() === 'source') {
			setTemproraryFiles("sourceVkp", patchText);
		} else if (selectedFile() === 'destination') {
			setTemproraryFiles("destinationVkp", patchText);
		}

		input.blur();
		input.value = '';
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		navigate(`/swilib/merge/editor?platform=${platform()}`);
	};

	return (
		<div class="d-flex flex-column h-100">
			<Row class="align-items-center justify-content-sm-between mb-3">
				<Col xs="auto">
					<Row>
						<Col xs="auto">
							<Button variant="outline-primary" onClick={handleSubmit}>Merge libraries</Button>
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

			<Nav
				variant="tabs"
				activeKey={selectedFile()} onSelect={(k) => k && setSelectedFile(k)}
				class="nav-tabs--theme-editor"
			>
				<Nav.Item>
					<Nav.Link eventKey="source">source.vkp</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="destination">destination.vkp</Nav.Link>
				</Nav.Item>
			</Nav>

			<CodeMirror
				hidden={selectedFile() != 'source'}
				value={temporaryFiles.sourceVkp}
				extensions={[
					codemirrorVkpLanguage(),
				]}
				onChange={(content) => setTemproraryFiles("sourceVkp", content)}
			/>

			<CodeMirror
				hidden={selectedFile() != 'destination'}
				value={temporaryFiles.destinationVkp}
				extensions={[
					codemirrorVkpLanguage(),
				]}
				onChange={(content) => setTemproraryFiles("destinationVkp", content)}
			/>
		</div>
	);
};

export default SwilibMergePage;
