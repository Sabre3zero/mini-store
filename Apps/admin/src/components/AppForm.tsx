import { ChangeEvent, SubmitEventHandler, useEffect, useState } from "react"
import { CreateAppArgs } from "@ministore/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/useStore";
import { AppFields, CategoryParams } from "@ministore/api";

type AppFormProps = {
    onSubmit: (value: CreateAppArgs) => Promise<void>
};

export const AppForm = observer(({onSubmit}: AppFormProps) => {

    const {userStore} = useStore()
    const [error, setError] = useState("");
    const [form, setForm] = useState<AppFields>({categoryId: '', description: '', price: 0, slug: '', title: ''});

    useEffect(() => {
    if (!userStore.categories || userStore.categories.length === 0) {
        userStore.loadCat();
        }
    }, [userStore.categories]);
    
    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
        <div>Описание: <textarea name="description" onChange={handleChange} /></div>
        <div>Категория:{" "}
            <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
            >
                {userStore.categories.map(({ id, title }: CategoryParams) => 
                    <option value={id} key={id}>
                        {title}
                    </option>
                )}
            </select>
        </div>
        <div>Цена: <input type="text" name="price" onChange={handleChange} /></div>
        <button type="submit">Отправить</button>
        {error}
    </form>
})