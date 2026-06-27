import { api } from "./api"

export const logoutService = {
    async execute(): Promise<void> {
        await api.post('/auth/logout' , {});
    }
}