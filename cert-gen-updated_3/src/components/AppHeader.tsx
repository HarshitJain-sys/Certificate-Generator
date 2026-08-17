import { Moon, Sun } from "lucide-react";
import acmLogo from "../assets/acm-logo.jpg";

interface AppHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function AppHeader({ isDark, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <img src={acmLogo} alt="ACM DPGU" className="h-10 w-10 object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Letterpress</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pixel To Prototype Certificate</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="rounded-lg border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
