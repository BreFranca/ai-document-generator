import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Post from "@/pages/Post";
import { expect, vi, describe, beforeEach, it } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ slug: "test-post" }),
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
                title: "Test Post",
                content: "Test content",
                image_url: "https://example.com/image.jpg",
                created_at: "2024-01-01T00:00:00Z",
                categories: {
                  name: "Test Category",
                  slug: "test-category",
                },
              },
              error: null,
            })
          ),
        })),
      })),
    })),
  },
}));

describe("Post", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <Post />
      </BrowserRouter>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders post content after loading", async () => {
    render(
      <BrowserRouter>
        <Post />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Post")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
      expect(screen.getByText("Test Category")).toBeInTheDocument();
    });
  });

  it("displays formatted date", async () => {
    render(
      <BrowserRouter>
        <Post />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("January 1, 2024")).toBeInTheDocument();
    });
  });

  it("displays post image", async () => {
    render(
      <BrowserRouter>
        <Post />
      </BrowserRouter>
    );

    await waitFor(() => {
      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
      expect(image).toHaveAttribute("alt", "Test Post");
    });
  });
});
