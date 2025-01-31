export default class StudentNoteRestrictionsObject {
  addRestrictionsButton() {
    return cy.get("[data-cy='addRestrictionButton']");
  }

  addNewRestrictionsText() {
    return cy.contains("Add new restriction");
  }

  emptyDropdownMessage() {
    return cy.contains("No choices to choose from");
  }

  addRestrictionsDialogBox() {
    return cy.xpath("//button[normalize-space()='Add Restriction']");
  }

  categoryErrorMessage() {
    return cy.contains("Category is required");
  }

  reasonErrorMessage() {
    return cy.contains("Reason is required");
  }

  cancelButton() {
    return cy.contains("Cancel");
  }

  allRestrictions() {
    return cy.contains("All Restrictions");
  }

  addRestrictionButtonDialogBox() {
    return cy.xpath("//button[normalize-space()='Add Restriction']");
  }

  restrictionsDropdownCategory() {
    return cy.xpath("//div[@id='ew2twj7']//div[@role='combobox']");
  }

  restrictionsValueCategory() {
    return cy.xpath("//div[@id='ew2twj7']//input[@role='textbox']");
  }

  restrictionsDropdownReason() {
    return cy.xpath("//div[@id='etm8wyi']//div[@role='combobox']");
  }

  restrictionsValueReason() {
    return cy.xpath("//div[@id='etm8wyi']//input[@role='textbox']");
  }

  noteDropdown() {
    return cy.xpath("//div[@role='combobox']");
  }

  noteValue() {
    return cy.xpath("//input[@role='textbox']");
  }

  clearButton() {
    return cy.get(".choices__button");
  }

  restrictionsAddedText() {
    return cy.contains("Restriction Added");
  }

  notesInputText() {
    return cy.get("textarea[name='data[noteDescription]']");
  }

  categoryButton() {
    return cy.contains("Category");
  }

  firstRowButtonRestrictions() {
    return cy.xpath("//tbody/tr[1]/td[6]");
  }

  categoryAssertion(category: string) {
    return cy.contains(category);
  }

  reasonAssertion(reason: string) {
    return cy.contains(reason);
  }

  resolveRestrictionsButton() {
    return cy.contains("Resolve Restriction");
  }

  resolutionNoteRequired() {
    return cy.contains("Resolution Notes is required");
  }

  resolutionNotesInputText() {
    return cy.get("textarea[name='data[resolutionNote]']");
  }

  restrictionsResolvedAssertion() {
    return cy.contains("Restriction Resolved");
  }

  notesSectionButton() {
    return cy.contains("Notes");
  }

  createNewNoteButton() {
    return cy.contains("Create new note");
  }

  noteBodyInputText() {
    return cy.get("textarea[name='data[description]']");
  }

  addNoteButton() {
    return cy.contains("Add note");
  }

  noteTypeErrorMessage() {
    return cy.contains("Note Type is required");
  }

  noteBodyErrorMessage() {
    return cy.contains("Note Body is required");
  }

  noteAddedSuccessfully() {
    return cy.contains("Note added successfully");
  }

  noteTypeAssertion(type: string) {
    return cy.contains(type);
  }

  noteBodyAssertion(body: string) {
    return cy.contains(body);
  }

  generalTabButton() {
    return cy.get(".text-center > .float-right > :nth-child(2)");
  }

  restrictionsTabButton() {
    return cy.get(".text-center > .float-right > :nth-child(3)");
  }

  systemActionsTabButton() {
    return cy.get(".text-center > .float-right > :nth-child(4)");
  }
}
