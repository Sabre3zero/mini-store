import { ChangeEvent, SubmitEventHandler, useState } from "react"
import { CreateAppArgs } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { AppFields } from "../../../../Packages/api/src";

type AppFormProps = {
    onSubmit: (value: CreateAppArgs) => Promise<void>
};

export const AppForm = observer(({onSubmit}: AppFormProps) => {

    const {userStore} = useStore()
    const [error, setError] = useState("");
    const [form, setForm] = useState<AppFields>({categoryId: '', description: '', price: 0, slug: '', title: ''});
    
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setForm({
          ...form,
          [event.target.name]: event.target.value,
        });
      }

    const handleSubmit: SubmitEventHandler = async (event) => {
        event.preventDefault();
        setError("");

        if (!userStore.token) {
            return
        }

        await onSubmit({token: userStore.token, body: form});
}

    return <form onSubmit={handleSubmit}>
        <div>Название: <input type="text" name="title" onChange={handleChange} /></div>
        <div>Slug: <input type="text" name="slug" onChange={handleChange} /></div>
        <div>Описание: <input type="text" name="description" onChange={handleChange} /></div>
        <div>Категория:{" "}
            <select name="category" >
                <option>111</option>
                <option>222</option>
            </select>
        </div>
        <div>Цена: <input type="text" name="price" onChange={handleChange} /></div>
        <button type="submit">Отправить</button>
        {error}
    </form>
})