<template>
  <modal-dialog-base :showDialog="showDialog" @dialogClosed="dialogClosed">
    <template v-slot:content>
      <v-container class="temporary-modal">
        <formio
          formName="addrestriction"
          @loaded="formLoaded"
          @changed="formChanged"
          @submitted="submitRestriction"
        ></formio>
      </v-container>
    </template>
    <template v-slot:footer>
      <check-permission-role :role="allowedRole">
        <template #="{ notAllowed }">
          <footer-buttons
            primaryLabel="Add Restriction"
            @primaryClick="addRestriction"
            @secondaryClick="dialogClosed"
            :disablePrimaryButton="notAllowed"
        /></template>
      </check-permission-role>
    </template>
  </modal-dialog-base>
</template>

<script lang="ts">
import { PropType, ref } from "vue";
import ModalDialogBase from "@/components/generic/ModalDialogBase.vue";
import { RestrictionService } from "@/services/RestrictionService";
import {
  useModalDialog,
  useFormioUtils,
  useFormioDropdownLoader,
} from "@/composables";
import { RestrictionEntityType, Role } from "@/types";
import CheckPermissionRole from "@/components/generic/CheckPermissionRole.vue";
import { AssignRestrictionAPIInDTO } from "@/services/http/dto";

export const CATEGORY_KEY = "category";
export default {
  components: { ModalDialogBase, CheckPermissionRole },
  emits: ["submitRestrictionData"],
  props: {
    entityType: {
      type: String,
      required: true,
    },
    allowedRole: {
      type: String as PropType<Role>,
      required: true,
    },
  },
  setup(props: any, context: any) {
    const { showDialog, showModal } = useModalDialog<void>();
    const formData = ref();
    const formioUtils = useFormioUtils();
    const formioDataLoader = useFormioDropdownLoader();

    const dialogClosed = () => {
      showDialog.value = false;
    };
    const formLoaded = async (form: any) => {
      formData.value = form;
      const dropdown = formioUtils.getComponent(form, CATEGORY_KEY);
      const categories =
        await RestrictionService.shared.getRestrictionCategories();
      const options = [{}];
      // Restriction category Designation is exclusively for Institution. Rest of them are for Student.
      if (props.entityType === RestrictionEntityType.Student) {
        for (const category of categories) {
          options.push({
            label: category.description,
            value: category.description,
          });
        }
      } else {
        options.push({
          label: "Designation",
          value: "Designation",
        });
      }

      dropdown.component.data.values = options;
      dropdown.redraw();
    };

    const formChanged = async (form: any, event: any) => {
      if (event.changed?.component.key === CATEGORY_KEY) {
        const selectedRestrictionCategory: string =
          formioUtils.getComponentValueByKey(form, CATEGORY_KEY);
        formioDataLoader.loadRestrictionReasons(
          form,
          "restrictionId",
          selectedRestrictionCategory,
        );
      }
    };
    const submitForm = async () => {
      return formData.value.submit();
    };
    const submitRestriction = async (data: AssignRestrictionAPIInDTO) => {
      context.emit("submitRestrictionData", data);
    };
    const addRestriction = async () => {
      const formSubmitted = await submitForm();
      if (formSubmitted) {
        showDialog.value = false;
      }
    };

    return {
      showDialog,
      showModal,
      dialogClosed,
      formLoaded,
      submitRestriction,
      submitForm,
      addRestriction,
      formChanged,
      Role,
    };
  },
};
</script>
