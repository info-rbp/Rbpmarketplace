import { categories } from '@/app/data/categories';
import type { BuildPriority, BusinessComplexity, CategoryId, RevenueSpeed } from '@/app/data/types';
import type { SortMode } from '@/app/lib/business';

interface FilterBarProps {
  category: CategoryId | 'all';
  complexity: BusinessComplexity | 'all';
  revenueSpeed: RevenueSpeed | 'all';
  priority: BuildPriority | 'all';
  sort: SortMode;
  onCategoryChange: (value: CategoryId | 'all') => void;
  onComplexityChange: (value: BusinessComplexity | 'all') => void;
  onRevenueSpeedChange: (value: RevenueSpeed | 'all') => void;
  onPriorityChange: (value: BuildPriority | 'all') => void;
  onSortChange: (value: SortMode) => void;
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function FilterBar(props: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-5">
      <SelectField
        value={props.category}
        onChange={(value) => props.onCategoryChange(value as CategoryId | 'all')}
        options={[
          { label: 'All categories', value: 'all' },
          ...categories.map((category) => ({ label: category.name, value: category.id })),
        ]}
      />
      <SelectField
        value={props.complexity}
        onChange={(value) => props.onComplexityChange(value as BusinessComplexity | 'all')}
        options={[
          { label: 'All setup levels', value: 'all' },
          { label: 'Low setup', value: 'Low' },
          { label: 'Medium setup', value: 'Medium' },
          { label: 'High setup', value: 'High' },
        ]}
      />
      <SelectField
        value={props.revenueSpeed}
        onChange={(value) => props.onRevenueSpeedChange(value as RevenueSpeed | 'all')}
        options={[
          { label: 'All revenue speed', value: 'all' },
          { label: 'Fast revenue', value: 'Fast' },
          { label: 'Medium revenue', value: 'Medium' },
          { label: 'Slow revenue', value: 'Slow' },
        ]}
      />
      <SelectField
        value={props.priority}
        onChange={(value) => props.onPriorityChange(value as BuildPriority | 'all')}
        options={[
          { label: 'All sales fit', value: 'all' },
          { label: 'High sales fit', value: 'High' },
          { label: 'Medium sales fit', value: 'Medium' },
          { label: 'Low sales fit', value: 'Low' },
        ]}
      />
      <SelectField
        value={props.sort}
        onChange={(value) => props.onSortChange(value as SortMode)}
        options={[
          { label: 'Priority first', value: 'priority' },
          { label: 'Fastest revenue', value: 'revenue-speed' },
          { label: 'Lowest complexity', value: 'complexity' },
          { label: 'Alphabetical', value: 'alphabetical' },
        ]}
      />
    </div>
  );
}