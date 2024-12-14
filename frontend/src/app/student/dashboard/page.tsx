// frontend/src/app/student/dashboard/page.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const StudentDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, []);

  // Fetch and display dashboard data here
};

export default StudentDashboard;