/**
 * Authorized parties recognized by the API.
 * This is present on azp token claim.
 */
export enum AuthorizedParties {
  institution = "institution",
  student = "student",
  formsFlowBPM = "forms-flow-bpm",
  aest = "aest",
  supportingUsers = "supporting-users",
}
