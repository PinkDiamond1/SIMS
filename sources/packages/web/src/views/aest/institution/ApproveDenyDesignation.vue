<template>
  <!-- CSS class temporary-modal is work around for lack of responsiveness of v-dialog. -->
  <modal-dialog-base
    :showDialog="showDialog"
    @dialogClosed="dialogClosed"
    :title="title"
  >
    <template v-slot:content>
      <div class="temporary-modal">
        <formio
          formName="approvedenydesignation"
          :data="designation"
          @loaded="formLoaded"
          @submitted="submitDesignationUpdate"
        ></formio>
      </div>
    </template>
    <template v-slot:footer>
      <check-permission-role :role="Role.InstitutionApproveDeclineDesignation">
        <template #="{ notAllowed }">
          <footer-buttons
            primaryLabel="Submit Action"
            @primaryClick="submitDesignation"
            @secondaryClick="dialogClosed"
            :disablePrimaryButton="notAllowed"
          />
        </template>
      </check-permission-role>
    </template>
  </modal-dialog-base>
</template>

<script lang="ts">
import ModalDialogBase from "@/components/generic/ModalDialogBase.vue";
import {
  UpdateDesignationDto,
  DesignationAgreementStatus,
} from "@/types/contracts/DesignationAgreementContract";
import { useModalDialog } from "@/composables";
import { computed } from "vue";
import CheckPermissionRole from "@/components/generic/CheckPermissionRole.vue";
import { Role } from "@/types";

export default {
  components: { ModalDialogBase, CheckPermissionRole },
  props: {
    designation: {
      type: Object,
      required: true,
    },
  },
  setup(props: any) {
    const { showDialog, showModal, resolvePromise } = useModalDialog<
      UpdateDesignationDto | boolean
    >();
    let formData: any = undefined;

    const title = computed(() =>
      props.designation.designationStatus ===
      DesignationAgreementStatus.Approved
        ? "Approve Designation"
        : "Decline Designation",
    );

    const dialogClosed = () => {
      resolvePromise(false);
    };

    const formLoaded = (form: any) => {
      formData = form;
    };

    const submitDesignationUpdate = async (data: UpdateDesignationDto) => {
      resolvePromise(data);
    };
    const submitDesignation = async () => {
      return formData.submit();
    };

    return {
      showDialog,
      showModal,
      dialogClosed,
      formLoaded,
      submitDesignationUpdate,
      submitDesignation,
      title,
      Role,
    };
  },
};
</script>
