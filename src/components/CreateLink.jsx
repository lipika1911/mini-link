import { UrlState } from '@/Context'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import Error from './Error';
import { Card } from './ui/card';
import { Input } from './ui/input';
import * as Yup from 'yup'
import { QRCode } from 'react-qrcode-logo';
import UseFetch from '@/hooks/UseFetch';
import { createUrl } from '@/db/apiUrls';
import { BeatLoader } from 'react-spinners';

const CreateLink = () => {
    const {user} = UrlState();
    const navigate = useNavigate();
    const ref = useRef()
    const [searchParams, setSearchParams] = useSearchParams();

    const longLink = searchParams.get("createNew")

    const [errors, setErrors] = useState({})
    const [formValues, setFormValues] = useState({
        title: "",
        longUrl: longLink ? longLink : "",
        customUrl: "",
    });

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        longUrl: Yup
            .string()
            .url("Must be a valid URL")
            .required("Long URL is required"),
        customUrl: Yup.string(),
    });

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    const {loading, error, data, fn: fnCreateUrl} = UseFetch(createUrl, {...formValues, user_id: user.id});

    const createNewLink = async() => {
        setErrors([])
        try {
            await schema.validate(formValues, {abortEarly: false});
            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve)=> canvas.toBlob(resolve));

            await fnCreateUrl(blob);
        } catch (error) {
            const newErrors = {}
            error?.inner?.forEach((err)=>{
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    };

    useEffect(()=>{
        if(error === null && data){
            navigate(`/link/${data[0].id}`);
        }
    },[error,data])

  return (
    <Dialog
        defaultOpen = {longLink}
        onOpenChange = {(res)=>{
            if(!res) setSearchParams({})
        }}
    >
        <DialogTrigger>
            <Button variant="destructive">Create New Link</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
            </DialogHeader>
            {formValues?.longUrl && (
                <QRCode value={formValues.longUrl} size={250} ref={ref}/>
            )}
            <Input 
                id="title" 
                placeholder="Short Link's Title" 
                value={formValues.title}
                onChange={handleChange}
            />
            {errors.title && <Error message={errors.title} />}

            <Input 
                id="longUrl" 
                placeholder="Enter your Loooong URL"
                value={formValues.longUrl}
                onChange={handleChange}
            />
            {errors.longUrl && <Error message={errors.longUrl} />}

            <div className='flex items-center gap-2'>
                <Card className="p-2 w-full">miny-link.vercel.app</Card> /
                <Input 
                    id="customUrl" 
                    placeholder="Custom Link (Optional)" 
                    value={formValues.customUrl}
                    onChange={handleChange}
                />
            </div>

            {error && <Error message={error.message} />}

            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Close
                    </Button>
                </DialogClose>
                <Button disabled={loading} onClick={createNewLink} variant="destructive">
                    {loading ? <BeatLoader size={10} color='white' /> : "Create Link"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CreateLink

