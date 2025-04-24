import { writable, type Writable } from "svelte/store";
import type { ErrorHandler } from "./types";

interface ErrorState {
	message: string | null;
	context: string | null;
}

export class ErrorService {
	private static instance: ErrorService;
	private errorHandlers: ErrorHandler[] = [];
	private errorStore: Writable<ErrorState>;

	private constructor() {
		this.errorStore = writable({ message: null, context: null });
		this.setupDefaultHandler();
	}

	static getInstance(): ErrorService {
		if (!ErrorService.instance) {
			ErrorService.instance = new ErrorService();
		}
		return ErrorService.instance;
	}

	get store() {
		return this.errorStore;
	}

	private setupDefaultHandler() {
		this.addHandler({
			handleError: (error: Error, context?: string) => {
				console.error(`[${context || "Global"}]`, error);
				this.errorStore.set({
					message: error.message,
					context: context || null
				});
			}
		});
	}

	addHandler(handler: ErrorHandler) {
		this.errorHandlers.push(handler);
	}

	handleError(error: Error, context?: string) {
		this.errorHandlers.forEach(handler => {
			try {
				handler.handleError(error, context);
			} catch (handlerError) {
				console.error("Error in error handler:", handlerError);
			}
		});
	}

	clearError() {
		this.errorStore.set({ message: null, context: null });
	}
}
