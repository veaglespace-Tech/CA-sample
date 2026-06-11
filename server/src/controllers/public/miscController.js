import * as dashboardModule from "../../services/dashboard.js";
import * as searchModule from "../../services/search.js";
import { getClientMeta } from "../../utils/core.js";

/**
 * Aggregates summary statistics for authorized dashboards.
 */
export async function getDashboardSummary(req, res) {
  try {
    const summary = await dashboardModule.fetchDashboardSummary();
    res.status(200).json({ ok: true, data: summary });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch dashboard summary" });
  }
}

/**
 * Handles core platform searches.
 */
export async function createSearch(req, res) {
  try {
    const meta = getClientMeta(req);
    const result = await searchModule.executeSearch(req.body, meta);
    res.status(200).json({ ok: true, data: result });
  } catch (error) {
    if (error.message.includes("required")) return res.status(400).json({ ok: false, error: error.message });
    res.status(500).json({ ok: false, error: "Failed to execute search" });
  }
}
