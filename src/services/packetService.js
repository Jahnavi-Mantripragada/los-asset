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

const MOCK_REQUEST_DELAY_MS = 900;

// Edit this list to change what the mock "LMS" knows about: add/remove
// packets, change branches/sizes, or flip status to "Allocated" to make a
// packet unavailable for testing.
const mockPackets = [
  { packetId: "PKT-00125", branch: "Bangalore Main Branch", packetSize: "Small", ornamentCount: 2, packetWeight: 25.4, status: "Available" },
  { packetId: "PKT-00126", branch: "Bangalore Main Branch", packetSize: "Medium", ornamentCount: 3, packetWeight: 42.5, status: "Available" },
  { packetId: "PKT-00127", branch: "Hyderabad Main Branch", packetSize: "Large", ornamentCount: 5, packetWeight: 78.2, status: "Available" },
  { packetId: "PKT-00128", branch: "Bangalore Main Branch", packetSize: "Medium", ornamentCount: 4, packetWeight: 55.0, status: "Allocated" },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toPacketDetails = (packet) => ({
  packetId: packet.packetId,
  packetSize: packet.packetSize,
  branch: packet.branch,
  ornamentCount: packet.ornamentCount,
  packetWeight: packet.packetWeight,
});

export async function validatePacket({ packetId, branch, packetSize }) {
  await delay(MOCK_REQUEST_DELAY_MS);

  // TODO(real LMS): replace this lookup with something like
  // POST /lms/packets/validate { packetId, branch, packetSize }
  const normalizedId = String(packetId || "").trim().toUpperCase();
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

export async function fetchAvailablePacket({ branch, packetSize }) {
  await delay(MOCK_REQUEST_DELAY_MS);

  // TODO(real LMS): replace this lookup with something like
  // GET /lms/packets/available?branch=...&packetSize=...
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
