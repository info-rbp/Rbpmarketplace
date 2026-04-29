import { AdminLayout } from '../components/AdminLayout';
import { ListingForm } from '../components/ListingForm';
import { addBusiness } from '../../data/businessStore';
import { Business } from '../../data/businesses';

export function AdminNewListingPage() {
  const handleSave = (business: Business) => {
    addBusiness(business);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Listing</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in all sections below. The listing will be published immediately on save.
        </p>
      </div>
      <ListingForm mode="create" onSave={handleSave} />
    </AdminLayout>
  );
}
