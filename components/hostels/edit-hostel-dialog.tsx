'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EditHostelForm } from './edit-hostel-form';
import { HostelForm } from './hostel-form';
import { Hostel } from '@/lib/api/services/hostels';

interface EditHostelDialogProps {
  hostel: Hostel; // Make hostel required since this is edit-only now
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditHostelDialog({ 
  hostel, 
  open, 
  onOpenChange,
  onSuccess 
}: EditHostelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hostel</DialogTitle>
          <DialogDescription>
            Update the hostel information below
          </DialogDescription>
        </DialogHeader>
        <EditHostelForm 
          hostel={hostel}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 