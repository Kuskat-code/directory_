'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2, AlertTriangle, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/src/lib/supabase/client'

export default function ConfiguracionContent() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Cambiar contraseña
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  // Cambiar correo
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)

  // Eliminar cuenta
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setPasswordError(error.message)
      } else {
        setPasswordSuccess('Contraseña actualizada correctamente')
        setNewPassword('')
        setConfirmNewPassword('')
      }
    })
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(null)
    setEmailSuccess(null)

    if (!newEmail.trim()) {
      setEmailError('El correo es requerido')
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) {
        setEmailError(error.message)
      } else {
        setEmailSuccess('Se ha enviado un correo de confirmación a la nueva dirección')
        setNewEmail('')
      }
    })
  }

  const handleDeleteAccount = async () => {
    if (deleteText !== 'ELIMINAR') return
    const supabase = createClient()
    const { error } = await supabase.rpc('delete_own_user')
    if (error) {
      setPasswordError('Error al eliminar la cuenta. Intenta de nuevo.')
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="mb-8">
        <Link
          href="/dashboard/doctor"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-gray-600">Administra tu contraseña, correo electrónico y cuenta.</p>
      </div>

      {/* Cambiar Contraseña */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Cambiar Contraseña</h2>
            <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nueva Contraseña</label>
            <div className="relative mt-1">
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Confirmar Contraseña</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              placeholder="••••••••"
            />
          </div>

          {passwordError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600">
              {passwordError}
            </motion.p>
          )}
          {passwordSuccess && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600">
              {passwordSuccess}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-75"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Actualizar Contraseña
          </button>
        </form>
      </section>

      {/* Cambiar Correo */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Cambiar Correo Electrónico</h2>
            <p className="text-sm text-gray-500">Recibirás un enlace de confirmación al nuevo correo</p>
          </div>
        </div>

        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nuevo Correo</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              placeholder="nuevo@example.com"
            />
          </div>

          {emailError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600">
              {emailError}
            </motion.p>
          )}
          {emailSuccess && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600">
              {emailSuccess}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-75"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Actualizar Correo
          </button>
        </form>
      </section>

      {/* Eliminar Cuenta */}
      <section className="rounded-2xl border border-red-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-900">Eliminar Cuenta</h2>
            <p className="text-sm text-red-600">Esta acción no se puede deshacer</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98]"
          >
            Eliminar mi cuenta
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Escribe <strong>ELIMINAR</strong> para confirmar que deseas eliminar tu cuenta permanentemente.
            </p>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              className="w-full rounded-lg border border-red-300 bg-red-50 py-2.5 pl-4 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              placeholder="ELIMINAR"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setDeleteText('') }}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteText !== 'ELIMINAR'}
                onClick={handleDeleteAccount}
                className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
