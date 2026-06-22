import { UserStore } from "./UserStore";


export class RootStore {
    userStore = new UserStore();
}

export const rootStore = new RootStore();