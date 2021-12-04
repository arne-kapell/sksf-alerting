<template>
    <v-app>
            <v-main fluid>
                <v-container>
                    <v-card shaped :loading="loading">
                        <v-form v-model="form.valid" @submit="login">
                            <v-container>
								<h1 class="text-h2" style="text-align: center;">Login</h1>
                                <v-text-field type="text" v-model="form.email" label="E-Mail" :rules="form.emailRules" required />
                                <v-text-field type="password" v-model="form.password" label="Password" :rules="form.pwRules" required />
								<v-row class="d-flex flex-row justify-center my-2">
									<v-btn type="submit" :disabled="!form.valid" color="green">login</v-btn>
									<v-alert v-if="error" type="error">{{ error }}</v-alert>
								</v-row>
                            </v-container>
                        </v-form>
                    </v-card>
                </v-container>
            </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	layout: "main",
	head() {
		return {
			title: "Login",
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
				]
			}
		};
	},
	methods: {
		async login(e: Event) {
			e.preventDefault();
			this.loading = true;
			try {
				await this.$auth.loginWith("local", {
					data: {
						mail: this.form.email,
						password: this.form.password
					}
				});
				this.$router.push("/");
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