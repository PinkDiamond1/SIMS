import * as faker from "faker";
import { Institution, InstitutionType } from "../../database/entities";

export function createFakeInstitution(): Institution {
  const institution = new Institution();
  institution.businessGuid = faker.random.uuid();
  institution.legalOperatingName = faker.company.companyName();
  institution.operatingName = faker.company.companySuffix();
  institution.primaryPhone = faker.phone.phoneNumber();
  institution.primaryEmail = faker.internet.email();
  institution.website = faker.internet.url();
  institution.regulatingBody = "Regulating Body";
  institution.establishedDate = faker.date.past(20);
  institution.institutionType = {
    id: 1,
    name: "BC Private",
  } as InstitutionType;
  institution.institutionPrimaryContact = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
  };
  institution.institutionAddress = {
    mailingAddress: {
      addressLine1: faker.address.streetAddress(),
      addressLine2: faker.address.secondaryAddress(),
      provinceState: "BC",
      country: "CAN",
      city: "Victoria",
      postalCode: faker.address.zipCode("A9A9A9"),
    },
  };
  return institution;
}
