"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useProModal } from "@/hooks/use-pro-model";
import { Badge } from "./ui/badge";

export const ProModal = () => {

    const proModal = useProModal();

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className=" flex justify-center items-center flex-col gap-y-4 pb-2">
                    <div className=" flex items-center gap-x-2 font-bold py-1">
                        Upgrade to AI-TroniX
                        <Badge variant='premium' className=" uppercase text-sm py-1">Pro</Badge>
                    </div>

                    <div>
                        <p className=" text-center text-sm text-muted-foreground">
                            Chal bahot free ka maal use kr liya ab paisa de.
                        </p>
                    </div>
                </DialogTitle>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
