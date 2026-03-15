type PinProps = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
};

export const Pin = ({
  fill = "#EF4444",
  stroke = "#B91C1C",
  strokeWidth = 4,
  opacity = 1,
}: PinProps) => {
  return (
    <>
      <path
        d="M50 88C50 88 24 58 24 39c0-14 12-25 26-25s26 11 26 25C76 58 50 88 50 88Z"
        fill={fill}
        stroke={stroke}
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      <circle cx="50" cy="39" r="10" fill="#FFFFFF" opacity={opacity} />
    </>
  );
};
