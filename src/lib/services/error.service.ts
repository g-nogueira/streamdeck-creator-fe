import { writable, type Writable } from "svelte/store";
import type { ErrorHandler } from "./types";

/**
 * Interface representing the current error state
 */
interface ErrorState {
	message: string | null;
	context: string | null;
}

/**
 * Service for centralized error handling and management
 * Implements the singleton pattern for global error state management
 */
export class ErrorService {
	private static instance: ErrorService;
	private errorHandlers: ErrorHandler[] = [];
	private errorStore: Writable<ErrorState>;

	private constructor() {
		this.errorStore = writable({ message: null, context: null });
		this.setupDefaultHandler();
	}

	/**
	 * Gets the singleton instance of ErrorService
	 * @returns The ErrorService instance
	 */
	static getInstance(): ErrorService {
		if (!ErrorService.instance) {
			ErrorService.instance = new ErrorService();
		}
		return ErrorService.instance;
	}

	/**
	 * Gets the Svelte store containing the error state
	 */
	get store() {
		return this.errorStore;
	}

	/**
	 * Sets up the default error handler for logging and store updates
	 * @private
	 */
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

	/**
	 * Adds a new error handler to the service
	 * @param handler The error handler to add
	 */
	addHandler(handler: ErrorHandler) {
		this.errorHandlers.push(handler);
	}

	/**
	 * Handles an error by passing it through all registered handlers
	 * @param error The error to handle
	 * @param context Optional context where the error occurred
	 */
	handleError(error: Error, context?: string) {
		this.errorHandlers.forEach(handler => {
			try {
				handler.handleError(error, context);
			} catch (handlerError) {
				console.error("Error in error handler:", handlerError);
			}
		});
	}

	/**
	 * Clears the current error state
	 */
	clearError() {
		this.errorStore.set({ message: null, context: null });
	}
}
