import ResetPasswordPage from '@/components/pages/auth/password/reset-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authentication/(password)/reset-password',
)({
  component: ResetPasswordPage,
})
