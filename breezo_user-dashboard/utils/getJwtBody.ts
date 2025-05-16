"use client";

export function decryptJwtPayload(token: string | undefined) {
  if (!token) return {};

  const jwtSections = token.split(".");

  return JSON.parse(atob(jwtSections[1]));
}
