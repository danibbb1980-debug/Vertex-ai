import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "lumivo-painel:tema";

function stored(): Theme {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyStoredTheme(): void {
  document.documentElement.dataset.theme = stored();
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(stored);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0c1820" : "#f6f9f8");
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* sem armazenamento: vale só nesta sessão */
    }
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return [theme, toggle];
}
