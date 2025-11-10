const yup =  require('yup');

const filterSchemaValidator = yup.object({
    name: yup
    .string()
    .required("Filter name is required")
    .trim()
    .max(255, "Filter name cannot exceed 255 characters"),

  slug: yup
    .string()
    .required("Filter slug is required")
    .trim()
    .matches(
      /^[a-z0-9_-]+$/,
      "Filter slug can only contain lowercase letters(a-z), numbers(0-9), underscore (_), and hyphens (-)"
    )
    .max(255, "Filter slug cannot exceed 255 characters"),

  description: yup
    .string()
    .trim()
    .max(500, "Filter description cannot exceed 500 characters")
    .optional(),

  type: yup
    .string()
    .required("Filter type is required")
    .oneOf(["radio", "selectbox"], "Invalid filter type"),

  options: yup
    .array()
    .of(yup.string().trim())
    .when("type", {
      is: (val) => ["radio", "selectbox"].includes(val),
      then: (schema) =>
        schema.min(1, "At least one option is required for this filter type"),
    })
    .optional(),

  min: yup
    .number()
    .nullable()
    .typeError("min must be a number")
    .optional(),

  max: yup
    .number()
    .nullable()
    .typeError("max must be a number")
    .optional(),
});

const categoryValidator = yup.object({
    title: yup
    .string()
    .required(" Category title is required ")
    .trim()
    .max(255, " Category title connact excced 255 characters "),
    slug: yup
    .string()
    .required(" Category slug is required ")
    .trim()
    .matches(
        /^[a-z0-9_-]+$/,
        "Slug can only contain lowercase letters(a-z), numbers(0-9),underscore (_), and hyphens (-)"
    )
    .max(255, " Category slug connact excced 255 characters "),
    parent: yup
    .string()
    .nullable()
    .matches(/^[0-9a-f]{24}$/, "Invalid parent category ID format")
    .optional(),
    description: yup
    .string()
    .trim()
    .max(500, "Category description cannot exceed 500 characters")
    .optional(),
    icon: yup
     .object({
      filename: yup
        .string()
        .trim()
        .matches(/\.(png|jpg|jpeg|svg)$/i, "Icon filename must be an image file (.png, .jpg, .jpeg, .svg)")
        .optional(),
    path: yup
        .string()
        .trim()
        .matches(
          /^(https?:\/\/|\/uploads\/)/,
          "Invalid icon path! Path must start with http:// or /uploads/"
        )
        .optional(),
    })
    .nullable()
    .optional(),
});

const categoryUpdateValidator = yup.object({
  title: yup.string().trim().max(255).optional(),
  slug: yup
    .string()
    .trim()
    .matches(/^[a-z0-9_-]+$/)
    .max(255)
    .optional(),
  parent: yup
    .string()
    .nullable()
    .matches(/^[0-9a-f]{24}$/)
    .optional(),
  description: yup.string().trim().max(500).optional(),
  icon: yup
    .object({
      filename: yup
        .string()
        .trim()
        .matches(/\.(png|jpg|jpeg|svg)$/i)
        .optional(),
      path: yup
        .string()
        .trim()
        .matches(/^(https?:\/\/|\/uploads\/)/)
        .optional(),
    })
    .nullable()
    .optional(),
  fillters: yup.array().of(filterSchemaValidator).optional(),
});

module.exports = {
    categoryValidator,
    filterSchemaValidator,
    categoryUpdateValidator
};