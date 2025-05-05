import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";

const ErrorState = ({ error, darkMode }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`p-4 rounded-md ${
          darkMode ? "bg-red-900/30" : "bg-red-100"
        } ${
          darkMode ? "text-red-200" : "text-red-700"
        } text-center transition-colors duration-300`}
      >
        <h2 className="text-xl font-bold mb-2">خطأ</h2>
        <p>{error || "لم يتم العثور على الحرفي"}</p>
        <Button
          onClick={() => navigate(-1)}
          className="mt-4"
          variant="secondary"
        >
          العودة
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
