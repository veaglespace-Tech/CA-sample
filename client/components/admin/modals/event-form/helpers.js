"use client";

import { validateRequired, validateSlug, validateUrl } from "../../../../lib/validators";

const TIME_12H_REGEX = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
const LOCATION_REGEX = /^[a-zA-Z0-9\s,.'()#&/-]+$/;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const INITIAL_EVENT_FORM = {
  title: "",
  slug: "",
  description: "",
  date: "",
  time: "",
  location: "",
  imageUrl: "",
  image: null,
  videoUrl: "",
  status: "PUBLISHED",
};

export function createEventFormState(editingEvent) {
  if (!editingEvent) {
    return { ...INITIAL_EVENT_FORM };
  }

  return {
    title: editingEvent.title || "",
    slug: editingEvent.slug || "",
    description: editingEvent.description || "",
    date: editingEvent.date?.split("T")[0] || "",
    time: editingEvent.time || "",
    location: editingEvent.location || "",
    imageUrl: editingEvent.imageUrl || "",
    image: null,
    videoUrl: editingEvent.videoUrl || "",
    status: editingEvent.status || "PUBLISHED",
  };
}

export function normalizeEventSlug(value) {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

export function validateEventImageFile(file) {
  if (!file) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, or WebP image";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must be 5 MB or less";
  }
  return null;
}

function validateDescription(value) {
  if (!value || !value.trim()) return "Description is required";
  const trimmed = value.trim();
  if (trimmed.length < 20) return "Description must be at least 20 characters long";
  if (trimmed.length > 1000) return "Description cannot exceed 1000 characters";
  return null;
}

function validateTime(value) {
  if (!value || !value.trim()) return "Time is required";
  if (!TIME_12H_REGEX.test(value.trim())) {
    return "Use a valid time like 10:00 AM";
  }
  return null;
}

function validateLocation(value) {
  if (!value || !value.trim()) return "Location is required";
  const trimmed = value.trim();
  if (trimmed.length < 2) return "Location must be at least 2 characters long";
  if (trimmed.length > 120) return "Location cannot exceed 120 characters";
  if (!LOCATION_REGEX.test(trimmed)) return "Location contains invalid characters";
  return null;
}

export function validateEventForm(eventForm, { isEditing = false } = {}) {
  const errors = {};

  const titleErr = validateRequired(eventForm.title, "Title");
  const slugErr = validateSlug(eventForm.slug);
  const descriptionErr = validateDescription(eventForm.description);
  const dateErr = validateRequired(eventForm.date, "Date");
  const timeErr = validateTime(eventForm.time);
  const locationErr = validateLocation(eventForm.location);
  const imageErr = !isEditing && !eventForm.imageUrl
    ? "Event banner image is required"
    : validateEventImageFile(eventForm.image);

  if (titleErr) errors.title = titleErr;
  if (slugErr) errors.slug = slugErr;
  if (descriptionErr) errors.description = descriptionErr;
  if (dateErr) errors.date = dateErr;
  if (timeErr) errors.time = timeErr;
  if (locationErr) errors.location = locationErr;
  if (imageErr) errors.image = imageErr;

  if (eventForm.videoUrl) {
    const urlErr = validateUrl(eventForm.videoUrl, false);
    if (urlErr) errors.videoUrl = urlErr;
  }

  return errors;
}

export function buildEventSubmitData(eventForm) {
  const submitData = {
    title: eventForm.title,
    slug: eventForm.slug,
    description: eventForm.description,
    date: eventForm.date,
    time: eventForm.time,
    location: eventForm.location,
    videoUrl: eventForm.videoUrl,
    status: eventForm.status,
  };

  if (eventForm.image) {
    submitData.image = eventForm.image;
  } else if (
    typeof eventForm.imageUrl === "string" &&
    eventForm.imageUrl &&
    !eventForm.imageUrl.startsWith("blob:")
  ) {
    submitData.imageUrl = eventForm.imageUrl;
  }

  return submitData;
}
