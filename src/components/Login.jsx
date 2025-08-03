import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './Error'
import * as Yup from 'yup'
import UseFetch from '@/hooks/UseFetch'
import { login } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/Context'

const Login = () => {

    const navigate = useNavigate()
    let [searchParams] = useSearchParams()
    const longLink = searchParams.get("createNew")

    const [errors, setErrors] = useState([])
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const {data, error, loading, fn: fnLogin} = UseFetch(login, formData);
    const {fetchUser} = UrlState()

    const handleLogin = async() => {
        setErrors([])
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email("Invalid Email")
                    .required("Email is required"),
                password: Yup.string()
                    .min(6,"Password must be atleast 6 characters")
                    .required("Password is required"),
            });
            await schema.validate(formData, {abortEarly: false});
            //api call
            await fnLogin()
        } catch (error) {
            const newErrors = {};
            error?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState)=>({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(()=>{
        if(error === null && data){
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
            fetchUser();
        }
    },[data,error])

  return (
    <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>If you already have an account</CardDescription>
            {error && <Error message={error.message}/>}
        </CardHeader>
        <CardContent className="space-y-4">
            <div className='space-y-2'>
                <label className="text-md font-medium">Email</label>
                <Input 
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                />
                {errors.email && <Error message={errors.email}/>}
            </div>
            <div className='space-y-2'>
                <label className="text-md font-medium">Password</label>
                <Input 
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                />
                {errors.password && <Error message={errors.password}/>}
            </div>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button onClick={handleLogin}>
                {loading ? <BeatLoader size={10} />:"Login"}
            </Button>
        </CardFooter>
    </Card>
  )
}

export default Login