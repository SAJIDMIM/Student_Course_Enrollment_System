import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search,
  Filter, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Info 
} from "lucide-react";
import GlassLayout from "../components/GlassLayout";
import { useAuth } from "../context/AuthContext";
import ManageStudents from "../components/ManageStudents";
import StudentFormModal from "../components/StudentFormModal";
import axios from "axios";

const courseOptions = [
  "BSc (Hons) in Computer Science",
  "BSc (Hons) in Information Technology",
  "BSc (Hons) in Software Engineering",
  "BSc (Hons) in Data Science",
];

const statusOptions = ["Active", "Pending", "Graduated", "Dropped"];

const Dashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [tempFilterCourse, setTempFilterCourse] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  
  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
    icon: null
  });

  const API_BASE = "http://localhost:5000/api/students";

  // Fetch all students from database
  const fetchStudents = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setStudents(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      showNotification(
        "error",
        "Failed to Load Data",
        "Could not fetch students. Please refresh the page.",
        <AlertCircle className="h-5 w-5" />
      );
    } finally {
      setFetchLoading(false);
    }
  };

  // Show notification helper
  const showNotification = (type, title, message, icon) => {
    setNotification({
      show: true,
      type,
      title,
      message,
      icon
    });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Hide notification
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // Fetch students when user logs in
  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  // Filter students based on search and course filter
  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) &&
      (filterCourse ? s.course === filterCourse : true)
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const displayedStudents = filteredStudents.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Generate page numbers to display (with ellipsis for many pages)
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Apply Filter
  const applyFilter = () => {
    setFilterCourse(tempFilterCourse);
    setCurrentPage(1);
    
    if (tempFilterCourse) {
      showNotification(
        "info",
        "Filter Applied",
        `Showing students filtered by: ${tempFilterCourse}`,
        <Filter className="h-5 w-5" />
      );
    } else {
      showNotification(
        "info",
        "Filter Cleared",
        "Showing all students",
        <Info className="h-5 w-5" />
      );
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setFilterCourse("");
    setTempFilterCourse("");
    setCurrentPage(1);
    showNotification(
      "info",
      "Filters Cleared",
      "All search and filter criteria have been reset.",
      <Info className="h-5 w-5" />
    );
  };

  // Handle edit button click - passed to ManageStudents
  const handleEditRequest = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  // Handle refresh after CRUD operations
  const handleRefresh = async () => {
    await fetchStudents();
    setShowForm(false);
    setEditingStudent(null);
  };

  if (!user) return null;

  return (
    <GlassLayout 
      title="Student Dashboard" 
      subtitle="Manage and track all student records" 
      icon={<Plus className="h-8 w-8 text-white" />}
      fullWidth={true}
    >
      <div className="w-full space-y-6">
        {/* Global Notification Banner */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`
                relative overflow-hidden rounded-xl border px-5 py-4 shadow-lg
                ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' : ''}
                ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : ''}
                ${notification.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : ''}
              `}
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className={`
                  absolute bottom-0 left-0 h-0.5
                  ${notification.type === 'success' ? 'bg-green-400' : ''}
                  ${notification.type === 'error' ? 'bg-red-400' : ''}
                  ${notification.type === 'info' ? 'bg-blue-400' : ''}
                `}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    p-1.5 rounded-full
                    ${notification.type === 'success' ? 'bg-green-500/20' : ''}
                    ${notification.type === 'error' ? 'bg-red-500/20' : ''}
                    ${notification.type === 'info' ? 'bg-blue-500/20' : ''}
                  `}>
                    {notification.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{notification.title}</h3>
                    <p className="text-xs opacity-90 mt-0.5">{notification.message}</p>
                  </div>
                </div>
                <button
                  onClick={hideNotification}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm">Total Students</p>
            <p className="text-2xl font-bold text-white">{students.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm">Active Students</p>
            <p className="text-2xl font-bold text-green-400">
              {students.filter(s => s.status === "Active").length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">
              {students.filter(s => s.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm">Graduated</p>
            <p className="text-2xl font-bold text-blue-400">
              {students.filter(s => s.status === "Graduated").length}
            </p>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5e3bd7] focus:border-transparent transition-all duration-200 text-sm"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Course Dropdown */}
          <div className="relative min-w-[280px] lg:min-w-[320px]">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
            <select
              id="course-filter"
              value={tempFilterCourse}
              onChange={(e) => setTempFilterCourse(e.target.value)}
              className="pl-9 pr-8 w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5e3bd7] focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="" className="bg-[#1a1a2e] text-white">All Courses</option>
              {courseOptions.map((c) => (
                <option key={c} value={c} className="bg-[#1a1a2e] text-white py-2">{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Apply Filter Button */}
          <motion.button
            onClick={applyFilter}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#5e3bd7] to-[#341f97] px-6 py-2.5 h-10 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
          >
            <Filter className="h-4 w-4" /> 
            <span>Apply Filter</span>
          </motion.button>

          {/* Add Student Button */}
          <motion.button
            onClick={() => {
              setEditingStudent(null);
              setShowForm(true);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#5e3bd7] to-[#341f97] px-6 py-2.5 h-10 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> 
            <span>Add Student</span>
          </motion.button>
        </div>

        {/* Active Filter Indicator */}
        {filterCourse && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-2"
          >
            <div className="bg-[#5e3bd7]/20 border border-[#5e3bd7]/30 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Active Filter: <span className="font-semibold">{filterCourse}</span></span>
              <button
                onClick={() => {
                  setFilterCourse("");
                  setTempFilterCourse("");
                  setCurrentPage(1);
                  showNotification("info", "Filter Removed", "Showing all students", <Info className="h-4 w-4" />);
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Clear Filters Button */}
        {(search || filterCourse) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Manage Students Component */}
        <ManageStudents
          students={students}
          displayedStudents={displayedStudents}
          filteredStudents={filteredStudents}
          fetchLoading={fetchLoading}
          search={search}
          filterCourse={filterCourse}
          onEdit={handleEditRequest}
          onRefresh={handleRefresh}
          onShowNotification={showNotification}
        />

        {/* Pagination and Table Footer */}
        {students.length > 0 && filteredStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2"
          >
            {/* Records Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-400"
            >
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredStudents.length)} of {filteredStudents.length} students
              {filteredStudents.length !== students.length && ` (filtered from ${students.length} total)`}
            </motion.div>

            {/* Animated Pagination Controls - < 1 2 3 ... 10 > */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1 sm:gap-2"
              >
                {/* Previous Button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(94, 59, 215, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`
                    p-2 rounded-lg border border-white/10 flex items-center justify-center
                    ${currentPage === 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-white/10 transition-all duration-200'
                    }
                  `}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </motion.button>

                {/* Page Numbers with Animation */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <motion.button
                        key={page}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: currentPage === page 
                            ? 'linear-gradient(90deg, #5e3bd7, #341f97)' 
                            : 'rgba(94, 59, 215, 0.2)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => paginate(page)}
                        className={`
                          w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                          ${currentPage === page
                            ? 'bg-gradient-to-r from-[#5e3bd7] to-[#341f97] text-white shadow-lg'
                            : 'text-gray-400 hover:text-white border border-white/10'
                          }
                        `}
                      >
                        {page}
                      </motion.button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(94, 59, 215, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`
                    p-2 rounded-lg border border-white/10 flex items-center justify-center
                    ${currentPage === totalPages 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-white/10 transition-all duration-200'
                    }
                  `}
                >
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </motion.button>
              </motion.div>
            )}

            {/* Last Updated */}
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500"
            >
              Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      <AnimatePresence>
        {showForm && (
          <StudentFormModal
            editingStudent={editingStudent}
            onClose={() => setShowForm(false)}
            onSuccess={handleRefresh}
            onShowNotification={showNotification}
            courseOptions={courseOptions}
            statusOptions={statusOptions}
          />
        )}
      </AnimatePresence>
    </GlassLayout>
  );
};

export default Dashboard;