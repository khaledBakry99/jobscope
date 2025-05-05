import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import LoadingButton from "../common/LoadingButton";
import useThemeStore from "../../store/themeStore";

const GoogleAccountSelector = ({ onSelect, onCancel }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // حسابات Google الوهمية للاختيار
  const mockAccounts = [
    {
      id: "g-12345",
      name: "رامي سعيد",
      email: "rami@gmail.com",
      picture: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      id: "g-67890",
      name: "محمود علي",
      email: "mahmoud@gmail.com",
      picture: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: "g-24680",
      name: "سارة أحمد",
      email: "sara@gmail.com",
      picture: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleContinue = () => {
    if (!selectedAccount) return;
    
    setIsLoading(true);
    
    // محاكاة تأخير الشبكة
    setTimeout(() => {
      onSelect(selectedAccount);
      setIsLoading(false);
    }, 1000);
  };

  const handleAddAccount = () => {
    // محاكاة إضافة حساب جديد
    const newAccount = {
      id: "g-" + Math.random().toString(36).substring(2),
      name: "مستخدم جديد",
      email: "new.user@gmail.com",
      picture: "https://randomuser.me/api/portraits/men/22.jpg",
    };
    
    setSelectedAccount(newAccount);
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
      <div className="text-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="75"
          height="24"
          viewBox="0 0 75 24"
          className="mx-auto mb-4"
        >
          <path
            fill="#4285F4"
            d="M31.64 23.205c-6.593 0-12.14-5.066-12.14-11.295 0-6.23 5.547-11.295 12.14-11.295 3.633 0 6.257 1.363 8.21 3.13l-2.308 2.207c-1.41-1.274-3.3-2.274-5.902-2.274-4.818 0-8.605 3.724-8.605 8.233 0 4.508 3.787 8.232 8.605 8.232 3.13 0 4.915-1.207 6.052-2.31.94-.908 1.548-2.205 1.784-3.98h-7.836v-3.162h10.978c.113.566.17 1.25.17 1.99 0 2.35-.678 5.257-2.857 7.347-2.124 2.107-4.84 3.207-8.29 3.207zm28.868-7.688c0 4.367-3.437 7.59-7.657 7.59-4.22 0-7.657-3.223-7.657-7.59 0-4.387 3.437-7.59 7.657-7.59 4.22 0 7.657 3.203 7.657 7.59zm-3.36 0c0-2.726-1.976-4.593-4.297-4.593-2.32 0-4.296 1.867-4.296 4.593 0 2.707 1.976 4.593 4.296 4.593 2.32 0 4.296-1.886 4.296-4.593zm20.698 0c0 4.367-3.437 7.59-7.657 7.59-4.22 0-7.657-3.223-7.657-7.59 0-4.387 3.437-7.59 7.657-7.59 4.22 0 7.657 3.203 7.657 7.59zm-3.36 0c0-2.726-1.976-4.593-4.296-4.593-2.32 0-4.297 1.867-4.297 4.593 0 2.707 1.976 4.593 4.297 4.593 2.32 0 4.296-1.886 4.296-4.593zm-16.207 6.977h-3.36V2.728h3.36v19.766zM10.324 8.98c-.396-.407-.793-.814-1.19-1.222v-.814h4.76V3.95H5.564v3.995h3.57c.396.407.793.814 1.19 1.222v.814H5.564v2.994h4.76v-3.995zm0 7.59c-.396-.408-.793-.815-1.19-1.223v-.814h4.76v-2.994H5.564v3.995h3.57c.396.408.793.815 1.19 1.223v.814H5.564v2.994h4.76v-3.995z"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-2">اختر حساب</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          للمتابعة إلى JobScope
        </p>
      </div>

      <div className="mb-6">
        {mockAccounts.map((account) => (
          <div
            key={account.id}
            className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-colors duration-200 ${
              selectedAccount?.id === account.id
                ? darkMode
                  ? "bg-gray-700"
                  : "bg-blue-50"
                : darkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleAccountSelect(account)}
          >
            <img
              src={account.picture}
              alt={account.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1">
              <div className="font-medium">{account.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {account.email}
              </div>
            </div>
            {selectedAccount?.id === account.id && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}

        <button
          className={`flex items-center p-3 rounded-lg w-full text-left ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-colors duration-200`}
          onClick={handleAddAccount}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div className="font-medium text-blue-500">استخدام حساب آخر</div>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <LoadingButton
          variant="primary"
          fullWidth
          isLoading={isLoading}
          loadingText="جاري تسجيل الدخول..."
          className={`${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-all duration-200 shadow-md hover:shadow-lg text-base py-2`}
          onClick={handleContinue}
          disabled={!selectedAccount}
        >
          متابعة
        </LoadingButton>

        <Button
          variant="outline"
          fullWidth
          className={`${
            darkMode
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={onCancel}
        >
          إلغاء
        </Button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        لتتمكن من استخدام هذا الحساب، يجب أن توافق على{" "}
        <a href="#" className="text-blue-500 hover:underline">
          شروط الخدمة
        </a>{" "}
        و{" "}
        <a href="#" className="text-blue-500 hover:underline">
          سياسة الخصوصية
        </a>{" "}
        الخاصة بـ Google.
      </div>
    </div>
  );
};

export default GoogleAccountSelector;
