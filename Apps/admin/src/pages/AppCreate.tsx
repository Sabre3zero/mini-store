import { useStore } from "../stores/useStore";
import { observer } from "mobx-react-lite";
import { createApp } from "@ministore/api";
import { AppForm } from "../components/AppForm";

export const AppCreate = observer(function () {
  const { userStore } = useStore();
  
  const handleCreateApp = (body: any) => {
    const token = userStore.token;
    console.log('Token from store:', token);
    
    if (!token) {
      throw new Error('No token found! Please login again.');
    }
    
    return createApp({ token, body });
  };
  
  return <AppForm onSubmit={handleCreateApp} />;
});