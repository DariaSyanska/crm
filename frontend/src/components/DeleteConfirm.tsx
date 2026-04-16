type Props = {
  title: string;
  description: string;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirm({
  title,
  description,
  confirmText = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-600 mt-3">{description}</p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
        >
          {loading ? "Deleting..." : confirmText}
        </button>
      </div>
    </div>
  );
}