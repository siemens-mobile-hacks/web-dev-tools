import { BACKEND_URL } from "@/utils/env";

export interface SwilibDevice {
	target: string;
	model: string;
	sw: number;
	platform: string;
	patchId: number;
}

export enum SwilibEntryType {
	EMPTY = 0,
	FUNCTION = 1,
	POINTER = 2,
	VALUE = 3
}

export enum SwilibEntryFlags {
	NONE		= 0,
	BUILTIN		= 1 << 0,
	FROM_PATCH	= 1 << 1,
	DIRTY		= 1 << 2,
}

export interface SummarySwilibAnalysisEntry {
	id: number;
	name: string;
	aliases: string[];
	flags: SwilibEntryFlags;
	file: string;
	type: SwilibEntryType;
	coverage: Record<string, number>;
	patterns: Record<string, string>;
	targets: string[];
}

export interface SummarySwilibAnalysis {
	entries: SummarySwilibAnalysisEntry[];
	coverage: Record<string, number>;
	nextId: number;
	files: string[];
}

export interface TargetSwilibAnalysisEntry {
	id: number;
	value?: number;
	symbol?: string;
	error?: string;
	missing?: boolean;
}

export interface TargetSwilibAnalysis {
	target: string;
	platform: string;
	patchId: number;
	offset: number;
	statistic: {
		bad: number;
		good: number;
		missing: number;
		total: number;
		unused: number;
	};
	entries: TargetSwilibAnalysisEntry[];
	coverage: Record<string, number>;
}

export interface CpuSymbolsFile {
	name: string;
	ida: string;
	ghidra: string;
	cpu: string;
}

export const SWILIB_PLATFORMS = ['ELKA', 'NSG', 'X75', 'SG'];

export async function getTargetSwilibAnalysis(target: string): Promise<TargetSwilibAnalysis> {
	const url = `${BACKEND_URL}/api/swilib/analyze/${target}`;
	const response = await fetch(url);
	return response.json();
}

export async function getSummarySwilibAnalysis(): Promise<SummarySwilibAnalysis> {
	const url = `${BACKEND_URL}/api/swilib/analyze/all`;
	const response = await fetch(url);
	return response.json();
}

export async function getAvailableSwilibDevices(): Promise<SwilibDevice[]> {
	const url = `${BACKEND_URL}/api/swilib/devices`;
	const response = await fetch(url);
	return response.json();
}

export async function getAvailableCpuSymbolsFiles(): Promise<CpuSymbolsFile[]> {
	const url = `${BACKEND_URL}/api/disassembler/cpu-symbols`;
	const response = await fetch(url);
	return response.json();
}

export function getPatternsCoverage(patterns: Record<string, string>, coverage: Record<string, number>) {
	const patternsCoverage: Record<string, number> = {};
	for (const platform of SWILIB_PLATFORMS) {
		const platformCoverage = coverage[platform] ?? 0;
		if (platformCoverage < 0 || platformCoverage > 100) {
			patternsCoverage[platform] = platformCoverage;
		} else {
			patternsCoverage[platform] = patterns[platform] ? 100 : 0;
		}
	}
	return patternsCoverage;
}
