import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodEffects, ZodSchema } from 'zod';

/**
 * Middleware to validate request body, params, or query against a Zod schema.
 * @param schema - The Zod schema to validate against.
 */
const validate = (schema: AnyZodObject | ZodEffects<any, any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // For ZodEffects (schemas with .refine()), we need to parse just the body
    // For AnyZodObject, we parse the full request object
    if ('_def' in schema && schema._def.typeName === 'ZodEffects') {
      schema.parse(req.body);
    } else {
      (schema as AnyZodObject).parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }
    // Forward other errors
    next(error);
  }
};

export default validate; 