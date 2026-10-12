import type { ReactNode } from 'react';
import './globals.css';

// The <html> element is rendered by app/[locale]/layout.tsx so that `lang` and
// `dir` always match the active language.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
