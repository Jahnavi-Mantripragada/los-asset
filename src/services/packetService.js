// Mock LMS packet service.
//
// There is no real LMS integration yet. Both functions below simulate one:
// they return the same shape a real LMS call would, after a short delay, so
// the Packet Selection UI behaves as if it were talking to a live API.
//
// To connect the real LMS later, replace the body of validatePacket() and
// fetchAvailablePacket() with the actual API calls (e.g. plain fetch(), the
// same way src/services/customerSearchService.js does it) and keep the
// function signatures and return shapes the same - the UI does not need to
// change.

import { LMS_MOCK_CUSTOMERS } from "../data/lmsMockCustomers";

const MOCK_REQUEST_DELAY_MS = 900;

// Edit this list to change what the mock "LMS" knows about: add/remove
// packets, change branches/sizes, or flip status to "Allocated" to make a
// packet unavailable for testing. Ids follow the LMS team's mock numbering
// (9 digits, 1100001xx); these are fabricated in that series.
const mockPackets = [
  { packetId: "110000125", branch: "Pune - Deccan Gymkhana", packetSize: "Small", ornamentCount: 2, packetWeight: 25.4, status: "Available" },
  { packetId: "110000126", branch: "Pune - Deccan Gymkhana", packetSize: "Medium", ornamentCount: 3, packetWeight: 42.5, status: "Available" },
  { packetId: "110000127", branch: "Mumbai - Andheri East", packetSize: "Large", ornamentCount: 5, packetWeight: 78.2, status: "Available" },
  { packetId: "110000128", branch: "Pune - Deccan Gymkhana", packetSize: "Medium", ornamentCount: 4, packetWeight: 55.0, status: "Allocated" },
];

// The LMS team's own packets (see src/data/lmsMockCustomers.js). Each is
// reserved for its own application: never handed out by a normal fetch, and
// only accepted when that application asks for it via preferredPacketId. The
// LMS data has no branch or size for them, so they take whatever the
// appraiser selected; count and weight come from the LMS ornaments.
const lmsPackets = LMS_MOCK_CUSTOMERS.map((entry) => ({
  packetId: entry.packetId,
  ornamentCount: entry.ornaments.reduce((sum, ornament) => sum + ornament.units, 0),
  packetWeight: entry.ornaments.reduce((sum, ornament) => sum + ornament.grossWeight, 0),
}));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toPacketDetails = (packet) => ({
  packetId: packet.packetId,
  packetSize: packet.packetSize,
  branch: packet.branch,
  ornamentCount: packet.ornamentCount,
  packetWeight: packet.packetWeight,
});

const toLmsPacketDetails = (packet, { branch, packetSize }) =>
  toPacketDetails({ ...packet, branch, packetSize });

export async function validatePacket({ packetId, branch, packetSize, preferredPacketId }) {
  await delay(MOCK_REQUEST_DELAY_MS);

  // TODO(real LMS): replace this lookup with something like
  // POST /lms/packets/validate { packetId, branch, packetSize }
  const normalizedId = String(packetId || "").trim().toUpperCase();

  const reserved = lmsPackets.find((entry) => entry.packetId === normalizedId);
  if (reserved) {
    return reserved.packetId === preferredPacketId
      ? { available: true, packet: toLmsPacketDetails(reserved, { branch, packetSize }) }
      : { available: false, message: `Packet ${reserved.packetId} is already allocated and unavailable.` };
  }

  const packet = mockPackets.find((entry) => entry.packetId.toUpperCase() === normalizedId);

  if (!packet) {
    return { available: false, message: `Packet ID "${packetId}" was not found.` };
  }
  if (branch && packet.branch !== branch) {
    return { available: false, message: `Packet ${packet.packetId} belongs to ${packet.branch}, not ${branch}.` };
  }
  if (packetSize && packet.packetSize !== packetSize) {
    return { available: false, message: `Packet ${packet.packetId} is a ${packet.packetSize} packet, not ${packetSize}.` };
  }
  if (packet.status !== "Available") {
    return { available: false, message: `Packet ${packet.packetId} is already allocated and unavailable.` };
  }

  return { available: true, packet: toPacketDetails(packet) };
}

export async function fetchAvailablePacket({ branch, packetSize, preferredPacketId }) {
  await delay(MOCK_REQUEST_DELAY_MS);

  // TODO(real LMS): replace this lookup with something like
  // GET /lms/packets/available?branch=...&packetSize=...
  const reserved = lmsPackets.find((entry) => entry.packetId === preferredPacketId);
  if (reserved) return toLmsPacketDetails(reserved, { branch, packetSize });

  const packet = mockPackets.find(
    (entry) => entry.branch === branch && entry.packetSize === packetSize && entry.status === "Available",
  );

  if (!packet) {
    throw new Error(
      `No available ${packetSize || "packet"} was found at ${branch || "the selected branch"}.`,
    );
  }

  return toPacketDetails(packet);
}
