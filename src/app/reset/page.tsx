import ResetPasswordForm from '@/app/reset/ResetPasswordForm';
import { updatePassword } from '@/services/auth';
import { cookies } from 'next/headers';

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recovery_token')?.value || null;

  return (
    <ResetPasswordForm resetPassword={updatePassword} token={token} />
  )
}