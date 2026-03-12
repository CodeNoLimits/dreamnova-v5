import type { Transition, Variants } from "framer-motion";

export const easeOut = "easeOut" as const;
export const easeInOut = "easeInOut" as const;
export const linear = "linear" as const;

export const fadeUpTransition = (delay = 0): Transition => ({
  duration: 0.5,
  delay,
  ease: easeOut,
});

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: fadeUpTransition(delay),
  }),
};

export const staggerFadeUp = (i: number): Transition => ({
  duration: 0.5,
  delay: i * 0.1,
  ease: easeOut,
});
