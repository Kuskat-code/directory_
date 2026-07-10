'use server';

import { createClient } from '@/src/lib/supabase/server';
import type { ActionResponse } from '../types';
import { updateScheduleSchema, type UpdateScheduleInput } from '../validation';
import { verifyOwnership } from './shared';

export async function updateSchedule(
  input: unknown,
): Promise<ActionResponse<UpdateScheduleInput>> {
  const result = updateScheduleSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.doctorId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  const { data: current, error: fetchErr } = await supabase
    .from('doctores')
    .select('cronograma')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener el cronograma actual.' };
  }

  if (JSON.stringify(result.data.schedule) !== JSON.stringify(current.cronograma)) {
    const { error } = await supabase
      .from('doctores')
      .update({
        cronograma: result.data.schedule,
      })
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true, data: result.data };
}
