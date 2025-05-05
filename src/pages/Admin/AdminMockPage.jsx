import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useUserStore from '../../store/userStore';

const AdminMockPage = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      name: 'محمد أحمد',
      profession: 'كهربائي',
      specialization: 'تمديدات منزلية',
      date: '2023-05-15',
      status: 'pending',
    },
    {
      id: 2,
      name: 'سمير حسن',
      profession: 'نجار',
      specialization: 'أثاث منزلي',
      date: '2023-05-16',
      status: 'pending',
    },
    {
      id: 3,
      name: 'ليلى أحمد',
      profession: 'مصممة ديكور',
      specialization: 'تصميم داخلي',
      date: '2023-05-17',
      status: 'pending',
    },
  ]);
  
  const [stats, setStats] = useState({
    totalCraftsmen: 156,
    totalClients: 342,
    totalBookings: 523,
    pendingBookings: 48,
    completedBookings: 475,
    totalReviews: 412,
    averageRating: 4.7,
  });
  
  const handleApprove = (id) => {
    setPendingRequests(
      pendingRequests.map((request) =>
        request.id === id ? { ...request, status: 'approved' } : request
      )
    );
  };
  
  const handleReject = (id) => {
    setPendingRequests(
      pendingRequests.map((request) =>
        request.id === id ? { ...request, status: 'rejected' } : request
      )
    );
  };
  
  return (
    <Layout user={user} onLogout={logout}>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">لوحة تحكم المشرف</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-primary text-white">
              <h3 className="text-lg font-bold mb-1">إجمالي الحرفيين</h3>
              <p className="text-3xl font-bold">{stats.totalCraftsmen}</p>
            </Card>
            
            <Card className="p-4 bg-secondary text-white">
              <h3 className="text-lg font-bold mb-1">إجمالي العملاء</h3>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </Card>
            
            <Card className="p-4 bg-accent text-primary">
              <h3 className="text-lg font-bold mb-1">إجمالي الطلبات</h3>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </Card>
            
            <Card className="p-4 bg-gray-800 text-white">
              <h3 className="text-lg font-bold mb-1">متوسط التقييم</h3>
              <p className="text-3xl font-bold">{stats.averageRating}/5</p>
            </Card>
          </div>
          
          {/* Pending Requests */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">طلبات التسجيل المعلقة</h2>
            
            {pendingRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-right">الاسم</th>
                      <th className="py-2 px-4 text-right">المهنة</th>
                      <th className="py-2 px-4 text-right">التخصص</th>
                      <th className="py-2 px-4 text-right">تاريخ الطلب</th>
                      <th className="py-2 px-4 text-right">الحالة</th>
                      <th className="py-2 px-4 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((request) => (
                      <tr key={request.id} className="border-b">
                        <td className="py-3 px-4">{request.name}</td>
                        <td className="py-3 px-4">{request.profession}</td>
                        <td className="py-3 px-4">{request.specialization}</td>
                        <td className="py-3 px-4">
                          {new Date(request.date).toLocaleDateString('ar-SY')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'approved' ? 'تمت الموافقة' :
                             request.status === 'rejected' ? 'تم الرفض' :
                             'قيد الانتظار'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                className="text-xs py-1 px-2"
                                onClick={() => handleApprove(request.id)}
                              >
                                قبول
                              </Button>
                              <Button
                                variant="outline"
                                className="text-xs py-1 px-2 text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => handleReject(request.id)}
                              >
                                رفض
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center">لا توجد طلبات معلقة</p>
            )}
          </Card>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">إحصائيات الطلبات</h2>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-xs">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>قيد الانتظار</span>
                      <span>{stats.pendingBookings}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>مكتملة</span>
                      <span>{stats.completedBookings}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(stats.completedBookings / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>التقييمات</span>
                      <span>{stats.totalReviews}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${(stats.totalReviews / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">توزيع المهن</h2>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-xs">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>كهربائي</span>
                      <span>32%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: '32%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>سباك</span>
                      <span>24%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: '24%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>نجار</span>
                      <span>18%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: '18%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>دهان</span>
                      <span>15%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: '15%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>أخرى</span>
                      <span>11%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: '11%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminMockPage;
