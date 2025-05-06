const { z } = require("zod");

const busSchema = z.object({
  upcommingTripId: z.string().min(1),
  driverId: z.string().optional(),
  companyId: z.string().min(1),
  name: z.string().min(1),
  number: z.string().min(1),
});

module.exports = busSchema;
