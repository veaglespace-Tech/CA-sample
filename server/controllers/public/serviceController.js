import * as serviceModule from "../../services/services.js";

export async function listServices(req, res) {
  try {
    const categories = await serviceModule.fetchCategoriesAndServices();
    res.status(200).json({ ok: true, data: categories });
  } catch (error) {
    console.error("Error listing services:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch services." });
  }
}

export async function getService(req, res) {
  try {
    const { slug } = req.params;
    const service = await serviceModule.fetchServiceBySlug(slug);

    if (!service) {
      return res.status(404).json({ ok: false, error: "Service not found" });
    }

    res.status(200).json({ ok: true, data: service });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch service." });
  }
}
