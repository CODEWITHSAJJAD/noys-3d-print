'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { FullScreenLoader } from '@/components/ui/Loader';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowModal(true);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Modal 
        isOpen={showModal} 
        onClose={() => router.push('/')}
        title="Authentication Required"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <p className="text-gray-600">
            You must be logged in to access the <span className="font-bold text-gray-800">{pathname}</span> page.
          </p>
          <div className="w-full h-[1px] bg-gray-100 my-2"></div>
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Sign In Now
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </div>
      </Modal>
    );
  }

  return <>{children}</>;
}
