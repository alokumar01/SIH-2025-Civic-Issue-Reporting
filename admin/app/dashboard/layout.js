'use client';
import Admin from '@/components/Dashboard/Admin';
import DepartmentHead from '@/components/Dashboard/DepartmentHead';
import MunicipalAdmin from '@/components/Dashboard/MunicipalAdmin';
import Staff from '@/components/Dashboard/Staff';
import UserNotFound from '@/components/general/UserNotFound';
import { useUserStore } from '@/store/userStore';
import React from 'react';

export default function DashboardLayout({ children }) {
    const { user } = useUserStore();
    if (!user) {
        return <UserNotFound />;
    }

    if (user.role === 'admin') {
        return <Admin />
    }

    if (user.role === 'municipal_admin') {
        return <MunicipalAdmin />
    }

    if (user.role === 'department_head') {
        return <DepartmentHead />
    }

    if (user.role === 'staff') {
        return <Staff />
    }

    return <UserNotFound />;
}