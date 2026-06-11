"use client";
import { useState } from "react";
import {
  buildEventSubmitData,
  createEventFormState,
  normalizeEventSlug,
  validateEventForm,
  validateEventImageFile,
} from "./event-form/helpers";
import useLiveValidation from "../../../hooks/useLiveValidation";
import FormFeedback from "../../forms/FormFeedback";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "500px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  field: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
  },
  textarea: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    minHeight: "80px",
  },
  errorField: {
    border: "1px solid #ef4444",
  },
  errorText: {
    fontSize: "0.75rem",
    color: "#ef4444",
    fontWeight: "600",
    marginTop: "0.25rem",
    display: "block",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  preview: {
    width: "100%",
    maxHeight: "150px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#334155",
  },
};

function getFieldStyle(hasError, baseStyle = styles.field) {
  return hasError ? { ...baseStyle, ...styles.errorField } : baseStyle;
}

export default function EventFormModal({ editingEvent, onClose, onSubmit }) {
  const [eventForm, setEventForm] = useState(() => createEventFormState(editingEvent));
  const validators = {
    title: (value, values) => validateEventForm({ ...values, title: value }, { isEditing: Boolean(editingEvent) }).title || null,
    slug: (value, values) => validateEventForm({ ...values, slug: value }, { isEditing: Boolean(editingEvent) }).slug || null,
    description: (value, values) => validateEventForm({ ...values, description: value }, { isEditing: Boolean(editingEvent) }).description || null,
    date: (value, values) => validateEventForm({ ...values, date: value }, { isEditing: Boolean(editingEvent) }).date || null,
    time: (value, values) => validateEventForm({ ...values, time: value }, { isEditing: Boolean(editingEvent) }).time || null,
    location: (value, values) => validateEventForm({ ...values, location: value }, { isEditing: Boolean(editingEvent) }).location || null,
  };
  const { errors, validateField, validateForm, getFieldSuccess, setErrors } = useLiveValidation(validators);

  const handleFieldChange = (name, value) => {
    const nextForm = { ...eventForm, [name]: value };
    setEventForm(nextForm);
    if (validators[name]) {
      validateField(name, value, nextForm);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileErr = validateEventImageFile(file);
    if (fileErr) {
      setErrors((prev) => ({ ...prev, image: fileErr }));
      return;
    }

    setEventForm((prev) => ({
      ...prev,
      image: file,
      imageUrl: URL.createObjectURL(file),
    }));
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {
      ...validateForm(eventForm),
      ...validateEventForm(eventForm, { isEditing: Boolean(editingEvent) }),
    };
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(buildEventSubmitData(eventForm));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{editingEvent ? "Edit Event" : "Add New Event"}</h3>
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={eventForm.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              style={getFieldStyle(Boolean(errors.title))}
            />
            <FormFeedback error={errors.title} success={getFieldSuccess("title", eventForm.title)} />
          </div>
          <div>
            <input
              type="text"
              placeholder="Slug (e.g. webinar-july)"
              value={eventForm.slug}
              onChange={(e) => handleFieldChange("slug", normalizeEventSlug(e.target.value))}
              style={getFieldStyle(Boolean(errors.slug))}
            />
            <FormFeedback error={errors.slug} success={getFieldSuccess("slug", eventForm.slug)} />
          </div>
          <div>
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              style={getFieldStyle(Boolean(errors.description), styles.textarea)}
            />
            <FormFeedback error={errors.description} success={getFieldSuccess("description", eventForm.description)} successMessage={`${eventForm.description.trim().length}/1000 characters`} />
          </div>
          <div style={styles.column}>
            <div style={styles.row}>
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                style={{ ...getFieldStyle(Boolean(errors.date)), flex: 1 }}
              />
              <input
                type="text"
                placeholder="Time (e.g. 10:00 AM)"
                value={eventForm.time}
                onChange={(e) => handleFieldChange("time", e.target.value)}
                style={{ ...getFieldStyle(Boolean(errors.time)), flex: 1 }}
              />
            </div>
            {(errors.date || errors.time) && (
              <div style={styles.column}>
                <FormFeedback error={errors.date} success={getFieldSuccess("date", eventForm.date)} />
                <FormFeedback error={errors.time} success={getFieldSuccess("time", eventForm.time)} />
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Location"
              value={eventForm.location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              style={getFieldStyle(Boolean(errors.location))}
            />
            <FormFeedback error={errors.location} success={getFieldSuccess("location", eventForm.location)} />
          </div>
          <div style={styles.column}>
            <label style={styles.label}>Event Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ ...getFieldStyle(Boolean(errors.image)), padding: "0.5rem" }}
            />
            <FormFeedback error={errors.image} success={Boolean(eventForm.imageUrl && !errors.image)} />
            {eventForm.imageUrl && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={eventForm.imageUrl}
                  alt="Preview"
                  style={styles.preview}
                />
              </div>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Event Video Link (Optional, e.g. YouTube URL)"
              value={eventForm.videoUrl}
              onChange={(e) => handleFieldChange("videoUrl", e.target.value)}
              style={getFieldStyle(Boolean(errors.videoUrl))}
            />
            <FormFeedback error={errors.videoUrl} success={getFieldSuccess("videoUrl", eventForm.videoUrl)} />
          </div>

          <div style={styles.column}>
            <label style={styles.label}>Event Status & Timeline Display</label>
            <select
              value={eventForm.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              style={styles.field}
            >
              <option value="PUBLISHED">Published: Auto-Sort (Based on Date)</option>
              <option value="UPCOMING">Published: Force as Upcoming Event</option>
              <option value="PAST">Published: Force as Past Event</option>
              <option value="DRAFT">Hidden: Save as Draft</option>
              <option value="ARCHIVED">Hidden: Archived</option>
            </select>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} className="vs-auth-ghost">Cancel</button>
            <button type="submit" className="vs-auth-btn">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
}
