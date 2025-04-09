import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import { expect, vi, describe, beforeEach, it } from "vitest";

vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          range: vi.fn(() =>
            Promise.resolve({
              data: [
                {
                  id: "1",
                  title: "Test Post",
                  slug: "test-post",
                  content: "Test content",
                  image_url: "https://example.com/image.jpg",
                  created_at: "2024-01-01T00:00:00Z",
                  categories: {
                    name: "Test Category",
                    slug: "test-category",
                  },
                },
              ],
              error: null,
            })
          ),
        })),
      })),
      count: vi.fn(() => Promise.resolve({ count: 1, error: null })),
    })),
  },
}));

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders posts after loading", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Post")).toBeInTheDocument();
      expect(screen.getByText("Test Category")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });
  });

  it("displays pagination controls", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });
  });
});
