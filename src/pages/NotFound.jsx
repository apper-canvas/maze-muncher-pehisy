import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const GhostIcon = getIcon('Ghost');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center"
    >
      <div className="flex items-center justify-center mb-8">
        <GhostIcon className="w-16 h-16 md:w-24 md:h-24 text-secondary animate-pulse" />
        <GhostIcon className="w-16 h-16 md:w-24 md:h-24 text-accent animate-pulse-slow mx-4" />
        <GhostIcon className="w-16 h-16 md:w-24 md:h-24 text-primary animate-pulse" />
      </div>
      
      <h1 className="text-3xl md:text-5xl font-heading text-primary mb-4 neon-text">
        Game Over
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 text-white">
        The page you're looking for was eaten by ghosts.
      </p>
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/" className="arcade-btn flex items-center gap-2">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Return Home</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default NotFound;