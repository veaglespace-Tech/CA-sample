export const PERMISSIONS_SCHEMA = {
  leads: {
    label: "Service Leads",
    color: "violet",
    actions: {
      view: "View all service leads",
      changeStatus: "Change lead status",
      addNotes: "Add internal notes to a lead",
      sendMessage: "Send messages to lead clients",
      requestDocuments: "Request documents from lead clients",
      verifyDocuments: "Verify or reject lead documents",
      delete: "Permanently delete a lead",
    },
  },
  registrations: {
    label: "Registrations",
    color: "emerald",
    actions: {
      view: "View all registration requests",
      changeStatus: "Change registration status",
      sendMessage: "Send messages to registered clients",
      requestDocuments: "Request documents from clients",
      verifyDocuments: "Verify or reject client documents",
      delete: "Permanently delete a registration",
    },
  },
  users: {
    label: "User Management",
    color: "blue",
    actions: {
      view: "View all client accounts",
      create: "Create new client accounts",
      edit: "Edit client profile details",
      delete: "Permanently delete a client account",
      sendMessage: "Send direct messages to clients",
    },
  },
  contacts: {
    label: "Contact Queries",
    color: "cyan",
    actions: {
      view: "View contact form submissions",
      changeStatus: "Change contact query status",
      sendMessage: "Reply to contact queries",
      delete: "Delete contact queries",
    },
  },
  events: {
    label: "Platform Events",
    color: "amber",
    actions: {
      view: "View all events",
      create: "Create new events",
      edit: "Edit event details",
      delete: "Delete events",
      sendInvitation: "Send invitations to event attendees",
    },
  },
  plans: {
    label: "Service Plans",
    color: "orange",
    actions: {
      view: "View service plans",
      create: "Create new plans",
      edit: "Edit plan details",
      assign: "Assign plans to client accounts",
      delete: "Delete service plans",
    },
  },
  articles: {
    label: "Blog Articles",
    color: "rose",
    actions: {
      view: "View all articles",
      create: "Write and publish new articles",
      edit: "Edit existing articles",
      delete: "Delete articles",
    },
  },
  repository: {
    label: "Doc Repository",
    color: "slate",
    actions: {
      view: "View the shared document repository",
      upload: "Upload documents to the repository",
      edit: "Edit repository documents",
      share: "Share repository documents",
      delete: "Delete repository documents",
    },
  },
  newsletter: {
    label: "Newsletter",
    color: "pink",
    actions: {
      view: "View newsletter subscribers",
      sendEmail: "Send newsletter emails",
    },
  },
  referrals: {
    label: "Referrals",
    color: "teal",
    actions: {
      view: "View referral submissions",
      changeStatus: "Change referral status",
      setReward: "Set referral reward rules",
    },
  },
  payments: {
    label: "Paid Clients",
    color: "green",
    actions: {
      view: "View payment records",
      sendMessage: "Contact paid clients",
    },
  },
};

export function buildDefaultPermissions() {
  const defaults = {};
  for (const [moduleKey, moduleValue] of Object.entries(PERMISSIONS_SCHEMA)) {
    defaults[moduleKey] = {};
    for (const actionKey of Object.keys(moduleValue.actions)) {
      defaults[moduleKey][actionKey] = true;
    }
  }
  return defaults;
}

export function sanitizePermissions(input) {
  const result = {};
  for (const [moduleKey, moduleValue] of Object.entries(PERMISSIONS_SCHEMA)) {
    result[moduleKey] = {};
    for (const actionKey of Object.keys(moduleValue.actions)) {
      result[moduleKey][actionKey] =
        input?.[moduleKey]?.[actionKey] !== undefined
          ? Boolean(input[moduleKey][actionKey])
          : true;
    }
  }
  return result;
}
