import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Clock,
  Eye,
  X,
  User,
  Heart,
  Stethoscope,
  IndianRupee,
} from 'lucide-react';
import { getAllAppointments } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const AllAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAllAppointments({
        status: statusFilter === 'All' ? undefined : statusFilter,
      });
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      a.pet?.name?.toLowerCase().includes(term) ||
      a.petOwner?.name?.toLowerCase().includes(term) ||
      a.provider?.user?.name?.toLowerCase().includes(term) ||
      a.service?.name?.toLowerCase().includes(term)
    );
  });

  const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Appointments Audit</h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete cross-system audit of all clinical, grooming, and training bookings.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search pet, owner, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Appointments Table */}
      {loading ? (
        <Loader message="Loading platform appointments audit log..." />
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Appointments Recorded</h3>
          <p className="text-xs text-slate-500 mt-1">No bookings match the selected status filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Pet & Owner</th>
                  <th className="py-3.5 px-4">Service Provider</th>
                  <th className="py-3.5 px-4">Service Offering</th>
                  <th className="py-3.5 px-4">Locked Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Date & Time */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {new Date(appt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {appt.time}
                      </div>
                    </td>

                    {/* Pet & Owner */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🐾 {appt.pet?.name || 'Pet'}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({appt.pet?.species})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Owner: <span className="font-semibold text-slate-700">{appt.petOwner?.name}</span>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {appt.provider?.user?.name || 'Provider'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {appt.provider?.providerType} • {appt.provider?.location}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{appt.service?.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {appt.service?.category} • {appt.service?.duration} mins
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-extrabold text-slate-900">₹{appt.price}</td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <Badge status={appt.status}>{appt.status}</Badge>
                    </td>

                    {/* Details Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAppointment(appt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        title="View Full Booking Info"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Booking Inspection */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Appointment Record</h3>
                <p className="text-xs text-slate-500">ID: {selectedAppointment._id}</p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status</span>
                <Badge status={selectedAppointment.status}>{selectedAppointment.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Scheduled Date</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedAppointment.date).toDateString()} at {selectedAppointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Locked Price</span>
                <span className="font-extrabold text-emerald-600 text-sm">₹{selectedAppointment.price}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800 uppercase tracking-wider">Patient & Client</p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p>
                  Pet: <span className="font-semibold text-slate-900">{selectedAppointment.pet?.name}</span> ({selectedAppointment.pet?.species} - {selectedAppointment.pet?.breed})
                </p>
                <p>
                  Owner: <span className="font-semibold text-slate-900">{selectedAppointment.petOwner?.name}</span> ({selectedAppointment.petOwner?.email})
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800 uppercase tracking-wider">Clinical Reason / Notes</p>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed font-medium">
                {selectedAppointment.reason || 'No clinical reason provided'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointmentsPage;
