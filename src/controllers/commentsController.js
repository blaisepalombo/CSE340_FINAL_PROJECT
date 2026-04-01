import { getCarById, getCarImagesByCarId } from "../models/carsModel.js";
import {
  createComment,
  deleteCommentById,
  deleteOwnComment,
  getAllComments,
  getCommentById,
  getCommentsByCarId,
  updateComment
} from "../models/commentsModel.js";

function normalizeCommentText(commentText = "") {
  return commentText.trim().replace(/\s+/g, " ");
}

function validateCommentText(commentText) {
  const errors = [];

  if (!commentText) {
    errors.push("Comment cannot be empty.");
  }

  if (commentText.length < 5) {
    errors.push("Comment must be at least 5 characters long.");
  }

  if (commentText.length > 1000) {
    errors.push("Comment cannot be longer than 1000 characters.");
  }

  return errors;
}

async function renderCarDetailWithComments(res, {
  carId,
  title,
  errors = [],
  commentFormData = {},
  editingCommentId = null
}) {
  const car = await getCarById(carId);

  if (!car) {
    return res.status(404).render("404", { title: "Car Not Found" });
  }

  const images = await getCarImagesByCarId(carId);
  const comments = await getCommentsByCarId(carId);

  return res.status(errors.length > 0 ? 400 : 200).render("cars/detail", {
    title: title || `${car.year} ${car.make} ${car.model}`,
    car,
    images,
    comments,
    errors,
    commentFormData,
    editingCommentId
  });
}

export async function createCommentSubmission(req, res, next) {
  try {
    const carId = Number(req.params.carId);
    const commentText = normalizeCommentText(req.body.comment_text || "");
    const errors = validateCommentText(commentText);

    const car = await getCarById(carId);
    if (!car) {
      return res.status(404).render("404", { title: "Car Not Found" });
    }

    if (errors.length > 0) {
      return renderCarDetailWithComments(res, {
        carId,
        title: `${car.year} ${car.make} ${car.model}`,
        errors,
        commentFormData: { comment_text: commentText }
      });
    }

    await createComment({
      userId: req.session.user.user_id,
      carId,
      commentText
    });

    res.redirect(`/cars/${carId}#comments`);
  } catch (error) {
    next(error);
  }
}

export async function updateCommentSubmission(req, res, next) {
  try {
    const commentId = Number(req.params.commentId);
    const existingComment = await getCommentById(commentId);

    if (!existingComment) {
      return res.status(404).send("Comment not found.");
    }

    if (existingComment.user_id !== req.session.user.user_id) {
      return res.status(403).send("You can only edit your own comments.");
    }

    const commentText = normalizeCommentText(req.body.comment_text || "");
    const errors = validateCommentText(commentText);

    if (errors.length > 0) {
      return renderCarDetailWithComments(res, {
        carId: existingComment.car_id,
        title: "Car Detail",
        errors,
        commentFormData: { comment_text: commentText },
        editingCommentId: existingComment.comment_id
      });
    }

    await updateComment(commentId, req.session.user.user_id, commentText);

    res.redirect(`/cars/${existingComment.car_id}#comments`);
  } catch (error) {
    next(error);
  }
}

export async function deleteOwnCommentSubmission(req, res, next) {
  try {
    const commentId = Number(req.params.commentId);
    const existingComment = await getCommentById(commentId);

    if (!existingComment) {
      return res.status(404).send("Comment not found.");
    }

    const deletedComment = await deleteOwnComment(
      commentId,
      req.session.user.user_id
    );

    if (!deletedComment) {
      return res.status(403).send("You can only delete your own comments.");
    }

    res.redirect(`/cars/${existingComment.car_id}#comments`);
  } catch (error) {
    next(error);
  }
}

export async function buildManageCommentsPage(req, res, next) {
  try {
    const comments = await getAllComments();

    res.render("comments/manage", {
      title: "Manage Comments",
      comments
    });
  } catch (error) {
    next(error);
  }
}

export async function moderateDeleteCommentSubmission(req, res, next) {
  try {
    const commentId = Number(req.params.commentId);
    const existingComment = await getCommentById(commentId);

    if (!existingComment) {
      return res.status(404).send("Comment not found.");
    }

    await deleteCommentById(commentId);

    res.redirect("/comments/manage");
  } catch (error) {
    next(error);
  }
}