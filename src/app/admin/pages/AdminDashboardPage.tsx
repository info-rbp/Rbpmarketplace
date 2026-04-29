import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBusinesses, deleteBusiness } from '../../data/businessStore';
import {
  PlusCircle, Pencil, Trash2, Star, Package, ShoppingBag,
  BarChart2, AlertTriangle
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState(getAllBusinesses());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const standard = businesses.filter((b) => b.type === 'standard');
  const biab = businesses.filter((b) => b.type === 'business-in-a-box');
  const featured = businesses.filter((b) => b.featured);

  const handleDelete = (id: string) => {
    deleteBusiness(id);
    setBusinesses(getAllBusinesses());
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Listings', value: businesses.length, icon: BarChart2, color: 'blue' },
          { label: 'Businesses For Sale', value: standard.length, icon: ShoppingBag, color: 'purple' },
          { label: 'Business-In-A-Box', value: biab.length, icon: Package, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-100`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">All Listings</h2>
        <Link
          to="/admin/listings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Add Listing
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {businesses.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No listings yet</p>
            <p className="text-sm mt-1">Add your first listing to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-xs truncate">{b.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">/business/{b.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        b.type === 'business-in-a-box'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {b.type === 'business-in-a-box' ? <Package className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
                        {b.type === 'business-in-a-box' ? 'BIaB' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{b.category}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{b.price}</td>
                    <td className="px-6 py-4">
                      {b.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/business/${b.id}`, '_blank')}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => navigate(`/admin/listings/edit/${b.id}`)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(b.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Listing?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              This will permanently remove the listing{' '}
              <span className="font-semibold">
                "{businesses.find((b) => b.id === deleteConfirm)?.title}"
              </span>{' '}
              from the marketplace. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
