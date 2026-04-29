import { useParams, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { ListingForm } from '../components/ListingForm';
import { getBusinessById, updateBusiness } from '../../data/businessStore';
import { Business } from '../../data/businesses';

export function AdminEditListingPage() {
  const { id } = useParams<{ id: string }>();
  const business = id ? getBusinessById(id) : undefined;

  if (!business) return <Navigate to="/admin" replace />;

  const handleSave = (updated: Business) => {
    updateBusiness(business.id, updated);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Listing</h2>
        <p className="text-sm text-gray-500 mt-1">
          Editing: <span className="font-semibold text-gray-700">{business.title}</span>
        </p>
      </div>
      <ListingForm mode="edit" initial={business} onSave={handleSave} />
    </AdminLayout>
  );
}
