import type { BusinessConcept } from '@/app/data/types';
import { getCategoryName } from '@/app/lib/business';

interface ComparisonTableProps {
  businesses: BusinessConcept[];
}

const rows = [
  {
    label: 'Category',
    render: (business: BusinessConcept) => getCategoryName(business.category),
  },
  {
    label: 'Priority',
    render: (business: BusinessConcept) => business.priority,
  },
  {
    label: 'Complexity',
    render: (business: BusinessConcept) => business.complexity,
  },
  {
    label: 'Revenue speed',
    render: (business: BusinessConcept) => business.revenueSpeed,
  },
  {
    label: 'Target customers',
    render: (business: BusinessConcept) => business.targetCustomers.join(', '),
  },
  {
    label: 'Revenue models',
    render: (business: BusinessConcept) => business.revenueModels.join(', '),
  },
  {
    label: 'Products to sell',
    render: (business: BusinessConcept) => business.productsToSell.join(', '),
  },
  {
    label: 'What can be included',
    render: (business: BusinessConcept) => business.coreFeatures.join(', '),
  },
];

export function ComparisonTable({ businesses }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-5 py-4 font-semibold text-slate-700">Criteria</th>
            {businesses.map((business) => (
              <th key={business.slug} className="min-w-[260px] px-5 py-4 font-semibold text-slate-900">
                {business.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100 align-top">
              <td className="px-5 py-4 font-medium text-slate-600">{row.label}</td>
              {businesses.map((business) => (
                <td key={`${row.label}-${business.slug}`} className="px-5 py-4 leading-6 text-slate-700">
                  {row.render(business)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}