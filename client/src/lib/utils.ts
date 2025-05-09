import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRiskLevelColor(level: string): string {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'verified':
    case 'active':
    case 'passed':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'in-progress':
    case 'under-review':
    case 'issues found':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
    case 'inactive':
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
    case 'normal':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'U';
  
  const firstInitial = firstName?.[0] || '';
  const lastInitial = lastName?.[0] || '';
  
  return (firstInitial + lastInitial).toUpperCase();
}
