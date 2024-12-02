import ForgotPasswordPage from '@/components/pages/auth/password/forgot-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_authentication/(password)/forgot-password',
)({
    component: ForgotPasswordPage,
})