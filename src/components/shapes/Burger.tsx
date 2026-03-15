type BurgerProps = {
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const Burger = ({opacity = 1, drawProgress = 1}: BurgerProps) => {
  // drawProgress is intentionally unused for the burger itself.
  // Steam is rendered as a separate `steam` effect element for better control.
  void drawProgress;

  return (
    <>
      {/* Bottom bun */}
      <rect x="26" y="68" width="48" height="14" rx="7" fill="#B45309" opacity={opacity} />
      {/* Patty */}
      <rect x="28" y="60" width="44" height="10" rx="5" fill="#78350F" opacity={opacity} />
      {/* Cheese */}
      <path
        d="M28 58h44l-6 8H34l-6-8Z"
        fill="#FBBF24"
        opacity={opacity}
      />
      {/* Tomato */}
      <rect x="28" y="52" width="44" height="8" rx="4" fill="#EF4444" opacity={opacity} />
      {/* Lettuce */}
      <path
        d="M28 50c6 4 10 0 16 4s10 0 16 4 10 0 12-2v4H28v-10Z"
        fill="#16A34A"
        opacity={opacity}
      />
      {/* Top bun */}
      <rect x="26" y="34" width="48" height="18" rx="9" fill="#D97706" opacity={opacity} />
    </>
  );
};
