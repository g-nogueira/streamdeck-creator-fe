<script lang="ts">
	import { ErrorService } from "$lib/services/error.service";
	import { Toaster, createToaster } from "@skeletonlabs/skeleton-svelte";

	let errorService = ErrorService.getInstance();

	// Toast helper
	const toaster = createToaster();

	// Helper to generate GitHub issue URL
	function generateIssueUrl(errorMessage: string, errorStack?: string): string {
		const repoUrl = "https://github.com/g-nogueira/streamdeck-creator-fe/issues/new";
		const title = encodeURIComponent(`Bug Report: ${errorMessage}`);
		const body = encodeURIComponent(
			`### Error Details\n\n**Message:** ${errorMessage}\n\n**Stack Trace:**\n\`\`\`\n${errorStack || "N/A"}\n\`\`\`\n\n### Steps to Reproduce\n1. \n2. \n3. \n\n### Environment\n- Browser: ${navigator.userAgent}\n- URL: ${location.href}`
		);
		return `${repoUrl}?title=${title}&body=${body}`;
	}

	function showErrorToast(error: Error | null, errorMessage: string) {
		const issueUrl = generateIssueUrl(errorMessage, error?.stack);
		toaster.error({
			title: errorMessage,
			action: {
				label: "Report Issue",
				onClick: () => window.open(issueUrl, "_blank")
			}
		});
	}

	// Catch global errors
	window.onerror = (message, source, lineno, colno, error) => {
		const errorMessage = `Global Error at ${source}:${lineno}:${colno}`;
		errorService.handleError(error || new Error(String(message)), errorMessage);
		showErrorToast(error as Error, errorMessage);
	};

	// Catch unhandled promise rejections
	window.addEventListener("unhandledrejection", event => {
		const errorMessage = "Unhandled Promise Rejection";
		errorService.handleError(event.reason || new Error(errorMessage), errorMessage);
		showErrorToast(null, errorMessage);
	});
</script>

<Toaster {toaster}></Toaster>

<style lang="postcss">
	:global(.toast-glow) {
		box-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
		border: 1px solid #38bdf8;
	}
</style>
