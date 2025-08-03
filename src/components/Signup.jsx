import React, { useEffect, useState } from 'react'
import {
  Card,
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
import { signup } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/Context'

const Signup = () => {

    const navigate = useNavigate()
    let [searchParams] = useSearchParams()
    const longLink = searchParams.get("createNew")

    const [errors, setErrors] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: null,
    })

    const {data, error, loading, fn: fnSignup} = UseFetch(signup, formData);
    const {fetchUser} = UrlState()

    const handleSignup = async() => {
        setErrors([])
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
                  .required("Name is required"),
                email: Yup.string()
                    .email("Invalid Email")
                    .required("Email is required"),
                password: Yup.string()
                    .min(6,"Password must be atleast 6 characters")
                    .required("Password is required"),
                profile_pic: Yup.mixed()
                    .required("Profile pic is required"),
            });
            await schema.validate(formData, {abortEarly: false});
            //api call
            await fnSignup();
        } catch (error) {
            const newErrors = {};
            error?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    }

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        setFormData((prevState)=>({
            ...prevState,
            [name]: files ? files[0] : value,
        }));
    };

    useEffect(()=>{
        if(error === null && data){
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
            fetchUser();
        }
    },[error, loading])

  return (
    <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Signup</CardTitle>
            <CardDescription className="text-md">Create an account if you haven&rsquo;t already</CardDescription>
            {error && <Error message={error.message}/>}
        </CardHeader>
        <CardContent className="space-y-4">
            <div className='space-y-2'>
                <label className="text-md font-medium">Name</label>
                <Input 
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleInputChange}
                />
                {errors.name && <Error message={errors.name}/>}
            </div>
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
            <div className='space-y-2'>
                <label className="text-md font-medium">Upload Profile Pic</label>
                <Input 
                    name="profile_pic"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                />
                {errors.profile_pic && <Error message={errors.profile_pic}/>}
            </div>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button onClick={handleSignup}>
                {loading ? <BeatLoader size={10} />:"Create Account"}
            </Button>
        </CardFooter>
    </Card>
  )
}

export default Signup