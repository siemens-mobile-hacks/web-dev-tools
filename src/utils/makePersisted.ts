import { SetStoreFunction, Store, reconcile, unwrap } from 'solid-js/store';

export interface PersistentOptions<T> {
	name: string;
	storage?: Storage;
	version?: number;
	serialize?: (data: unknown) => string | undefined | null;
	deserialize?: (data: unknown) => string | undefined | null;
	migrate?: (persistedState: T, version: number) => T;
	merge?: (persistedState: T, currentState: T) => T;
	skipLoad?: boolean;
}

interface PersistentInternal {
	version: number;
	state: unknown;
}

export type PersistentStore<T> = [get: Store<T>, set: SetStoreFunction<T>];

export function makePersisted<T>(store: [Store<T>, SetStoreFunction<T>], options: PersistentOptions<T>): PersistentStore<T> {
	const {
		name,
		storage = localStorage,
		version = 0,
		migrate = (persistedState) => persistedState,
		merge = (persistedState, currentState) => ({ ...currentState, ...persistedState }),
		serialize = JSON.stringify,
		deserialize = JSON.parse,
		skipLoad,
	} = options;

	const storedValue = skipLoad ? null : storage.getItem(name);
	if (storedValue !== null) {
		const parsed = deserialize(storedValue) as PersistentInternal;
		if (parsed != null && parsed.version !== null) {
			const typedState = parsed.state as T;
			if (parsed.version !== version) {
				parsed.state = migrate(typedState, parsed.version);
				parsed.version = version;
			}
			parsed.state = merge(typedState, unwrap(store[0]));
			store[1](reconcile(typedState));
		}
	}

	const updateStorage = () => {
		const serialized = serialize({
			version,
			state: unwrap(store[0]) as unknown,
		} as PersistentInternal);
		if (serialized != null) {
			storage.setItem(name, serialized);
		} else {
			storage.removeItem(name);
		}
	};

	const setWithPersistence: SetStoreFunction<T> = (...args: any) => {
		(store[1] as any)(...args);
		updateStorage();
	};

	return [store[0], setWithPersistence];
}
