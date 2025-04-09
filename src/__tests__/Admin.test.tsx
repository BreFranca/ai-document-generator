import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Admin from "@/pages/Admin";
import { expect, vi, describe, beforeEach, it } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

describe("Admin", () => {
  const adminUser = { id: "1", email: "admin@example.com", is_admin: true };

  const renderAdmin = (user: typeof adminUser | null = adminUser) => {
    return render(
      <AuthContext.Provider
        value={{ user, loading: false, signIn: vi.fn(), signOut: vi.fn() }}
      >
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  it("redirects to login if user is not authenticated", () => {
    renderAdmin(null);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders admin dashboard for admin users", async () => {
    renderAdmin();
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Create New Post")).toBeInTheDocument();
  });

  it("handles post creation", async () => {
    renderAdmin();

    const titleInput = screen.getByLabelText(/title/i);
    const createButton = screen.getByRole("button", { name: /create/i });

    fireEvent.change(titleInput, { target: { value: "Test Post" } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("posts");
    });
  });
});
