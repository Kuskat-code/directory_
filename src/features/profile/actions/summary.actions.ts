'use server';

import { createClient } from '@/src/lib/supabase/server';
import type { ActionResponse } from '../types';
import { updateSummarySchema, type UpdateSummaryInput } from '../validation';
import { verifyOwnership } from './shared';

interface SummaryRow {
  bio: string | null;
  lenguajes: string[] | null;
}

export async function updateSummary(
  input: unknown,
): Promise<ActionResponse<UpdateSummaryInput>> {
  const result = updateSummarySchema.safeParse(input);
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
    .select('bio, lenguajes')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener el perfil actual.' };
  }

  const currentRow = current as SummaryRow;
  const summaryUpdates: Partial<{ bio: string; lenguajes: string[] }> = {};
  if (result.data.bio !== currentRow.bio) summaryUpdates.bio = result.data.bio;

  const languagesChanged =
    !currentRow.lenguajes ||
    result.data.languages.length !== currentRow.lenguajes.length ||
    result.data.languages.some((val, idx) => val !== currentRow.lenguajes?.[idx]);

  if (languagesChanged) summaryUpdates.lenguajes = result.data.languages;

  if (Object.keys(summaryUpdates).length > 0) {
    const { error } = await supabase
      .from('doctores')
      .update(summaryUpdates)
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true, data: result.data };
}
