import React from 'react';
import useSiteSettingsStore from '../../store/siteSettingsStore';
import useThemeStore from '../../store/themeStore';

// مكون لعرض معلومات الموقع في أي مكان في التطبيق
const SiteInfo = ({ type }) => {
  const { siteSettings } = useSiteSettingsStore();
  const darkMode = useThemeStore((state) => state.darkMode);
  
  // عرض اسم الموقع
  if (type === 'name') {
    return <span>{siteSettings.siteName}</span>;
  }
  
  // عرض شعار الموقع
  if (type === 'logo') {
    return (
      <img 
        src={siteSettings.siteLogo} 
        alt={siteSettings.siteName} 
        className="h-10 w-auto"
      />
    );
  }
  
  // عرض وصف الموقع
  if (type === 'description') {
    return <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{siteSettings.siteDescription}</p>;
  }
  
  // عرض معلومات الاتصال
  if (type === 'contact') {
    return (
      <div className="space-y-2">
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>البريد الإلكتروني:</strong> {siteSettings.siteEmail}
        </p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>الهاتف:</strong> {siteSettings.sitePhone}
        </p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>العنوان:</strong> {siteSettings.siteAddress}
        </p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>ساعات العمل:</strong> {siteSettings.siteWorkingHours}
        </p>
      </div>
    );
  }
  
  // عرض جميع المعلومات
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 space-x-reverse">
        <img 
          src={siteSettings.siteLogo} 
          alt={siteSettings.siteName} 
          className="h-12 w-auto"
        />
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {siteSettings.siteName}
        </h2>
      </div>
      
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {siteSettings.siteDescription}
      </p>
      
      <div className="space-y-1">
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>البريد الإلكتروني:</strong> {siteSettings.siteEmail}
        </p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>الهاتف:</strong> {siteSettings.sitePhone}
        </p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>العنوان:</strong> {siteSettings.siteAddress}
        </p>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <strong>ساعات العمل:</strong> {siteSettings.siteWorkingHours}
        </p>
      </div>
    </div>
  );
};

export default SiteInfo;
