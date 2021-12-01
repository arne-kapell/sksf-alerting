<template>
    <v-app>
            <v-main>
                <v-container>
                    <v-card shaped light :loading="loading">
                        <v-form v-model="form.valid" @submit="login">
                            <v-container>
                                <v-text-field type="text" v-model="form.email" label="E-Mail" :rules="form.emailRules" required />
                                <v-text-field type="password" v-model="form.password" label="Password" :rules="form.pwRules" required />
								<v-row>
									<v-btn type="submit">login</v-btn>
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
	data() {
		return {
			loading: false,
			error: false as boolean | string,
			form: {
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