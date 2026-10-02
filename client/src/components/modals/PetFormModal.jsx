import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { createPet, updatePet } from '../../services/petService';
import { useToast } from '../../context/ToastContext';
import { HeartHandshake, Loader2 } from 'lucide-react';

const PetFormModal = ({ isOpen, onClose, pet, onSaved }) => {
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    age: '',
    weight: '',
    vaccinationStatus: 'Up to Date',
    medicalNotes: '',
    image: '',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        gender: pet.gender || 'Male',
        age: pet.age !== undefined ? pet.age : '',
        weight: pet.weight !== undefined ? pet.weight : '',
        vaccinationStatus: pet.vaccinationStatus || 'Up to Date',
        medicalNotes: pet.medicalNotes || '',
        image: pet.image || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [pet, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Pet name is required');
      return;
    }
    if (formData.age === '' || Number(formData.age) < 0) {
      error('Please enter a valid age');
      return;
    }
    if (formData.weight === '' || Number(formData.weight) <= 0) {
      error('Please enter a valid weight in kg');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
      };

      if (pet?._id) {
        await updatePet(pet._id, payload);
        success(`${formData.name}'s medical profile was updated!`);
      } else {
        await createPet(payload);
        success(`${formData.name} was added to your family!`);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to save pet profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pet ? `Edit ${pet.name}'s Profile` : 'Register a New Pet'}
      subtitle="Complete your companion's clinical and identification details"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name and Species */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pet Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Max, Bella, Milo"
              required
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Species <span className="text-rose-500">*</span>
            </label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="Dog">Dog 🐶</option>
              <option value="Cat">Cat 🐱</option>
              <option value="Rabbit">Rabbit 🐰</option>
              <option value="Bird">Bird 🦜</option>
              <option value="Other">Other 🐾</option>
            </select>
          </div>
        </div>

        {/* Breed and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Breed</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="e.g. Golden Retriever, Persian"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="Male">Male ♂</option>
              <option value="Female">Female ♀</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>

        {/* Age and Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              min="0"
              max="40"
              step="0.5"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 3"
              required
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Weight (kg) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="weight"
              min="0.1"
              max="200"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. 12.5"
              required
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Vaccination Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Vaccination Status
          </label>
          <select
            name="vaccinationStatus"
            value={formData.vaccinationStatus}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
          >
            <option value="Up to Date">Up to Date (Protected) 🟢</option>
            <option value="Pending / Due Soon">Due Soon / Booster Needed 🟡</option>
            <option value="Not Vaccinated">Not Vaccinated 🔴</option>
          </select>
        </div>

        {/* Medical Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Medical History, Allergies & Dietary Notes
          </label>
          <textarea
            name="medicalNotes"
            rows="3"
            value={formData.medicalNotes}
            onChange={handleChange}
            placeholder="e.g. Allergic to chicken meal, sensitive stomach, afraid of loud blow-dryers..."
            className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
          />
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{pet ? 'Save Changes' : 'Add Pet Profile'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PetFormModal;
