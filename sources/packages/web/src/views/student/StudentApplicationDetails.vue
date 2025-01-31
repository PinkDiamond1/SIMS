<template>
  <student-page-container :full-width="true" layout-template="centered">
    <template #header>
      <header-navigator
        title="Back to Applications"
        :routeLocation="{
          name: StudentRoutesConst.STUDENT_APPLICATION_SUMMARY,
        }"
        subTitle="Financial aid application"
        ><template #buttons>
          <v-menu>
            <template v-slot:activator="{ props }"
              ><v-btn
                color="primary"
                @click="toggle"
                v-bind="props"
                prepend-icon="fa:fa fa-chevron-circle-down"
                >Application Options
              </v-btn>
            </template>
            <v-list>
              <template v-for="(item, index) in items" :key="index">
                <v-list-item :value="index">
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template>
                  <v-list-item-title
                    @click="item.command"
                    :class="item.textColor"
                  >
                    <span class="label-bold"> {{ item.label }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
                  inset
                ></v-divider>
              </template>
            </v-list>
          </v-menu>
        </template>
      </header-navigator>
    </template>

    <CancelApplication
      :showModal="showModal"
      :applicationId="id"
      @showHideCancelApplication="showHideCancelApplication"
      @reloadData="getApplicationDetails"
    />
    <v-container class="pt-12">
      <div
        class="bg-white application-info-border"
        v-if="
          applicationDetails.applicationStatus === ApplicationStatus.cancelled
        "
      >
        <p>
          <v-icon color="primary">mdi-information </v-icon
          ><span class="pl-2 font-weight-bold">For your information</span>
        </p>
        <span class="mt-4"
          >This application was cancelled on
          {{
            dateOnlyLongString(applicationDetails.applicationStatusUpdatedOn)
          }}.
          <a class="text-primary" @click="viewApplication">
            View application
          </a>
        </span>
      </div>
      <ApplicationDetails
        v-if="applicationDetails?.applicationStatus"
        :applicationDetails="applicationDetails"
      />
    </v-container>
  </student-page-container>
  <ConfirmEditApplication ref="editApplicationModal" />
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, watch, computed } from "vue";
import { StudentRoutesConst } from "@/constants/routes/RouteConstants";
import CancelApplication from "@/components/students/modals/CancelApplicationModal.vue";
import { ApplicationService } from "@/services/ApplicationService";
import "@/assets/css/student.scss";
import { useFormatters, ModalDialog, useSnackBar } from "@/composables";
import { GetApplicationDataDto, ApplicationStatus, MenuType } from "@/types";
import ApplicationDetails from "@/components/students/ApplicationDetails.vue";
import ConfirmEditApplication from "@/components/students/modals/ConfirmEditApplication.vue";

export default {
  components: {
    CancelApplication,
    ApplicationDetails,
    ConfirmEditApplication,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props: any) {
    const router = useRouter();
    const items = ref([] as MenuType[]);
    const { dateOnlyLongString } = useFormatters();
    const showModal = ref(false);
    const applicationDetails = ref({} as GetApplicationDataDto);
    const editApplicationModal = ref({} as ModalDialog<boolean>);
    const snackBar = useSnackBar();

    const showHideCancelApplication = () => {
      showModal.value = !showModal.value;
    };
    const showViewAssessment = computed(() =>
      [
        ApplicationStatus.assessment,
        ApplicationStatus.enrollment,
        ApplicationStatus.completed,
      ].includes(applicationDetails.value?.applicationStatus),
    );

    const getApplicationWithPY = async (
      isIncludeInActiveProgramYear?: boolean,
    ) => {
      return ApplicationService.shared.getApplicationWithPY(
        props.id,
        isIncludeInActiveProgramYear,
      );
    };

    const editApplication = async () => {
      try {
        const applicationWithPY = await getApplicationWithPY();
        router.push({
          name: StudentRoutesConst.DYNAMIC_FINANCIAL_APP_FORM,
          params: {
            selectedForm: applicationWithPY.formName,
            programYearId: applicationWithPY.programYearId,
            id: props.id,
          },
        });
      } catch (error) {
        snackBar.error(
          "Unexpected Error",
          snackBar.EXTENDED_MESSAGE_DISPLAY_TIME,
        );
      }
    };

    const viewApplication = async () => {
      const applicationWithPY = await getApplicationWithPY(true);
      router.push({
        name: StudentRoutesConst.DYNAMIC_FINANCIAL_APP_FORM_VIEW,
        params: {
          selectedForm: applicationWithPY.formName,
          programYearId: applicationWithPY.programYearId,
          id: props.id,
          readOnly: "readOnly",
        },
      });
    };

    const confirmEditApplication = async () => {
      if (await editApplicationModal.value.showModal()) {
        editApplication();
      }
    };
    const loadMenu = () => {
      if (
        applicationDetails.value.applicationStatus !==
          ApplicationStatus.cancelled &&
        applicationDetails.value.applicationStatus !==
          ApplicationStatus.completed
      ) {
        items.value.push({
          label: "Edit",
          icon: "fa:fa fa-pencil",
          command:
            applicationDetails.value.applicationStatus ===
            ApplicationStatus.draft
              ? editApplication
              : confirmEditApplication,
        });
      }
      items.value.push({
        label: "View",
        icon: "fa:fa fa-folder-open",
        command: viewApplication,
      });
      if (
        applicationDetails.value.applicationStatus !==
          ApplicationStatus.cancelled &&
        applicationDetails.value.applicationStatus !==
          ApplicationStatus.completed
      ) {
        items.value.push({
          label: "Cancel",
          icon: "fa:fa fa-trash",
          textColor: "error-color",
          command: () => {
            showHideCancelApplication();
          },
        });
      }
    };

    const getApplicationDetails = async (applicationId: number) => {
      applicationDetails.value =
        await ApplicationService.shared.getApplicationData(applicationId);
      loadMenu();
    };

    watch(
      () => props.id,
      async (currValue: number) => {
        //update the list
        await getApplicationDetails(currValue);
      },
    );

    onMounted(async () => {
      await getApplicationDetails(props.id);
    });

    return {
      items,
      StudentRoutesConst,
      showHideCancelApplication,
      showModal,
      applicationDetails,
      getApplicationDetails,
      dateOnlyLongString,
      ApplicationStatus,
      showViewAssessment,
      editApplicationModal,
      editApplication,
      viewApplication,
    };
  },
};
</script>
