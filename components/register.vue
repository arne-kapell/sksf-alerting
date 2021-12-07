<template>
                <v-container>
                    <v-card :loading="loading" elevation="10">
                        <v-form v-model="form.valid" @submit="register">
                            <v-container>
								<h4 class="text-h4">Register new user</h4>
                                <v-text-field type="text" v-model="form.email" label="E-Mail" :rules="form.emailRules" required />
                                <v-text-field type="text" v-model="form.name" label="Name" :rules="form.nameRules" />
                                <v-checkbox type="checkbox" v-model="form.privileged" label="Privileged" required />
                                <v-text-field type="password" v-model="form.password" label="Password" :rules="form.pwRules" required />
								<v-row class="d-flex flex-row justify-center my-2">
									<v-btn type="submit" :disabled="!form.valid" color="green">register</v-btn>
									<v-alert v-if="error" type="error">{{ error }}</v-alert>
								</v-row>
                            </v-container>
                        </v-form>
                    </v-card>
                </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	layout: "main",
	head() {
		return {
			title: "Register",
		};
	},
	data() {
		return {
			loading: false,
			error: false as boolean | string,
			form: {
				valid: false,
				email: "",
				emailRules: [
					(v: string) => !!v || "E-mail is required",
					(v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
				],
				password: "",
				pwRules: [
					(v: string) => !!v || "Password is required",
					(v: string) => v.length >= 6 || "Password must be at least 6 characters",
				],
				name: "",
				nameRules: [
					(v: string) => !!v || "Name is required",
					// eslint-disable-next-line no-useless-escape
					(v: string) => /.+\ .+/.test(v) || "Name must be valid",
				],
				privileged: false
			}
		};
	},
	methods: {
		async register(e: Event) {
			e.preventDefault();
			this.loading = true;
			try {
				const req = {
					mail: this.form.email,
					password: this.form.password,
					name: this.form.name,
					privileged: this.form.privileged
				};
				const res = await this.$axios.$post("/register", req);
				if (res.success) {
					this.form.email = "";
					this.form.name = "";
					this.form.privileged = false;
					this.form.password = "";
					this.form.valid = false;
				} else {
					console.log("Failed to register user");
				}
			} catch (e) {
				const message = (e as ErrorEvent).message.split(" ");
				this.error = message[message.length - 1];
			} finally {
				this.loading = false;
			}
		}
	}
});
</script>