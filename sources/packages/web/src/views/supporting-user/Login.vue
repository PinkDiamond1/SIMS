<template>
  <v-card elevation="2" class="mx-auto mt-15" max-width="690px" outlined>
    <v-card-header>
      <v-card-header-text>
        <v-card-title class="my-6 bold-text" style="font-size: 27px"
          >Welcome to Student Application Supporting Information
          Portal</v-card-title
        >
        <v-card-subtitle>Welcome text goes here…</v-card-subtitle>
      </v-card-header-text>
    </v-card-header>
    <v-card-text
      >We are using BCSC for authentication. Please click on Login/Register
      buttons below to start your sign in/sign up.</v-card-text
    >
    <v-row class="m-3">
      <v-col>
        <v-btn
          justify-center
          color="primary"
          @click="login"
          class="float-right"
          prepend-icon="fa:fa fa-user"
        >
          Login with BCSC
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="primary"
          @click="login"
          prepend-icon="mdi-account-star-outline"
        >
          Sign Up with BCSC
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { AppIDPType, ClientIdType } from "@/types";

export default {
  setup() {
    const { executeLogin } = useAuth();
    const login = async () => {
      await executeLogin(ClientIdType.SupportingUsers, AppIDPType.BCSC);
    };
    return { login };
  },
};
</script>
