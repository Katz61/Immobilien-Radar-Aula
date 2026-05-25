import { useStore } from '../../store/useStore';

export function Toast() {
  const message = useStore((s) => s.toastMessage);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] bg-surface2 border border-accent/20 text-text px-5 py-3 rounded-sm text-sm animate-toast">
      {message}
    </div>
  );
}
