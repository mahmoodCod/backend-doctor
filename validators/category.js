const yup =  require('yup');

const fillterSchemaValidator = yup.object({
  name: yup
    .string()
    // .required("Fillter name is required")
    .trim()
    .max(255, "Fillter name cannot exceed 255 characters"),

  slug: yup
    .string()
    // .required("Fillter slug is required")
    .trim()
    .matches(
      /^[a-z0-9_-]+$/,
      "Filter slug can only contain lowercase letters(a-z), numbers(0-9), underscore (_), and hyphens (-)"
    )
    .max(255, "Fillter slug cannot exceed 255 characters"),

  description: yup
    .string()
    .trim()
    .max(500, "Filter description cannot exceed 500 characters"),

  type: yup
    .string()
    // .required("Fillter type is required")
    .oneOf(["radio", "selectbox", "range"], "Invalid filter types"),

  options: yup
    .array()
    .of(yup.string().trim())
    .when("type", {
      is: (val) => ["radio", "selectbox"].includes(val),
      then: (schema) =>
        schema.min(1, "At least one option is required for this filter type"),
    }),

    min: yup.number().when("type", {
      is: "range",
      then: () => yup.number().required("Number field requires a minimum value"),
    }),
    max: yup.number().when("type", {
      is: "range",
      then: () => yup.number().required("Number field requires a maximum value"),
    }),
});

const categoryValidator = yup.object({
    title: yup
    .string()
    .required(" Category title is required ")
    .trim()
    .max(255, " Category title cannot exceed 255 characters "),
    slug: yup
    .string()
    .required(" Category slug is required ")
    .trim()
    .matches(
        /^[a-z0-9_-]+$/,
        "Slug can only contain lowercase letters(a-z), numbers(0-9),underscore (_), and hyphens (-)"
    )
    .max(255, " Category slug cannot exceed 255 characters "),
    parent: yup
    .string()
    .matches(/^[0-9a-f]{24}$/, "Invalid parent category ID format")
    .nullable(),
    description: yup
    .string()
    .trim()
    .max(500, "Category description cannot exceed 500 characters"),
    icon: yup
     .object({
      filename: yup
        .string()
        .trim()
        .matches(/\.(png|jpg|jpeg|svg)$/i, "Icon filename must be an image file (.png, .jpg, .jpeg, .svg)"),
      path: yup
        .string()
        .trim()
        .matches(
          /^(https?:\/\/|\/uploads\/)/,
          "Invalid icon path! Path must start with http:// or /uploads/"
        ),
    })
    .nullable(),
    fillters: yup.array().of(fillterSchemaValidator).nullable(),
});

const categoryUpdateValidator = yup.object({
  title: yup
  .string()
  .trim(),
  slug: yup
    .string()
    .trim()
    .matches(/^[a-z0-9_-]+$/, "Slug can only contain lowercase letters(a-z), numbers(0-9),underscore (_), and hyphens (-)"),
  parent: yup
    .string()
    .matches(/^[0-9a-f]{24}$/ ,"Invalid parent category ID format"),
  description: yup.string().trim().max(500),
  icon: yup
    .object({
      filename: yup
        .string()
        .trim()
        .matches(/\.(png|jpg|jpeg|svg)$/i),
      path: yup
        .string()
        .trim()
        .matches(/^(https?:\/\/|\/uploads\/)/),
    }),
  fillters: yup.array().of(fillterSchemaValidator),
});

module.exports = {
    categoryValidator,
    fillterSchemaValidator,
    categoryUpdateValidator
};