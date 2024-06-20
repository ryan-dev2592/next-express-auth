import * as zod from "zod";

const schemaValidator = (schema: zod.ZodObject<any, any>) => {
  return async (req: any, res: any, next: any) => {
    try {
      await schema.parseAsync(req);
      next();
    } catch (error) {
      if (error instanceof zod.ZodError) {
        const errors = error.errors.map((err) => {
          const { path, message } = err;

          const pathKey = path[1];

          return {
            path: pathKey,
            message,
          };
        });

        return res.status(400).json({
          message: "Validation Error",
          errors,
        });
      }

      next(error);
    }
  };
};

export default schemaValidator;
