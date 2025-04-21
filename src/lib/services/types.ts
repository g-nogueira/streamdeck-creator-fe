export interface ErrorHandler {
	handleError(error: Error, context?: string): void;
}

export abstract class AppError extends Error {
	constructor(
		message: string,
		public readonly context?: string,
		public readonly originalError?: Error
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class GradientError extends AppError {
	constructor(message: string, originalError?: Error) {
		super(message, "Gradient", originalError);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, context: string, originalError?: Error) {
		super(message, context, originalError);
	}
}
