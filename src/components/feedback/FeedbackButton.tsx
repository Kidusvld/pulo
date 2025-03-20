
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FeedbackForm } from "./FeedbackForm";

export const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-purple-700 text-sm font-medium animate-pulse">
        Share your thoughts with us!
      </div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            className="rounded-full h-14 w-14 shadow-lg bg-purple-600 hover:bg-purple-700 text-white"
            aria-label="Give feedback"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <div className="mt-6">
            <FeedbackForm onClose={() => setIsOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
