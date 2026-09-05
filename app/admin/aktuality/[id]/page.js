'use client';
import { redirect } from 'next/navigation';

// Convenience: /admin/aktuality/<id> just opens the list (edit inline there).
export default function RedirectToList() {
  redirect('/admin/aktuality');
}
