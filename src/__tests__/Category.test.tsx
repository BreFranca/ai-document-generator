import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Category from "@/pages/Category";
import { expect, vi, describe, beforeEach, it } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ slug: "test-category" }),
  };
});

vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: {
                id: "1",
                name: "Test Category",
                slug: "test-category",
              },
              error: null,
            })
          ),
        })),
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

describe("Category", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <Category />
      </BrowserRouter>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders category and posts after loading", async () => {
    render(
      <BrowserRouter>
        <Category />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Category")).toBeInTheDocument();
      expect(screen.getByText("Test Post")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });
  });

  it("displays pagination controls", async () => {
    render(
      <BrowserRouter>
        <Category />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });
  });
});
