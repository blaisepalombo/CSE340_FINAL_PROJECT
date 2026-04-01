import { getAllCars, getCarById } from "../models/carsModel.js";
import {
  countProjectsByUserId,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByUserId,
  getProjectStatusHistory,
  updateProject,
  updateProjectStatus
} from "../models/projectsModel.js";

const allowedStatuses = [
  "submitted",
  "approved",
  "in_progress",
  "completed",
  "rejected"
];

function normalizeProjectForm(body = {}) {
  return {
    car_id: Number(body.car_id),
    title: body.title?.trim() || "",
    description: body.description?.trim() || "",
    started_on: body.started_on || "",
    target_completion: body.target_completion || ""
  };
}

function validateProjectForm(formData) {
  const errors = [];

  if (!formData.car_id || Number.isNaN(formData.car_id)) {
    errors.push("Please choose a valid car.");
  }

  if (!formData.title) {
    errors.push("Project title is required.");
  }

  if (!formData.description) {
    errors.push("Project description is required.");
  }

  if (formData.description.length < 15) {
    errors.push("Project description should be at least 15 characters.");
  }

  return errors;
}

export async function getAccountDashboardData(userId) {
  const totalProjects = await countProjectsByUserId(userId);
  const projects = await getProjectsByUserId(userId);

  return {
    totalProjects,
    projects
  };
}

export async function buildProjectsPage(req, res, next) {
  try {
    const projects = await getProjectsByUserId(req.session.user.user_id);

    res.render("projects/index", {
      title: "My Restoration Projects",
      projects,
      statusOptions: allowedStatuses
    });
  } catch (error) {
    next(error);
  }
}

export async function buildCreateProjectPage(req, res, next) {
  try {
    const cars = await getAllCars();
    const selectedCarId = req.query.carId ? Number(req.query.carId) : "";

    res.render("projects/create", {
      title: "Start Restoration Project",
      errors: [],
      cars,
      formData: {
        car_id: selectedCarId,
        title: "",
        description: "",
        started_on: "",
        target_completion: ""
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createProjectSubmission(req, res, next) {
  try {
    const cars = await getAllCars();
    const formData = normalizeProjectForm(req.body);
    const errors = validateProjectForm(formData);

    const selectedCar = await getCarById(formData.car_id);
    if (!selectedCar) {
      errors.push("The selected car does not exist.");
    }

    if (errors.length > 0) {
      return res.status(400).render("projects/create", {
        title: "Start Restoration Project",
        errors,
        cars,
        formData
      });
    }

    await createProject({
      userId: req.session.user.user_id,
      carId: formData.car_id,
      title: formData.title,
      description: formData.description,
      startedOn: formData.started_on,
      targetCompletion: formData.target_completion
    });

    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
}

export async function buildEditProjectPage(req, res, next) {
  try {
    const projectId = Number(req.params.projectId);
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", { title: "Project Not Found" });
    }

    if (project.user_id !== req.session.user.user_id) {
      return res
        .status(403)
        .send("You can only edit your own projects.");
    }

    const history = await getProjectStatusHistory(projectId);

    res.render("projects/edit", {
      title: "Edit Restoration Project",
      errors: [],
      project,
      history,
      formData: {
        title: project.title,
        description: project.description,
        started_on: project.started_on
          ? new Date(project.started_on).toISOString().split("T")[0]
          : "",
        target_completion: project.target_completion
          ? new Date(project.target_completion).toISOString().split("T")[0]
          : ""
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectSubmission(req, res, next) {
  try {
    const projectId = Number(req.params.projectId);
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", { title: "Project Not Found" });
    }

    if (project.user_id !== req.session.user.user_id) {
      return res
        .status(403)
        .send("You can only edit your own projects.");
    }

    const formData = {
      title: req.body.title?.trim() || "",
      description: req.body.description?.trim() || "",
      started_on: req.body.started_on || "",
      target_completion: req.body.target_completion || ""
    };

    const errors = [];

    if (!formData.title) {
      errors.push("Project title is required.");
    }

    if (!formData.description) {
      errors.push("Project description is required.");
    }

    if (formData.description.length < 15) {
      errors.push("Project description should be at least 15 characters.");
    }

    if (errors.length > 0) {
      const history = await getProjectStatusHistory(projectId);

      return res.status(400).render("projects/edit", {
        title: "Edit Restoration Project",
        errors,
        project,
        history,
        formData
      });
    }

    await updateProject(projectId, req.session.user.user_id, {
      title: formData.title,
      description: formData.description,
      startedOn: formData.started_on,
      targetCompletion: formData.target_completion
    });

    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectSubmission(req, res, next) {
  try {
    const projectId = Number(req.params.projectId);
    const deletedProject = await deleteProject(
      projectId,
      req.session.user.user_id
    );

    if (!deletedProject) {
      return res
        .status(404)
        .send("Project not found or you do not have permission to delete it.");
    }

    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
}

export async function buildManageProjectsPage(req, res, next) {
  try {
    const projects = await getAllProjects();

    res.render("projects/manage", {
      title: "Manage Restoration Projects",
      projects,
      statusOptions: allowedStatuses
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectStatusSubmission(req, res, next) {
  try {
    const projectId = Number(req.params.projectId);
    const status = req.body.status?.trim() || "";
    const notes = req.body.notes?.trim() || "";

    if (!allowedStatuses.includes(status)) {
      return res.status(400).send("Invalid project status.");
    }

    await updateProjectStatus(
      projectId,
      status,
      notes,
      req.session.user.user_id
    );

    res.redirect("/projects/manage");
  } catch (error) {
    next(error);
  }
}