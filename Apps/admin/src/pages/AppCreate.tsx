import { useStore } from "../stores/useStore";
import { observer } from "mobx-react-lite";
import { createApp, CreateAppArgs } from "@ministore/api";
import { AppForm } from "../components/AppForm";

export const AppCreate = observer(function () {
  const { userStore } = useStore();
  
  const handleCreateApp = (args: CreateAppArgs) => {
    const token = userStore.token;
    
    if (!token) {
      throw new Error('Токен не был найден. Попробуйте ещё раз.');
    }
    
    return createApp(args);
  };
  
  return <AppForm onSubmit={handleCreateApp} />;
});