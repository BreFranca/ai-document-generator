import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "@/lib/auth";
import Login from "@/pages/Login";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login", () => {
  const mockSignIn = vi.fn();

  const renderLogin = (
    user: { id: string; email: string; is_admin: boolean } | null = null
  ) => {
    return render(
      <AuthContext.Provider
        value={{ user, loading: false, signIn: mockSignIn, signOut: vi.fn() }}
      >
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    mockSignIn.mockClear();
    mockNavigate.mockClear();
  });

  it("renders login form", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("validates email format", async () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("validates password length", async () => {
    renderLogin();
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("handles successful login", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });
  });

  it("handles login error", async () => {
    mockSignIn.mockRejectedValueOnce({ message: "Invalid login credentials" });
    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/invalid email or password/i)
    ).toBeInTheDocument();
  });

  it("redirects to admin if user is already logged in as admin", () => {
    renderLogin({ id: "1", email: "admin@example.com", is_admin: true });
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });
});
