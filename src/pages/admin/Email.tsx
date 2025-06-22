import React from 'react';
import EmailTab from '@/components/EmailTab';

export default function EmailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your Gmail account and communicate with customers directly from your dashboard
        </p>
      </div>
      <EmailTab />
    </div>
  );
} 