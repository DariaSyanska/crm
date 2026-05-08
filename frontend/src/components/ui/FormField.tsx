type FormFieldProps = {
  label?: string;
  error?: string;
  children: React.ReactNode;
};

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}

      {children}

      {error ? (
        <p className="text-sm font-medium text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
