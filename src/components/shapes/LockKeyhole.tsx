type LockKeyholeProps = {
  fill?: string;
  opacity?: number;
};

export const LockKeyhole = ({fill = "#1E293B", opacity = 1}: LockKeyholeProps) => {
  return (
    <>
      <circle cx="50" cy="66" r="4" fill={fill} opacity={opacity} />
      <rect x="48.5" y="70" width="3" height="9" rx="1.5" fill={fill} opacity={opacity} />
    </>
  );
};

