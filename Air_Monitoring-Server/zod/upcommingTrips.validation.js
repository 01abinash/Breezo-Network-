const { z } = require("zod");

const upcommingTripsSchema = z.object({
  companyId: z.string().min(1),
  driverId: z.string().optional(),
  pickUpPoint: z.string().min(1),
  destination: z.string().min(1),
  departureTime: z.string().min(1),
  banner: z.string().optional(),
  passngerIds: z.array(z.string()).optional(),
  Status: z.string().optional(),
  price: z.number().min(1),
  image: z.string().optional(),
});

module.exports = upcommingTripsSchema;
