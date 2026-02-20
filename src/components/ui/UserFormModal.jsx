import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../../features/users/usersSlice';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  website: '',
  companyName: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Full name is required';
  if (!fields.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address';
  }
  return errors;
}

export default function UserFormModal({ mode = 'add', user = null, onClose }) {
  const dispatch = useDispatch();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Pre-populate form when editing
  useEffect(() => {
    if (isEdit && user) {
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        website: user.website ?? '',
        companyName: user.company?.name ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setTouched({});
  }, [isEdit, user]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        ...validate({ ...form, [name]: value }),
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validate(form) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (isEdit) {
      dispatch(
        updateUser({
          id: user.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          company: { ...user.company, name: form.companyName },
        })
      );
    } else {
      dispatch(
        addUser({
          id: Date.now(),
          name: form.name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          company: { name: form.companyName, catchPhrase: '', bs: '' },
          address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '0', lng: '0' } },
          username: form.name.split(' ')[0].toLowerCase(),
        })
      );
    }
    onClose();
  }

  const inputBase =
    'w-full bg-slate-50 dark:bg-slate-800/50 border rounded-lg h-11 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:outline-none transition-all';
  const inputNormal = `${inputBase} border-slate-200 dark:border-slate-700 focus:ring-primary/20 focus:border-primary`;
  const inputError = `${inputBase} border-red-500 dark:border-red-500/70 focus:ring-red-500/20 focus:border-red-500`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-[520px] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isEdit
                ? 'Update the details for this user.'
                : 'Fill in the details to create a new profile.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-8 py-4 space-y-5 overflow-y-auto max-h-[65vh]">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g. Alex Rivera"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.name && touched.name ? inputError : inputNormal}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${errors.email && touched.email ? inputError : inputNormal} pr-10`}
                />
                {errors.email && touched.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputNormal}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
                  Website URL
                </label>
                <input
                  name="website"
                  type="url"
                  placeholder="https://example.com"
                  value={form.website}
                  onChange={handleChange}
                  className={inputNormal}
                />
              </div>
            </div>

            {/* Company */}
            <div className="space-y-1.5 pb-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
                Company Name
              </label>
              <div className="relative">
                <input
                  name="companyName"
                  type="text"
                  placeholder="e.g. Acme Inc."
                  value={form.companyName}
                  onChange={handleChange}
                  className={`${inputNormal} pr-10`}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  corporate_fare
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/30 flex justify-end items-center gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isEdit ? 'save' : 'person_add'}
              </span>
              {isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
