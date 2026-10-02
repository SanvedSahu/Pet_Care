import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPets, deletePet } from '../../services/petService';
import PetFormModal from '../../components/modals/PetFormModal';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { useToast } from '../../context/ToastContext';
import {
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  ShieldCheck,
  Heart,
  Scale,
  CalendarDays,
  Info,
} from 'lucide-react';

const MyPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // Delete confirmation
  const [petToDelete, setPetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const data = await getPets();
      setPets(data || []);
    } catch (err) {
      console.error('Failed to load pets:', err);
      error('Failed to load your pets.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedPet(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (pet) => {
    setSelectedPet(pet);
    setFormModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!petToDelete) return;
    try {
      setDeleting(true);
      await deletePet(petToDelete._id);
      success(`${petToDelete.name}'s profile was removed.`);
      setPetToDelete(null);
      loadPets();
    } catch (err) {
      error(err.message || 'Failed to delete pet');
    } finally {
      setDeleting(false);
    }
  };

  const getSpeciesEmoji = (species) => {
    switch (species?.toLowerCase()) {
      case 'dog':
        return '🐶';
      case 'cat':
        return '🐱';
      case 'rabbit':
        return '🐰';
      case 'bird':
        return '🦜';
      default:
        return '🐾';
    }
  };

  const getVaccineBadgeClass = (status) => {
    if (status === 'Up to Date') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status?.includes('Due') || status?.includes('Pending')) {
      return 'bg-amber-50 text-amber-800 border-amber-300';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  if (loading) {
    return <Loader message="Loading your pets..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Pets Portfolio ({pets.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain your pets' medical records, weight logs, and vaccination milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Pet</span>
        </button>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <EmptyState
          icon="🐾"
          title="No Pets Registered Yet"
          description="Register your dogs, cats, rabbits, or companions to maintain comprehensive medical history and schedule conflict-free specialist appointments."
          actionText="+ Register First Pet"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-2xl border border-emerald-200/60 shadow-inner">
                      {getSpeciesEmoji(pet.species)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 leading-tight">
                          {pet.name}
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                          {pet.gender}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {pet.breed || pet.species}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getVaccineBadgeClass(
                      pet.vaccinationStatus
                    )}`}
                  >
                    {pet.vaccinationStatus || 'Up to Date'}
                  </span>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl mb-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    <span>
                      <strong className="text-slate-900">{pet.age}</strong> Years Old
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-400" />
                    <span>
                      <strong className="text-slate-900">{pet.weight}</strong> kg Weight
                    </span>
                  </div>
                </div>

                {/* Medical Notes */}
                <div className="mb-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Medical & Dietary Notes
                  </span>
                  <p className="text-xs text-slate-600 bg-slate-50/70 border border-slate-100 p-3 rounded-2xl leading-relaxed font-medium line-clamp-3">
                    {pet.medicalNotes || 'No known clinical conditions, allergies, or chronic notes.'}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/marketplace"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Visit
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(pet)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPetToDelete(pet)}
                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Remove Pet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Pet Modal */}
      <PetFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        pet={selectedPet}
        onSaved={loadPets}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!petToDelete}
        onClose={() => setPetToDelete(null)}
        title="Remove Pet Profile"
        subtitle="This action cannot be undone"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete <strong>{petToDelete?.name}</strong>'s medical
            profile and records?
          </p>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setPetToDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
            >
              {deleting ? 'Removing...' : 'Yes, Delete Profile'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPetsPage;
