import { motion } from "framer-motion";

type HeaderVisualProps = {
  title: string;
  subtitle: string;
};

export function HeaderVisual({ title, subtitle }: HeaderVisualProps) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full rounded-2xl h-40 md:h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex flex-col items-center justify-center text-white shadow-xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-sm md:text-base text-white/80 mt-2 max-w-lg">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
