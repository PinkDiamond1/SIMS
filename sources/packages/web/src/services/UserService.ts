import ApiClient from "./http/ApiClient";
import {
  BCeIDDetailsDto,
  BCeIDAccountsDto,
  InstitutionUserDetailsDto,
  InstitutionUserPersistDto,
} from "../types/contracts/UserContract";

export class UserService {
  // Share Instance
  private static instance: UserService;

  public static get shared(): UserService {
    return this.instance || (this.instance = new this());
  }

  async getBCeIDAccountDetails(authHeader?: any): Promise<BCeIDDetailsDto> {
    return ApiClient.User.bceidAccount(authHeader);
  }

  async getBCeIDAccounts(authHeader?: any): Promise<BCeIDAccountsDto | null> {
    try {
      return await ApiClient.User.bceidAccounts(authHeader);
    } catch (excp) {
      return null;
    }
  }

  async getInstitutionUser(): Promise<InstitutionUserDetailsDto> {
    return ApiClient.User.getinstitutionUser();
  }

  async updateInstitutionUser(data: InstitutionUserPersistDto): Promise<void> {
    return ApiClient.User.updateInstitutionUser(data);
  }

  /**
   * Tries to create/update the AEST user.
   * @returns true if the user was successfully created/updated or
   * false if the user do not have permission to access the system.
   */
  async syncAESTUser(authHeader?: any): Promise<boolean> {
    return ApiClient.User.syncAESTUser(authHeader);
  }
}
