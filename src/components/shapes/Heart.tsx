type HeartProps = {
  fill?: string;
  opacity?: number;
};

export const Heart = ({fill = "#FF2D55", opacity = 1}: HeartProps) => {
  return (
    <path
      d="M50 90 18 60C8 50 6 35 13 24c8-12 25-15 37-5 12-10 29-7 37 5 7 11 5 26-5 36L50 90Z"
      fill={fill}
      opacity={opacity}
    />
  );
};
