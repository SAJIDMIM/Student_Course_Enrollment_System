import React from "react";

const GlassLayout = ({ children, title, subtitle, icon, fullWidth = false }) => {
  // If fullWidth is true, render dashboard layout (no card)
  if (fullWidth) {
    return (
      <div
        className="min-h-screen px-6 py-8"
        style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
      >
        <div className="mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {icon && (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                style={{ background: "rgba(52, 31, 151, 0.6)" }}
              >
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-gray-300">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Content - No card constraints */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Default: Card view for Login and other pages
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
    >
      <div
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col transition-all duration-300"
        style={{
          backgroundColor: "rgba(52, 31, 151, 0.3)",
          borderColor: "rgba(255,255,255,0.2)",
        }}
      >
        {/* Header */}
        {title && (
          <div className="flex flex-col items-center mb-8">
            {icon && (
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                style={{ background: "rgba(52, 31, 151, 0.6)" }}
              >
                {icon}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-300 text-center">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default GlassLayout;