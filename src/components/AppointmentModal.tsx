'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from 'lucide-react';

const EASE = [0.4, 0, 0.2, 1] as const;

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

const URGENCY_LEVELS = [
  { value: 'bajo', label: 'Bajo', color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'medio', label: 'Medio', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { value: 'alto', label: 'Alto', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'urgente', label: 'Urgente', color: 'text-red-600 bg-red-50 border-red-200' },
];

const TIME_SLOTS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM',
];

interface AppointmentModalProps {
  isOpen: boolean;
  doctorName: string;
  specialty: string;
  onClose: () => void;
  onConfirm: (data: AppointmentData) => void;
}

export interface AppointmentData {
  date: string;
  time: string;
  isEmergency: boolean;
  urgencyLevel: string;
  reason: string;
}

export default function AppointmentModal({
  isOpen,
  doctorName,
  specialty,
  onClose,
  onConfirm,
}: AppointmentModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('medio');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDayName = (day: number) => {
    return new Date(currentYear, currentMonth, day).getDay();
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    onConfirm({
      date: dateStr,
      time: selectedTime,
      isEmergency,
      urgencyLevel: isEmergency ? urgencyLevel : '',
      reason: isEmergency ? reason : '',
    });
    setConfirmed(true);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 2000);
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setIsEmergency(false);
    setUrgencyLevel('medio');
    setReason('');
    setConfirmed(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = selectedDate !== null && selectedTime !== '' && (!isEmergency || reason.trim().length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="appt-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            key="appt-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Agendar cita médica"
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 24 }}
            transition={{ duration: 0.26, ease: EASE }}
            className="fixed inset-x-4 bottom-4 top-6 z-[110] mx-auto flex max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-[0_32px_64px_-12px_rgb(10_110_122/0.25),0_0_0_1px_rgb(10_110_122/0.06)] sm:inset-x-8 md:inset-x-0 md:left-1/2 md:w-full md:-translate-x-1/2"
          >
            <div className="h-1 w-full shrink-0 bg-primary" />

            <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-white px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary">
                  <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-bold text-text">Agendar Cita</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-secondary hover:text-text"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {confirmed ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </span>
                <div>
                  <p className="text-lg font-bold text-text">Cita agendada</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {isEmergency ? 'Emergencia registrada. Te contactaremos pronto.' : 'Tu cita ha sido registrada exitosamente.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-5">
                  <p className="text-sm font-semibold text-text">{doctorName}</p>
                  <p className="text-xs text-text-muted">{specialty}</p>
                </div>

                {/* Calendar */}
                <div className="mb-5 rounded-[var(--radius-card)] border border-border/60 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="rounded-full p-1 text-text-muted transition-colors hover:bg-secondary hover:text-text"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-text">
                      {MONTHS[currentMonth]} {currentYear}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="rounded-full p-1 text-text-muted transition-colors hover:bg-secondary hover:text-text"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-text-muted">
                    {DAYS.map((d) => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>

                  <div className="mt-1 grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayOfWeek = getDayName(day);
                      const isSunday = dayOfWeek === 0;
                      const past = isPastDate(day);
                      const selected = selectedDate === day;
                      const canSelect = !past && (isEmergency || !isSunday);

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={!canSelect}
                          onClick={() => setSelectedDate(day)}
                          className={`rounded-lg py-1.5 text-xs font-medium transition-all ${
                            selected
                              ? 'bg-primary text-white shadow-sm'
                              : canSelect
                                ? 'text-text hover:bg-secondary'
                                : isSunday
                                  ? 'text-text-muted/40 cursor-not-allowed'
                                  : 'text-text-muted/40 cursor-not-allowed'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5"
                  >
                    <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      Horario disponible
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-[var(--radius-button)] border px-3 py-2 text-xs font-medium transition-all ${
                            selectedTime === time
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-text-muted hover:border-primary/50 hover:text-text'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Emergency toggle */}
                <div className="mb-5 space-y-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-card)] border border-border/60 p-3 transition-colors hover:border-amber-300">
                    <input
                      type="checkbox"
                      checked={isEmergency}
                      onChange={(e) => setIsEmergency(e.target.checked)}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-text">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Es una emergencia
                      </span>
                      <p className="text-[11px] text-text-muted">
                        Marca esta opción si requieres atención prioritaria.
                      </p>
                    </div>
                  </label>

                  {isEmergency && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 rounded-[var(--radius-card)] border border-amber-200/60 bg-amber-50/40 p-4"
                    >
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-text-muted">
                          Nivel de urgencia
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {URGENCY_LEVELS.map((level) => (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => setUrgencyLevel(level.value)}
                              className={`rounded-[var(--radius-button)] border px-3 py-2 text-xs font-medium transition-all ${
                                urgencyLevel === level.value
                                  ? level.color
                                  : 'border-border text-text-muted hover:border-border/80'
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-text-muted">
                          Motivo de la emergencia
                        </label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={3}
                          className="profile-input profile-textarea resize-none text-xs"
                          placeholder="Describe brevemente el motivo de la emergencia..."
                          maxLength={500}
                        />
                        <p className="mt-1 text-right text-[10px] text-text-muted">
                          {reason.length} / 500
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm button */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!isFormValid}
                  className="w-full rounded-[var(--radius-button)] bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEmergency ? 'Agendar cita de emergencia' : 'Confirmar cita'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
