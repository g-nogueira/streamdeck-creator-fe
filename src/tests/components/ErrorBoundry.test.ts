import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ErrorBoundary from "../../components/common/ErrorBoundry.svelte";

describe("ErrorBoundary Component", () => {
    let originalOnError: typeof window.onerror;
    let originalUnhandledRejection: typeof window.addEventListener;

    beforeEach(() => {
        // Mock global error handlers
        originalOnError = window.onerror;
        originalUnhandledRejection = window.addEventListener;
        window.onerror = vi.fn();
        window.addEventListener = vi.fn();
    });

    afterEach(() => {
        // Restore original handlers
        window.onerror = originalOnError;
        window.addEventListener = originalUnhandledRejection;
        vi.restoreAllMocks();
    });

    it("renders the Toaster component", () => {
        // Arrange & Act
        render(ErrorBoundary);

        // Assert
        expect(screen.getByText("Report Issue")).toBeInTheDocument();
    });

    it("handles global errors and shows a toast", () => {
        // Arrange
        const mockError = new Error("Test Error");
        const mockOnError = vi.fn();
        window.onerror = mockOnError;

        render(ErrorBoundary);

        // Act
        window.onerror("Test Error Message", "test.js", 10, 20, mockError);

        // Assert
        expect(mockOnError).toHaveBeenCalled();
        expect(screen.getByText("Global Error at test.js:10:20")).toBeInTheDocument();
    });

    it("handles unhandled promise rejections and shows a toast", () => {
        // Arrange
        const mockRejection = new Error("Unhandled Rejection");
        const mockUnhandledRejection = vi.fn();
        window.addEventListener = mockUnhandledRejection;

        render(ErrorBoundary);

        // Act
        window.dispatchEvent(
            new PromiseRejectionEvent("unhandledrejection", { reason: mockRejection })
        );

        // Assert
        expect(mockUnhandledRejection).toHaveBeenCalled();
        expect(screen.getByText("Unhandled Promise Rejection")).toBeInTheDocument();
    });

    it("generates a GitHub issue URL with error details", () => {
        // Arrange
        const errorMessage = "Test Error";
        const errorStack = "Error: Test Stack Trace";
        const expectedUrl = `https://github.com/g-nogueira/streamdeck-creator-fe/issues/new?title=Bug%20Report%3A%20Test%20Error&body=${encodeURIComponent(
            `### Error Details\n\n**Message:** Test Error\n\n**Stack Trace:**\n\`\`\`\nError: Test Stack Trace\n\`\`\`\n\n### Steps to Reproduce\n1. \n2. \n3. \n\n### Environment\n- Browser: ${navigator.userAgent}\n- URL: ${location.href}`
        )}`;

        render(ErrorBoundary);

        // Act
        const issueUrl = screen.getByText("Report Issue").getAttribute("href");

        // Assert
        expect(issueUrl).toBe(expectedUrl);
    });
});