import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ColumnNames, TableNames } from "../constant";
import { RecordDataModel } from "./record.model";
import { InstitutionUser } from "./institution-user.model";
import { InstitutionType } from "./institution-type.model";
import { Note } from ".";
import { AddressInfo } from "./address.type";
import { PrimaryContact } from "./primary-contact.type";

export interface InstitutionAddress {
  mailingAddress: AddressInfo;
}

@Entity({ name: TableNames.Institution })
export class Institution extends RecordDataModel {
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * Business identifier of an institution.
   */
  @Column({
    name: "business_guid",
  })
  businessGuid: string;

  @Column({
    name: "legal_operating_name",
  })
  legalOperatingName: string;

  @Column({
    name: "operating_name",
    nullable: true,
  })
  operatingName: string;

  @Column({
    name: "primary_phone",
  })
  primaryPhone: string;

  @Column({
    name: "primary_email",
  })
  primaryEmail: string;

  @Column({
    name: "website",
  })
  website: string;
  @Column({
    name: "regulating_body",
  })
  regulatingBody: string;

  @Column({
    name: "established_date",
  })
  establishedDate: Date;

  @Column({
    name: "primary_contact",
    type: "jsonb",
    nullable: false,
  })
  institutionPrimaryContact: PrimaryContact;

  @Column({
    name: "institution_address",
    type: "jsonb",
  })
  institutionAddress: InstitutionAddress;

  @OneToMany((type) => InstitutionUser, (user) => user.institution, {
    eager: false,
    cascade: false,
  })
  users: InstitutionUser[];

  @RelationId((institution: Institution) => institution.institutionType)
  institutionTypeId: number;

  @ManyToOne(() => InstitutionType, { eager: false, cascade: false })
  @JoinColumn({
    name: "institution_type_id",
    referencedColumnName: ColumnNames.ID,
  })
  institutionType: InstitutionType;

  @ManyToMany(() => Note, { eager: false, cascade: true })
  @JoinTable({
    name: TableNames.InstitutionNotes,
    joinColumn: { name: ColumnNames.InstitutionId },
    inverseJoinColumn: { name: ColumnNames.NoteId },
  })
  notes: Note[];
}
