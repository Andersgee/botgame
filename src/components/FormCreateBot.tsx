import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const zodschema_bot_create = z.object({
  name: z.string().min(3),
  bio: z.string(),
});

type Values = z.infer<typeof zodschema_bot_create>;

const validationSchema = toFormikValidationSchema(zodschema_bot_create);

const initialValues: Values = {
  name: "",
  bio: "",
};

type Props = {
  className?: string;
};

export function FormCreateBot({ className }: Props) {
  const { mutate, isLoading } = trpc.useMutation(["protected-bot.create"]);

  const onSubmit = async (values: Values) => {
    console.log("onSubmit, values:", values);
    mutate(values);
  };

  return (
    <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className={className}>
          <input type="text" autoFocus name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
          {!!errors.name && !!touched.name && <span className="text-red-600">{errors.name}</span>}
          <input type="text" name="bio" onChange={handleChange} onBlur={handleBlur} value={values.bio} />
          {!!errors.bio && !!touched.bio && <span className="text-red-600">{errors.bio}</span>}
          <button type="submit" disabled={isSubmitting}>
            create
          </button>
          {isSubmitting && <div>formik {isSubmitting}</div>}
          {isLoading && <div>trpc {isLoading}</div>}
        </form>
      )}
    </Formik>
  );
}
