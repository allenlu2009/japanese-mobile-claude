import { z } from 'zod';
import {
  MIN_SCORE,
  MAX_SCORE,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from './constants';

// Test form validation schema
export const testSchema = z.object({
  date: z.string()
    .min(1, 'Date is required')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Invalid date format')
    .refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return parsedDate <= today;
    }, 'Date cannot be in the future'),

  score: z.coerce
    .number({
      required_error: 'Score is required',
      invalid_type_error: 'Score must be a number',
    })
    .min(MIN_SCORE, `Score must be at least ${MIN_SCORE}`)
    .max(MAX_SCORE, `Score must be at most ${MAX_SCORE}`)
    .int('Score must be a whole number'),

  category: z.enum(['read', 'listen', 'write', 'speak'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),

  description: z.string()
    .min(MIN_DESCRIPTION_LENGTH, 'Description is required')
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`
    )
    .trim(),
});

// Infer the TypeScript type from the schema
export type TestFormSchema = z.infer<typeof testSchema>;

// Validate test data
export function validateTest(data: unknown): { success: boolean; errors?: Record<string, string> } {
  try {
    testSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}
