import { useState } from "react";
import { motion } from "framer-motion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FeedbackForm } from "./FeedbackForm";
export const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  return <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <motion.div className="relative cursor-pointer flex items-center" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} role="button" aria-label="Give feedback">
            {/* Glow effect on hover */}
            {isHovered && <div className="absolute inset-0 rounded-full bg-purple-500 blur-lg opacity-30 -z-10"></div>}
            
            {/* Speech bubble - now positioned to the left of the image */}
            <motion.div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md text-purple-700 text-sm font-medium mr-3" initial={{
            opacity: 0,
            scale: 0.8,
            x: 10
          }} animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
              delay: 0.2
            }
          }}>
              <div className="absolute top-1/2 right-[-6px] w-3 h-3 rotate-45 transform -translate-y-1/2 bg-purple-300 rounded-3xl"></div>
              Share your thoughts with PULO!
            </motion.div>
            
            {/* PULO Image */}
            <motion.img src="/lovable-uploads/f5173d59-6e7e-4c77-935d-c2473fcbcbae.png" alt="PULO wants your feedback" className="h-24 w-auto" animate={{
            y: isHovered ? -5 : 0
          }} transition={{
            type: "spring",
            stiffness: 300
          }} />
          </motion.div>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <div className="mt-6">
            <FeedbackForm onClose={() => setIsOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>;
};