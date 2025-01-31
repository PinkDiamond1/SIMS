<template>
  <full-page-container>
    <body-header title="Search Institution"> </body-header>
    <content-group>
      <v-row>
        <v-col>
          <v-text-field
            density="compact"
            label="Legal name"
            variant="outlined"
            v-model="legalName"
            data-cy="legalName"
            @keyup.enter="searchInstitutions"
            :rules="[(v) => !!v || 'Legal name required']"
          />
        </v-col>
        <v-col>
          <v-text-field
            density="compact"
            label="Operating name"
            variant="outlined"
            v-model="operatingName"
            data-cy="operatingName"
            @keyup.enter="searchInstitutions"
            :rules="[(v) => !!v || 'Operating name required']"
          />
        </v-col>
        <v-col
          ><v-btn
            :disabled="!legalName && !operatingName"
            color="primary"
            data-cy="searchInstitutions"
            @click="searchInstitutions"
            >Search</v-btn
          ></v-col
        >
      </v-row>
    </content-group>

    <content-group v-if="institutionsFound" class="mt-8">
      <DataTable
        v-if="institutionsFound"
        class="mt-4"
        :autoLayout="true"
        :value="institutions"
      >
        <Column field="legalName" header="Legal Name" :sortable="true">
          <template #body="slotProps">
            <div class="p-text-capitalize">
              {{ slotProps.data.legalName }}
            </div>
          </template>
        </Column>
        <Column field="operatingName" header="Operating Name" :sortable="true">
          <template #body="slotProps">
            <div class="p-text-capitalize">
              {{ slotProps.data.operatingName }}
            </div>
          </template>
        </Column>
        <Column field="address" header="Address">
          <template #body="slotProps">
            <div class="p-text-capitalize">
              {{ getFormattedAddress(slotProps.data.address) }}
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <v-btn
              color="primary"
              data-cy="viewInstitution"
              @click="goToViewInstitution(slotProps.data.id)"
              >View</v-btn
            >
          </template>
        </Column>
      </DataTable>
    </content-group>
  </full-page-container>
</template>
<script lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { InstitutionService } from "@/services/InstitutionService";
import { SearchInstitutionAPIOutDTO } from "@/services/http/dto";
import { AESTRoutesConst } from "@/constants/routes/RouteConstants";
import { useSnackBar, useFormatters } from "@/composables";

export default {
  setup() {
    const snackBar = useSnackBar();
    const router = useRouter();
    const legalName = ref("");
    const operatingName = ref("");
    const institutions = ref([] as SearchInstitutionAPIOutDTO[]);
    const goToViewInstitution = (institutionId: number) => {
      router.push({
        name: AESTRoutesConst.INSTITUTION_PROFILE,
        params: { institutionId: institutionId },
      });
    };
    const { getFormattedAddress } = useFormatters();
    const searchInstitutions = async () => {
      institutions.value = await InstitutionService.shared.searchInstitutions(
        legalName.value,
        operatingName.value,
      );
      if (institutions.value.length === 0) {
        snackBar.warn("No Institutions found for the given search criteria.");
      }
    };
    const institutionsFound = computed(() => {
      return institutions.value.length > 0;
    });
    return {
      legalName,
      operatingName,
      institutionsFound,
      searchInstitutions,
      institutions,
      goToViewInstitution,
      getFormattedAddress,
    };
  },
};
</script>
