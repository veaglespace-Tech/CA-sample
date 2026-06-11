import * as eventModule from "../../services/events.js";

export async function listEvents(req, res) {
  try {
    const events = await eventModule.fetchPublishedEvents();
    res.status(200).json({ ok: true, data: events });
  } catch (error) {
    console.error("Error listing events:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch events." });
  }
}

export async function getEvent(req, res) {
  try {
    const { slug } = req.params;
    const event = await eventModule.fetchEventBySlug(slug);

    if (!event) {
      return res.status(404).json({ ok: false, message: "Event not found." });
    }

    res.status(200).json({ ok: true, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch event." });
  }
}

export async function registerForEvent(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, city } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ ok: false, message: "Name, email, and phone are required." });
    }
    
    const registration = await eventModule.registerForEventService(id, { name, email, phone, city });
    res.status(201).json({ ok: true, data: registration });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ ok: false, message: "Failed to register for event." });
  }
}
