type Props = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  total: number;
};

export default function ClientsToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  total,
}: Props) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-4 md:grid-cols-2 w-full lg:max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email or company"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          Found: <span className="font-semibold text-slate-900">{total}</span>
        </div>
      </div>
    </div>
  );
}