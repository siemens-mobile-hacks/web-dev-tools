import { Setter, Signal } from "solid-js";
import { debounce } from "es-toolkit";

export interface PersistentSignalOptions {
	name: string;
	storage?: Storage;
	serialize?: (data: any) => string;
	deserialize?: (data: string) => any;
	debounce?: number;
}

export function makePersistedSignal<T>(signal: Signal<T>, options: PersistentSignalOptions): Signal<T> {
	const {
		name,
		storage = localStorage,
		serialize = JSON.stringify,
		deserialize = JSON.parse,
		debounce: debounceInterval = 0,
	} = options;

	const storedValue = storage.getItem(name);
	if (storedValue !== null) {
		const deserialized = deserialize(storedValue);
		signal[1](deserialized);
	}

	const updateStorage = debounce(() => {
		const serialized = serialize(signal[0]());
		storage.setItem(name, serialized);
	}, debounceInterval);

	const setWithPersistence = (...args: any) => {
		(signal[1] as any)(...args);
		updateStorage();
	};

	return [signal[0], setWithPersistence as Setter<T>];
}
