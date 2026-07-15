import { useState } from 'react';
import { Calendar, Clock, ChevronDown, Search } from 'lucide-react';
import Drawer from '../ui/Drawer';
import { useAppTranslation } from '../../hooks/useAppTranslation';

const SERVICE_OPTIONS = [
  'Brake Check',
  'Oil Change',
  'Tire Rotation',
  'Engine Diagnostic',
  'AC Repair',
  'Battery Replacement',
  'Wheel Alignment',
];

const TECHNICIAN_OPTIONS = ['Hazem M.', 'Omar T.', 'Youssef H.', 'Zara M.'];

export default function NewBookingDrawer({ open, onClose, onCreate }) {
  const { t } = useAppTranslation('bookings');
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    plate: '',
    serviceType: '',
    date: '',
    time: '',
    vehicle: '',
    technician: '',
  });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate?.(form);
    onClose();
    // Reset form
    setForm({
      customerName: '',
      phone: '',
      plate: '',
      serviceType: '',
      date: '',
      time: '',
      vehicle: '',
      technician: '',
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t('newBookingTitle', { defaultValue: 'New Booking' })}
      subtitle={t('newBookingSubtitle', {
        defaultValue: 'Fill in the details to schedule a service',
      })}
      width="max-w-lg"
      footer={
        <div className="flex justify-end">
          <button
            type="submit"
            form="new-booking-form"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 text-white shadow-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#0E5C5B',
              height: '42px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {t('create', { defaultValue: 'Create' })}
          </button>
        </div>
      }
    >
      <form id="new-booking-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Name */}
        <Field label={t('customerName', { defaultValue: 'Customer Name' })}>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              value={form.customerName}
              onChange={update('customerName')}
              placeholder={t('customerNamePlaceholder', { defaultValue: 'Search or enter name' })}
              className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none"
            />
          </div>
        </Field>

        {/* Phone + Plate (side-by-side) */}
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('phone', { defaultValue: 'Phone Number' })}>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={update('phone')}
              placeholder="+20 ..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none"
            />
          </Field>
          <Field label={t('plate', { defaultValue: 'Plate Number' })}>
            <input
              type="text"
              required
              value={form.plate}
              onChange={update('plate')}
              placeholder="ABC-1234"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 uppercase placeholder:text-gray-400 focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none"
            />
          </Field>
        </div>

        {/* Service Type */}
        <Field label={t('serviceType', { defaultValue: 'Service Type' })}>
          <SelectInput
            value={form.serviceType}
            onChange={update('serviceType')}
            placeholder={t('selectService', { defaultValue: 'Select Service' })}
            options={SERVICE_OPTIONS}
          />
        </Field>

        {/* Date + Time (side-by-side) */}
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('date', { defaultValue: 'Date' })}>
            <div className="relative">
              <input
                type="date"
                required
                value={form.date}
                onChange={update('date')}
                className="w-full rounded-lg border border-gray-200 py-2.5 pr-9 pl-3 text-sm text-gray-900 focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none"
              />
              <Calendar className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </Field>
          <Field label={t('time', { defaultValue: 'Time' })}>
            <div className="relative">
              <input
                type="time"
                required
                value={form.time}
                onChange={update('time')}
                className="w-full rounded-lg border border-gray-200 py-2.5 pr-9 pl-3 text-sm text-gray-900 focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none"
              />
              <Clock className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </Field>
        </div>

        {/* Vehicle */}
        <Field label={t('vehicle', { defaultValue: 'Vehicle' })}>
          <input
            type="text"
            required
            value={form.vehicle}
            onChange={update('vehicle')}
            placeholder={t('vehiclePlaceholder', { defaultValue: 'e.g. Toyota Camry 2021' })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none"
          />
        </Field>

        {/* Assign Technician */}
        <Field label={t('assignTechnician', { defaultValue: 'Assign Technician' })}>
          <SelectInput
            value={form.technician}
            onChange={update('technician')}
            placeholder={t('selectTechnician', { defaultValue: 'Select Technician' })}
            options={TECHNICIAN_OPTIONS}
          />
        </Field>
      </form>
    </Drawer>
  );
}

// ---- Helper sub-components ----
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#5A6968]">{label}</label>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select
        required
        value={value}
        onChange={onChange}
        className={`w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 pr-9 text-sm focus:border-[#0E5C5B] focus:ring-2 focus:ring-[#0E5C5B]/10 focus:outline-none ${
          value ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-gray-900">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
