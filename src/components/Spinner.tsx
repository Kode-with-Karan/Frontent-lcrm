
const Spinner = ({ size = 44.8 }) => {
  const half = size / 2;

  return (
    <>
      <style>{`
        @keyframes spinner-y0fdc1 {
          0% {
            transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
          }
          50% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
          }
          100% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
          }
        }
      `}</style>

      <div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: size,
          height: size,
          animation: "spinner-y0fdc1 2s infinite ease",
        }}
      >
        <div
          className="absolute inset-0  border border-[#7122c4]"
          style={{
            borderWidth: size * 0.0491,
            transform: `translateZ(-${half}px) rotateY(180deg)`,
          }}
        />
        <div
          className="absolute inset-0  border border-[#7122c4]"
          style={{
            borderWidth: size * 0.0491,
            transform: `rotateY(-270deg) translateX(50%)`,
            transformOrigin: "top right",
          }}
        />
        <div
          className="absolute inset-0  border border-[#7122c4]"
          style={{
            borderWidth: size * 0.0491,
            transform: `rotateY(270deg) translateX(-50%)`,
            transformOrigin: "center left",
          }}
        />
        <div
          className="absolute inset-0  border border-[#7122c4]"
          style={{
            borderWidth: size * 0.0491,
            transform: `rotateX(90deg) translateY(-50%)`,
            transformOrigin: "top center",
          }}
        />
        <div
          className="absolute inset-0  border border-[#7122c4]"
          style={{
            borderWidth: size * 0.0491,
            transform: `rotateX(-90deg) translateY(50%)`,
            transformOrigin: "bottom center",
          }}
        />
        <div
          className="absolute inset-0  border border-[#7122c4]"
          style={{
            borderWidth: size * 0.0491,
            transform: `translateZ(${half}px)`,
          }}
        />
      </div>
    </>
  );
};

export default Spinner;
