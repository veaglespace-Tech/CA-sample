import * as leadsModule from "../../services/leads.js";
import * as registrationsModule from "../../services/registrations.js";
import * as contactModule from "../../services/contactService.js";
import { getClientMeta } from "../../utils/core.js";
import { hasAdminPermission } from "../../features/admin-permissions/service.js";

export async function createConsultation(req, res) {
  try {
    const meta = getClientMeta(req);
    const lead = await leadsModule.insertLead(req.body, meta, {
      source: "SERVICE_PAGE",
      formType: "CONSULTATION",
      userId: req.user?.id,
    });
    res.status(201).json({ ok: true, data: lead });
  } catch (error) {
    if (error.message.includes("required")) return res.status(400).json({ ok: false, error: error.message });
    res.status(500).json({ ok: false, error: "Failed to create consultation lead" });
  }
}

export async function createContact(req, res) {
  try {
    const contact = await contactModule.insertContactQuery(req.body);
    res.status(201).json({ ok: true, data: contact });
  } catch (error) {
    console.error("Error creating contact query:", error);
    res.status(500).json({ ok: false, error: "Failed to create contact query" });
  }
}

export async function createTalkToExpert(req, res) {
  try {
    const meta = getClientMeta(req);
    const lead = await leadsModule.insertLead(req.body, meta, {
      source: "TALK_TO_EXPERT_PAGE",
      formType: "CALLBACK",
      userId: req.user?.id,
    });
    res.status(201).json({ ok: true, data: lead });
  } catch (error) {
    if (error.message.includes("required")) return res.status(400).json({ ok: false, error: error.message });
    res.status(500).json({ ok: false, error: "Failed to create callback lead" });
  }
}

export async function listLeads(req, res) {
  try {
    const leads = await leadsModule.fetchAllLeads();
    res.status(200).json({ ok: true, data: leads });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch leads" });
  }
}

export async function updateLeadStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ ok: false, error: "Status is required" });
    
    let result;
    try {
      if (!hasAdminPermission(req.user, "leads", "changeStatus")) {
        return res.status(403).json({ ok: false, message: "You do not have permission to change lead status." });
      }
      result = await leadsModule.updateLeadStatus(id, status);
    } catch (err) {
      // If not found in Lead, try RegistrationLead
      if (!hasAdminPermission(req.user, "registrations", "changeStatus")) {
        return res.status(403).json({ ok: false, message: "You do not have permission to change registration status." });
      }
      result = await registrationsModule.updateRegistrationStatus(id, status);
    }
    
    res.status(200).json({ ok: true, data: result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || "Failed to update status" });
  }
}

export async function addLeadNote(req, res) {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    if (!note) return res.status(400).json({ ok: false, error: "Note is required" });

    const newNote = await leadsModule.addLeadNote(id, userId, note);
    res.status(201).json({ ok: true, data: newNote });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || "Failed to add note" });
  }
}

// All Registration Leads goes from here
export async function createRegistration(req, res) {
  try {
    const meta = getClientMeta(req);
    const lead = await registrationsModule.insertRegistrationLead(req.body, meta, {
      source: "SERVICE_PAGE",
      formType: "REGISTRATION",
      userId: req.user?.id,
    });
    res.status(201).json({ ok: true, data: lead });
  } catch (error) {
    console.error("Error in createRegistrationLead:", error);
    if (error.message && error.message.includes("required")) {
      return res.status(400).json({ ok: false, error: error.message });
    }
    res.status(500).json({ ok: false, error: "Failed to create registration lead" });
  }
}

export async function updateRegistrationNextStep(req, res) {
  try {
    const { id } = req.params;
    const lead = await registrationsModule.updateRegistrationNextStep(id, req.body);
    res.status(200).json({ ok: true, data: lead });
  } catch (error) {
    console.error("Error in updateRegistrationNextStep:", error);
    res.status(500).json({ ok: false, error: "Failed to update registration lead with next step details" });
  }
}

export async function completeRegistrationPayment(req, res) {
  try {
    const { id } = req.params;
    const lead = await registrationsModule.updateRegistrationPayment(id);
    res.status(200).json({ ok: true, data: lead });
  } catch (error) {
    console.error("Error in completeRegistrationPayment:", error);
    res.status(500).json({ ok: false, error: "Failed to process registration payment" });
  }
}

export async function getMyServices(req, res) {
  try {
    const { id: userId, email, phone } = req.user;
    const data = await leadsModule.fetchUserServices(userId, email, phone);
    res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error("Error in getMyServices:", error);
    res.status(500).json({ ok: false, error: "Failed to fetch your services" });
  }
}
