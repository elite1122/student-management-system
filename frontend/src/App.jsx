import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import {
  Users, UserCheck, UserX, GraduationCap,
  Plus, Search, Filter, RefreshCw
} from 'lucide-react';

import Navbar from './components/Navbar';
import StatsCard from './components/StatsCard';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { studentService } from './services/api';

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentService.getAll({ search, status: statusFilter, page, limit: 8 });
      setStudents(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await studentService.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleAddEdit = async (formData) => {
    const isEditing = !!selectedStudent;
    try {
      if (isEditing) {
        await studentService.update(selectedStudent._id, formData);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(formData);
        toast.success('Student added successfully');
      }
      setModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await studentService.delete(selectedStudent._id);
      toast.success('Student deleted successfully');
      setDeleteModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const openAddModal = () => {
    setSelectedStudent(null);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontFamily: 'Inter', fontSize: '14px' },
          success: { iconTheme: { primary: '#6366f1', secondary: 'white' } }
        }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold font-display text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track all enrolled students</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Students" value={stats?.total} icon={Users} color="indigo" delay={0} />
          <StatsCard title="Active" value={stats?.active} icon={UserCheck} color="emerald" delay={0.05} />
          <StatsCard title="Inactive" value={stats?.inactive} icon={UserX} color="amber" delay={0.1} />
          <StatsCard title="Graduated" value={stats?.graduated} icon={GraduationCap} color="violet" delay={0.15} />
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-5"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm appearance-none cursor-pointer transition-all"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={() => { fetchStudents(); fetchStats(); }}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Add Student */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </motion.button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">
              {pagination ? (
                <>
                  <span className="text-slate-800 font-semibold">{pagination.total}</span> students found
                </>
              ) : ''}
            </p>
          </div>
          <StudentTable
            students={students}
            loading={loading}
            pagination={pagination}
            onPageChange={setPage}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </motion.div>
      </main>

      {/* Modals */}
      <StudentModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedStudent(null); }}
        onSubmit={handleAddEdit}
        student={selectedStudent}
      />
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedStudent(null); }}
        onConfirm={handleDelete}
        student={selectedStudent}
      />
    </div>
  );
}
