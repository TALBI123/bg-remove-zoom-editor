import "./alert.css";
import { motion } from "framer-motion";
import { useEffect } from "react";
export const Alert = ({ mess, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 1600);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <motion.div
      className="alert"
      initial={{ rotate: -10, scale: 0.5, opacity: 0.1 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ rotate: 10, scale: 0.5, opacity: 0.1 }}
      transition={{ duration: 1.4 }}
    >
      <h3>{mess}</h3>
    </motion.div>
  );
};
