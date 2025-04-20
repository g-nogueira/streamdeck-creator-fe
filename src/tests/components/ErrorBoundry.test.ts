import { render, waitFor } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance, type Mock } from "vitest";
import ErrorBoundry from "../../components/common/ErrorBoundry.svelte";
import { ErrorService } from "$lib/services/error.service";
import * as skeletonSvelte from "@skeletonlabs/skeleton-svelte";

// Mock the skeleton-svelte toaster
vi.mock("@skeletonlabs/skeleton-svelte", () => ({
    createToaster: vi.fn(() => ({
        error: vi.fn()
    })),
    Toaster: vi.fn()
}));

describe("ErrorBoundry", () => {
    let errorService: ErrorService;
    let handleErrorSpy: MockInstance;
    let mockToaster: { error: Mock };
    let windowSpy: any;

    beforeEach(() => {
        // Setup error service spy
        errorService = ErrorService.getInstance();
        handleErrorSpy = vi.spyOn(errorService, "handleError");

        // Setup toaster spy
        mockToaster = {
            error: vi.fn()
        };
        (skeletonSvelte.createToaster as Mock).mockReturnValue(mockToaster);

        // Store original window.open
        windowSpy = vi.spyOn(window, "open");
        windowSpy.mockImplementation(() => {});
    });

    afterEach(() => {
        vi.clearAllMocks();
        window.onerror = null;
        window.onunhandledrejection = null;
        windowSpy.mockRestore();
    });

    it("should render without errors", () => {
        const { container } = render(ErrorBoundry);
        expect(container).toBeTruthy();
    });

    it("should handle global errors", () => {
        // Arrange
        render(ErrorBoundry);
        
        // Act
        const errorEvent = new Error("Test error");
        window.onerror("Test error", "test.js", 1, 1, errorEvent);

        // Assert
        expect(handleErrorSpy).toHaveBeenCalledWith(
            errorEvent,
            "Global Error at test.js:1:1"
        );
        expect(mockToaster.error).toHaveBeenCalled();
    });

    it("should handle unhandled promise rejections", async () => {
        // Arrange
        render(ErrorBoundry);
        const error = new Error("Promise rejection");
        
        // Create a rejected promise that we handle right away
        const rejectedPromise = Promise.reject(error).catch(() => {});
        
        // Act - create a custom event with the required properties
        const event = new CustomEvent("unhandledrejection") as any;
        event.reason = error;
        event.promise = rejectedPromise;
        
        window.dispatchEvent(event);

        // Assert - wait for the async operations to complete
        await waitFor(() => {
            expect(handleErrorSpy).toHaveBeenCalledWith(
                error,
                "Unhandled Promise Rejection"
            );
            expect(mockToaster.error).toHaveBeenCalled();
        });
    });

    it("should generate correct GitHub issue URL", () => {
        // Arrange
        render(ErrorBoundry);
        
        // Act
        const error = new Error("Test error");
        error.stack = "Error: Test error\n    at test.js:1:1";
        window.onerror("Test error", "test.js", 1, 1, error);

        // Assert
        const toasterCall = mockToaster.error.mock.calls[0][0];
        expect(toasterCall.action).toBeDefined();
        expect(toasterCall.action.label).toBe("Report Issue");
        
        // Simulate clicking the "Report Issue" button
        toasterCall.action.onClick();

        expect(windowSpy).toHaveBeenCalledWith(
            expect.stringContaining("https://github.com/g-nogueira/streamdeck-creator-fe/issues/new"),
            "_blank"
        );
        expect(windowSpy).toHaveBeenCalledWith(
            expect.stringContaining(encodeURIComponent("Test error")),
            "_blank"
        );
    });

    it("should show error toast with report action", () => {
        // Arrange
        render(ErrorBoundry);
        
        // Act
        window.onerror("Test error", "test.js", 1, 1, new Error("Test error"));

        // Assert
        expect(mockToaster.error).toHaveBeenCalledWith(
            expect.objectContaining({
                title: expect.any(String),
                action: expect.objectContaining({
                    label: "Report Issue",
                    onClick: expect.any(Function)
                })
            })
        );
    });
});