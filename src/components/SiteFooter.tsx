export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-ink">flippie</p>
          <p>Buying and reselling phones and tablets across Europe.</p>
        </div>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} flippie. All rights reserved.</p>
      </div>
    </footer>
  );
}
