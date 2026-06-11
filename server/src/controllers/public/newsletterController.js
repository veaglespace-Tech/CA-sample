import * as newsletterModule from "../../services/newsletterService.js";

export async function subscribeNewsletter(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ ok: false, error: "Email is required" });
    }
    const subscriber = await newsletterModule.insertSubscriber(email);
    res.status(201).json({ ok: true, data: subscriber });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || "Failed to subscribe" });
  }
}

export async function getNewsletterSubscribers(req, res) {
  try {
    const subscribers = await newsletterModule.fetchAllSubscribers();
    res.status(200).json({ ok: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch newsletter subscribers" });
  }
}
