import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";

interface FallbackProps {
  message?: string;
}

export const Fallback: React.FC<FallbackProps> = ({
  message = "The requested page not be found",
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <div
        className="relative p-12 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center"
        style={{
          background: "linear-gradient(135deg, #414593 0%, #00022E 100%)",
          backgroundBlendMode: "hard-light",
        }}
      >
        <div className="mb-6">
          <div className="text-6xl mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">Oops!</h1>
          <p className="text-gray-200 text-base mb-8">{message}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            label="Go Back"
            color="dangerText"
            onClick={handleGoBack}
            customStyle="w-full"
          />
          <Button
            label="Go to Home"
            color="secondary"
            onClick={handleGoHome}
            customStyle="w-full"
          />
        </div>

        <div className="mt-6 text-xs text-gray-300">
          Please navigate back or return to home page
        </div>
      </div>
    </div>
  );
};

export default Fallback;
