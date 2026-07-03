"use client";

import StaffOverview from "./overview/StaffOverview";
import ClientOverview from "./overview/ClientOverview";

export default function OverviewSection(props) {
  if (props.isStaff) {
    return <StaffOverview {...props} />;
  }
  return <ClientOverview {...props} />;
}
