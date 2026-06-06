// @ts-ignore: Falta @types/react en este entorno
import React from "react";
import { motion } from "motion/react";

/** Category model for the medical carousel */
export interface MedicalCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface MedicalCategoryCarouselProps {
  categories: MedicalCategory[];
  selectedCategory: string;
  onCategorySelected: (category: string) => void;
}

/** Premium horizontal category carousel overlaid on the map – Apple Maps / Uber style */
export default function MedicalCategoryCarousel({
  categories,
  selectedCategory,
  onCategorySelected,
}: MedicalCategoryCarouselProps) {
  return (
    <div
      className="medical-carousel-wrapper"
      style={{
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        padding: "0 16px",
      }}
    >
      {/* Hide scrollbar for WebKit */}
      <style>{`.medical-carousel-wrapper::-webkit-scrollbar { display: none; }`}</style>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "nowrap",
          alignItems: "center",
          minWidth: "max-content",
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              id={`btn-category-${cat.id}`}
              onClick={() => onCategorySelected(cat.id)}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: isSelected ? "rgba(235, 245, 255, 1)" : "rgba(255, 255, 255, 1)",
                borderColor: isSelected ? "rgba(147, 197, 253, 0.7)" : "rgba(226, 232, 240, 0.6)",
                boxShadow: isSelected
                  ? "0 4px 16px rgba(59, 130, 246, 0.12), 0 1px 4px rgba(59, 130, 246, 0.08)"
                  : "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)",
              }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "52px",
                padding: "0 20px",
                borderRadius: "24px",
                border: "1.5px solid",
                cursor: "pointer",
                flexShrink: 0,
                outline: "none",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              {/* Icon container */}
              <motion.span
                animate={{
                  color: isSelected ? "#2563eb" : "#64748b",
                }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  flexShrink: 0,
                }}
              >
                {cat.icon}
              </motion.span>

              {/* Label */}
              <motion.span
                animate={{
                  color: isSelected ? "#1d4ed8" : "#475569",
                }}
                transition={{ duration: 0.25 }}
                style={{
                  fontSize: "13.5px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                }}
              >
                {cat.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
