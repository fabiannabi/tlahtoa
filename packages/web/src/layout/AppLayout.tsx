import type { ReactNode } from 'react';

interface AppLayoutProps {
  header: ReactNode;
  left:   ReactNode;
  board:  ReactNode;
  right:  ReactNode;
}

export function AppLayout({ header, left, board, right }: AppLayoutProps) {
  return (
    <div className="app-grid">
      <div className="area-header">{header}</div>
      <aside className="area-left">{left}</aside>
      <main className="area-board">{board}</main>
      <aside className="area-right">{right}</aside>
    </div>
  );
}
