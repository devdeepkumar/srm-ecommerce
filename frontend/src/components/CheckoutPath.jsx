import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";

const CheckoutPath = ({ currentStep }) => {
  const steps = [
    { label: "Shipping", icon: LocalShippingIcon },
    { label: "Review", icon: CheckCircleIcon },
    { label: "Payment", icon: PaymentIcon },
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto my-8 px-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        const circleBg = isCompleted
          ? "bg-emerald-600 text-white"
          : isCurrent
          ? "bg-gray-900 text-white ring-4 ring-gray-100"
          : "bg-gray-100 text-gray-400";

        const labelClass = isCompleted
          ? "text-emerald-700 font-semibold"
          : isCurrent
          ? "text-gray-900 font-bold"
          : "text-gray-400 font-medium";

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            {/* Step Circle with Icon */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${circleBg}`}
            >
              <step.icon sx={{ fontSize: 18 }} />
            </div>

            {/* Step Label */}
            <span className={`mt-2 text-xs sm:text-sm tracking-wide ${labelClass}`}>
              {step.label}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 sm:top-5 left-1/2 w-full h-[2px] z-0 -translate-y-1/2 ${
                  isCompleted ? "bg-emerald-600" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutPath;
