"use client";

import { motion } from "framer-motion";

const InvestmentScoreRing = ({ score }: { score: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor = score > 80 ? "hsl(var(--accent))" : score > 60 ? "hsl(var(--primary))" : "hsl(39, 91%, 55%)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
      <svg className="absolute top-0 left-0" width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="8"
          fill="transparent"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={scoreColor}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "circOut" }}
        />
      </svg>
      <motion.div
        className="text-3xl font-bold font-headline"
        style={{ color: scoreColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {score}
      </motion.div>
    </div>
  );
};

export default InvestmentScoreRing;
