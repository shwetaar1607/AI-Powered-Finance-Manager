import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignIn from "../pages/SignIn";
import * as authService from "../services/authService";
import { vi } from "vitest";

// Mock localStorage
vi.mock("../services/localStorage", () => ({
  saveUserInfo: vi.fn(),
}));

// Mock navigate
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock auth service
vi.mock("../services/authService");

describe("SignIn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders SignIn form", () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("updates form input values correctly", () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    expect(screen.getByLabelText("Email").value).toBe("test@example.com");
    expect(screen.getByLabelText("Password").value).toBe("password123");
  });

  it("shows loading state when form is submitting", async () => {
    authService.signIn.mockImplementation(() => new Promise(() => {})); // stays pending

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /signing in/i })
      ).toBeInTheDocument();
    });
  });

  it("navigates to dashboard on successful sign-in", async () => {
    authService.signIn.mockResolvedValue({
      data: { id: 1, name: "Test User", email: "test@example.com" },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("displays error message on sign-in failure", async () => {
    authService.signIn.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
