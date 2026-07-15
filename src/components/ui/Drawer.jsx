import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Drawer — right-side slide-in panel with backdrop
 *
 * Props:
 *   open       boolean    — visibility
 *   onClose    function   — close handler
 *   title      string     — header title
 *   subtitle   string     — header subtitle
 *   width      string     — tailwind width class (default 'max-w-md')
 *   children   ReactNode  — drawer body
 *   footer     ReactNode  — optional sticky footer (e.g. action buttons)
 */
export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  width = 'max-w-md',
  children,
  footer,
}) {
  // Close on ESC key + lock body scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative flex h-full w-full ${width} flex-col bg-white shadow-2xl`}
        role="dialog"
        aria-modal="true"
      >
        {/* ---- Header ---- */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div className="min-w-0">
            <h2
              className="text-lg font-bold text-[#15201F]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-[#5A6968]">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---- Body (scrollable) ---- */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* ---- Footer (sticky) ---- */}
        {footer && <div className="border-t border-gray-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
