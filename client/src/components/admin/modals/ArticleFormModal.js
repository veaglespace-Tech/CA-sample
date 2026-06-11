"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { validateUrl, validateRequired } from "../../../lib/validators";
import useLiveValidation from "../../../hooks/useLiveValidation";
import FormFeedback from "../../forms/FormFeedback";

function createInitialArticleForm(editingArticle) {
  if (!editingArticle) {
    return {
      title: "",
      excerpt: "",
      content: "",
      category: "BUSINESS",
      imageUrl: "",
      videoUrl: "",
      status: "DRAFT",
    };
  }

  return {
    ...editingArticle,
    excerpt: editingArticle.excerpt || "",
    videoUrl: editingArticle.videoUrl || "",
    content: editingArticle.content || "",
  };
}

/**
 * ArticleFormModal Component
 * Handles creating and editing blog articles with image upload and video URL.
 */
export default function ArticleFormModal({ editingArticle, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => createInitialArticleForm(editingArticle));
  const validators = {
    title: (value) => validateRequired(value, "Title"),
    content: (value) => validateRequired(value, "Content"),
    videoUrl: (value) => (value ? validateUrl(value, false) : null),
  };
  const { errors, validateField, validateForm, getFieldSuccess } = useLiveValidation(validators);

  const handleFieldChange = (name, value) => {
    const nextForm = { ...formData, [name]: value };
    setFormData(nextForm);
    if (validators[name]) {
      validateField(name, value, nextForm);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleFieldChange(name, value);
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  return (
    <div className="vs-modal-overlay">
      <div className="vs-modal-card" style={{ maxWidth: "800px" }}>
        <div className="vs-modal-header">
          <h3>{editingArticle ? "Edit Article" : "Create New Article"}</h3>
          <button className="vs-close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form className="vs-auth-form" onSubmit={handleSubmit} style={{ padding: "1.5rem" }} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="vs-form-group">
              <label>Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title || ""} 
                onChange={handleChange} 
                style={errors.title ? { borderColor: "var(--red, #ef4444)" } : getFieldSuccess("title", formData.title) ? { borderColor: "#16a34a", background: "rgba(240,253,244,0.65)" } : {}}
              />
              <FormFeedback error={errors.title} success={getFieldSuccess("title", formData.title)} />
            </div>
            <div className="vs-form-group">
              <label>Category</label>
              <select 
                name="category"
                value={formData.category || "BUSINESS"} 
                onChange={handleChange}
              >
                <option value="BUSINESS">Business</option>
                <option value="TAX">Tax & GST</option>
                <option value="LEGAL">Legal</option>
                <option value="COMPLIANCE">Compliance</option>
                <option value="UPDATES">Updates</option>
              </select>
            </div>
          </div>
          
          <div className="vs-form-group">
            <label>Excerpt (Short summary)</label>
            <input 
              type="text" 
              name="excerpt"
              value={formData.excerpt || ""} 
              onChange={handleChange} 
            />
          </div>

          <div className="vs-form-group">
            <label>Content (HTML/Text)</label>
            <textarea 
              name="content"
              rows="10" 
              value={formData.content || ""} 
              onChange={handleChange} 
              style={{ 
                width: "100%", 
                padding: "1rem", 
                borderRadius: "10px", 
                border: errors.content ? "1px solid #ef4444" : getFieldSuccess("content", formData.content) ? "1px solid #16a34a" : "1px solid #e2e8f0",
                background: getFieldSuccess("content", formData.content) ? "rgba(240,253,244,0.65)" : "#fff",
              }}
            ></textarea>
            <FormFeedback error={errors.content} success={getFieldSuccess("content", formData.content)} successMessage={`${(formData.content || "").trim().length} characters`} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="vs-form-group">
              <label>Article Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ padding: "0.5rem" }}
              />
              {(formData.image || formData.imageUrl) && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#64748b" }}>
                  {formData.image ? `Selected: ${formData.image.name}` : "Current image exists"}
                </div>
              )}
            </div>
            <div className="vs-form-group">
              <label>Video URL (YouTube/Vimeo)</label>
              <input 
                type="text" 
                name="videoUrl"
                value={formData.videoUrl || ""} 
                onChange={handleChange} 
                placeholder="https://youtube.com/..." 
                style={errors.videoUrl ? { borderColor: "var(--red, #ef4444)" } : getFieldSuccess("videoUrl", formData.videoUrl) ? { borderColor: "#16a34a", background: "rgba(240,253,244,0.65)" } : {}}
              />
              <FormFeedback error={errors.videoUrl} success={getFieldSuccess("videoUrl", formData.videoUrl)} successMessage="Video URL looks valid" />
            </div>
          </div>

          <div className="vs-form-group">
            <label>Status</label>
            <select 
              name="status"
              value={formData.status || "DRAFT"} 
              onChange={handleChange}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <button type="submit" className="vs-auth-btn" style={{ width: "100%", marginTop: "1rem" }}>
            {editingArticle ? "Update Article" : "Create Article"}
          </button>
        </form>
      </div>
    </div>
  );
}

