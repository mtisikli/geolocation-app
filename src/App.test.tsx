import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders the header", () => {
  render(<App />);
  const header = screen.getByText(/Geolocation App/i);
  expect(header).toBeInTheDocument();
});
