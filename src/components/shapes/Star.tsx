type StarProps = {
  fill?: string;
  opacity?: number;
};

export const Star = ({fill = "#FBBF24", opacity = 1}: StarProps) => {
  return (
    <path
      d="M50 12 60 35 85 37 66 54 72 79 50 66 28 79 34 54 15 37 40 35Z"
      fill={fill}
      opacity={opacity}
    />
  );
};
