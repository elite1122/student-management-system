import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Hash, BookOpen, Award, MapPin, Calendar, Activity } from 'lucide-react';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: '',
  course: '',
  grade: 'N/A',
  address: '',
  enrollmentDate: new Date().toISOString().split('T')[0],
  status: 'Active'
};

// Defined OUTSIDE the modal so React doesn't recreate it on every render
function Field({ label, name, type = 'text', icon: Icon, options, form, errors, onChange, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        {options ? (
          <select
            value={form[name]}
            onChange={(e) => onChange(name, e.target.value)}
            className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl border text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all
              ${errors[name] ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'}`}
          >
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={form[name]}
            onChange={(e) => onChange(name, e.target.value)}
            className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl border text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all
              ${errors[name] ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200'}`}
            {...rest}
          />
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );
}

export default function StudentModal({ isOpen, onClose, onSubmit, student }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = !!student;

  useEffect(() => {
    if (student) {
      setForm({
        ...student,
        enrollmentDate: student.enrollmentDate
          ? new Date(student.enrollmentDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [student, isOpen]);

  const handleChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.age || form.age < 5 || form.age > 100) e.age = 'Age must be between 5–100';
    if (!form.course.trim()) e.course = 'Course is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    onSubmit(form);
  };

  const fieldProps = { form, errors, onChange: handleChange };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900">
                  {isEditing ? 'Edit Student' : 'Add New Student'}
                </h2>
                <p className="text-sm text-slate-500">
                  {isEditing ? 'Update student information' : 'Fill in the details to enroll a new student'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field {...fieldProps} label="First Name" name="firstName" icon={User} placeholder="John" />
                <Field {...fieldProps} label="Last Name" name="lastName" icon={User} placeholder="Doe" />
              </div>
              <Field {...fieldProps} label="Email Address" name="email" type="email" icon={Mail} placeholder="john@example.com" />
              <div className="grid grid-cols-2 gap-4">
                <Field {...fieldProps} label="Phone Number" name="phone" icon={Phone} placeholder="+1 234 567 8900" />
                <Field {...fieldProps} label="Age" name="age" type="number" icon={Hash} placeholder="20" min="5" max="100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field {...fieldProps} label="Course / Program" name="course" icon={BookOpen} placeholder="Computer Science" />
                <Field {...fieldProps} label="Grade" name="grade" icon={Award} options={['A', 'B', 'C', 'D', 'F', 'N/A']} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field {...fieldProps} label="Enrollment Date" name="enrollmentDate" type="date" icon={Calendar} />
                <Field {...fieldProps} label="Status" name="status" icon={Activity} options={['Active', 'Inactive', 'Graduated', 'Suspended']} />
              </div>
              <Field {...fieldProps} label="Address" name="address" icon={MapPin} placeholder="123 Main St, City, Country" />

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300 transition-all"
                >
                  {isEditing ? 'Save Changes' : 'Add Student'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
