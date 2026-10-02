import React from 'react';

const Badge = ({ status, children, className = '' }) => {
  const value = children || status;

  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (value) {
    case 'Pending':
      badgeStyles = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'Confirmed':
      badgeStyles = 'bg-blue-50 text-blue-800 border-blue-300';
      break;
    case 'Approved':
      badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'Completed':
      badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'Cancelled':
      badgeStyles = 'bg-rose-50 text-rose-800 border-rose-300';
      break;
    case 'Rejected':
      badgeStyles = 'bg-red-50 text-red-800 border-red-300';
      break;
    case 'Suspended':
      badgeStyles = 'bg-slate-100 text-slate-700 border-slate-300';
      break;
    case 'PET_OWNER':
      badgeStyles = 'bg-teal-50 text-teal-700 border-teal-200';
      break;
    case 'SERVICE_PROVIDER':
      badgeStyles = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'ADMIN':
      badgeStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Active':
      badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Inactive':
      badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles} ${className}`}
    >
      {value}
    </span>
  );
};

export default Badge;
