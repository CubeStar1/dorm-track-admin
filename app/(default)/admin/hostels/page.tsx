'use client';

import { HostelList } from '@/components/hostels/hostel-list';

export default function HostelsPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Hostels</h1>
        <p className="text-gray-500 mt-2">View and manage all hostels in your institution</p>
      </div>
      <HostelList />
    </div>
  );
} 