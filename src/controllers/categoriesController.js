import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategory
} from "../models/categoriesModel.js";

function normalizeCategoryForm(body = {}) {
  return {
    category_name: body.category_name?.trim() || "",
    description: body.description?.trim() || ""
  };
}

function validateCategoryForm(formData) {
  const errors = [];

  if (!formData.category_name) {
    errors.push("Category name is required.");
  }

  if (formData.category_name.length < 2) {
    errors.push("Category name must be at least 2 characters long.");
  }

  if (!formData.description) {
    errors.push("Description is required.");
  }

  if (formData.description.length < 10) {
    errors.push("Description must be at least 10 characters long.");
  }

  return errors;
}

export async function buildManageCategoriesPage(req, res, next) {
  try {
    const categories = await getAllCategories();

    res.render("categories/manage", {
      title: "Manage Categories",
      categories
    });
  } catch (error) {
    next(error);
  }
}

export async function buildCreateCategoryPage(req, res, next) {
  try {
    res.render("categories/create", {
      title: "Add Category",
      errors: [],
      formData: {
        category_name: "",
        description: ""
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategorySubmission(req, res, next) {
  try {
    const formData = normalizeCategoryForm(req.body);
    const errors = validateCategoryForm(formData);

    if (errors.length > 0) {
      return res.status(400).render("categories/create", {
        title: "Add Category",
        errors,
        formData
      });
    }

    await createCategory({
      categoryName: formData.category_name,
      description: formData.description
    });

    res.redirect("/categories/manage");
  } catch (error) {
    next(error);
  }
}

export async function buildEditCategoryPage(req, res, next) {
  try {
    const categoryId = Number(req.params.categoryId);
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", {
        title: "Category Not Found"
      });
    }

    res.render("categories/edit", {
      title: "Edit Category",
      errors: [],
      category,
      formData: {
        category_name: category.category_name ?? "",
        description: category.description ?? ""
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategorySubmission(req, res, next) {
  try {
    const categoryId = Number(req.params.categoryId);
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", {
        title: "Category Not Found"
      });
    }

    const formData = normalizeCategoryForm(req.body);
    const errors = validateCategoryForm(formData);

    if (errors.length > 0) {
      return res.status(400).render("categories/edit", {
        title: "Edit Category",
        errors,
        category,
        formData
      });
    }

    await updateCategory(categoryId, {
      categoryName: formData.category_name,
      description: formData.description
    });

    res.redirect("/categories/manage");
  } catch (error) {
    next(error);
  }
}

export async function deleteCategorySubmission(req, res, next) {
  try {
    const categoryId = Number(req.params.categoryId);
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found.");
    }

    await deleteCategoryById(categoryId);

    res.redirect("/categories/manage");
  } catch (error) {
    next(error);
  }
}