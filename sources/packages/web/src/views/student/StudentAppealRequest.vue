<template>
  <student-page-container>
    <template #header>
      <header-navigator title="Student" subTitle="Request a Change" />
    </template>

    <div v-if="showRequestForAppeal">
      <!-- content area -->
      <div>
        <formio
          formName="studentrequestchange"
          @loaded="formLoaded"
          @submitted="submitRequest"
        ></formio>
      </div>
      <!-- action area -->
      <div class="mt-4">
        <v-btn @click="submitStudentRequest" color="primary" class="float-right"
          >Next</v-btn
        >
      </div>
    </div>
    <div v-else>
      <body-header
        title="Fill in the field(s) below"
        subTitle="StudentAid BC will review your application change after you submit the fields below."
      ></body-header>
      <appeal-requests-form
        :studentAppealRequests="appealRequestsForms"
        @submitted="submitAppeal"
      >
        <template #actions="{ submit }">
          <v-row justify="center" class="m-2">
            <v-btn
              color="primary"
              variant="outlined"
              class="mr-2"
              @click="backToRequestForm"
              >Cancel</v-btn
            >
            <v-btn color="primary" class="ml-2" @click="submit"
              >Submit</v-btn
            ></v-row
          >
        </template>
      </appeal-requests-form>
    </div>
  </student-page-container>
</template>
<script lang="ts">
import { computed, ref } from "vue";
import { ApiProcessError, StudentAppealRequest } from "@/types";
import { ApplicationService } from "@/services/ApplicationService";
import { StudentAppealService } from "@/services/StudentAppealService";
import AppealRequestsForm from "@/components/common/AppealRequestsForm.vue";
import { useSnackBar } from "@/composables";
import {
  APPLICATION_CHANGE_NOT_ELIGIBLE,
  INVALID_APPLICATION_NUMBER,
} from "@/constants";

// Model for student request change form.
interface StudentRequestSelectedForms {
  applicationNumber: string;
  formNames: string[];
}

export default {
  components: {
    AppealRequestsForm,
  },
  setup() {
    const snackBar = useSnackBar();
    let requestFormData: any = undefined;
    const appealRequestsForms = ref([] as StudentAppealRequest[]);
    let applicationId: number;
    const showRequestForAppeal = computed(
      () => appealRequestsForms.value.length === 0,
    );

    const submitRequest = async (data: StudentRequestSelectedForms) => {
      try {
        const application =
          await ApplicationService.shared.getApplicationForRequestChange(
            data.applicationNumber,
          );
        applicationId = application.id;
        appealRequestsForms.value = data.formNames.map(
          (formName) => ({ formName } as StudentAppealRequest),
        );
      } catch (error) {
        const errorMessage = "An error happened while requesting a change.";
        const errorLabel = "Unexpected error";
        if (error.response.data?.errorType === INVALID_APPLICATION_NUMBER) {
          snackBar.warn(
            `Application not found. ${error.response.data.message}`,
          );
        } else {
          snackBar.error(`${errorLabel}. ${errorMessage}`);
        }
      }
    };

    const submitStudentRequest = () => {
      return requestFormData.submit();
    };

    const formLoaded = (form: any) => {
      requestFormData = form;
    };

    const backToRequestForm = () => {
      appealRequestsForms.value = [];
    };

    const submitAppeal = async (appealRequests: StudentAppealRequest[]) => {
      try {
        await StudentAppealService.shared.submitStudentAppeal(
          applicationId,
          appealRequests,
        );
        snackBar.success(
          "The request for change has been submitted successfully.",
        );
        //TODO: Redirect to appeal view page once it is developed.
        backToRequestForm();
      } catch (error: unknown) {
        if (error instanceof ApiProcessError) {
          if (
            [
              INVALID_APPLICATION_NUMBER,
              APPLICATION_CHANGE_NOT_ELIGIBLE,
            ].includes(error.errorType)
          ) {
            snackBar.warn(`Not able to submit. ${error.message}`);
            return;
          }
        }
        snackBar.error("An unexpected error happened during the submission.");
      }
    };

    return {
      submitRequest,
      formLoaded,
      submitStudentRequest,
      appealRequestsForms,
      showRequestForAppeal,
      backToRequestForm,
      submitAppeal,
    };
  },
};
</script>
