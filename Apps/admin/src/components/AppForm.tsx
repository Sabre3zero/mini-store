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
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
        setSuccess("");
        setIsLoading(true);

        if (!userStore.token) {
            setError("Токен не найден. Пожалуйста, войдите заново.");
            setIsLoading(false);
            return;
        }

        try {
            await onSubmit({token: userStore.token, body: form});
            setSuccess("Приложение успешно создано!");
            setForm({categoryId: '', description: '', price: 0, slug: '', title: ''});
        } catch (err: any) {
            if (err.message) {
                setError(`${err.message}`);
            } else {
                setError("Произошла неизвестная ошибка. Попробуйте ещё раз.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>Название: <input type="text" name="title" onChange={handleChange} value={form.title} /></div>
            <div>Slug: <input type="text" name="slug" onChange={handleChange} value={form.slug} /></div>
            <div>Описание: <textarea name="description" onChange={handleChange} value={form.description} /></div>
            <div>Категория:{" "}
                <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                >
                    <option value="">Выберите категорию</option>
                    {userStore.categories.map(({ id, title }: CategoryParams) => 
                        <option value={id} key={id}>
                            {title}
                        </option>
                    )}
                </select>
            </div>
            <div>Цена: <input type="text" name="price" onChange={handleChange} value={form.price} /></div>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Создание..." : "Отправить"}
            </button>
            
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
        </form>
    )
})