"use client"
import React from "react";
import { Form, Input, Select, SelectItem, Checkbox, Button, Alert } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {EyeSlashFilledIcon,EyeFilledIcon} from "../../../components/login/allComp"
  
  

export default function App() {
    const [password, setPassword] = React.useState("");
    const [submitted, setSubmitted] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const router = useRouter();
    const [isVisible, setIsVisible] = React.useState(false);
    const [alertStatus, setAlertStatus] = React.useState('');
    const [alertMessage, setAlertMessage] = React.useState('');

  const toggleVisibility = () => setIsVisible(!isVisible);

    // Real-time password validation
    const getPasswordError = (value) => {
        if (value.length < 4) {
            return "Password must be 4 characters or more";
        }
        // if ((value.match(/[A-Z]/g) || []).length < 1) {
        //     return "Password needs at least 1 uppercase letter";
        // }
        // if ((value.match(/[^a-z]/gi) || []).length < 1) {
        //     return "Password needs at least 1 symbol";
        // }

        return null;
    };

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget));
            const newErrors = {};
            const passwordError = getPasswordError(data.password);
            if (passwordError) {
                newErrors.password = passwordError;
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            const res = await axios.post("https://hospital-management-backend-one.vercel.app/hospitalManagement/login", data)
            if (!res.data.success) {
                setAlertStatus('n')
                setAlertMessage(res.data.message)
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                setAlertStatus('')
                setAlertMessage('')
                return;
            }

            setAlertStatus('p')
            setAlertMessage(res.data.message)
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            setAlertStatus('')
            setAlertMessage('')
            router.push(`/patient`);


            setErrors({});
            // setSubmitted(data);

        } catch (error) {

        }
    };

    return (
      <>
        <Form
            className=" h-[80vh] flex justify-center items-center space-y-4"
            validationBehavior="native"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
        >
            <h1 className='text-3xl'>Login</h1>
            <div className="w-[50vw] h-[50vh] flex flex-col gap-8 max-w-md">
                <Input
                    isRequired
                    errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                            return "Please enter your name";
                        }

                        return errors.name;
                    }}
                    label="Name"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Enter your name"
                />

                <Input
                    name='password'
                    isRequired
                    errorMessage={getPasswordError(password)}
                    isInvalid={getPasswordError(password) !== null}
                    endContent={
                        <button
                            aria-label="toggle password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                        >
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    label="Password"
                    value={password}
                    placeholder="Enter your password"
                    onValueChange={setPassword}
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                />


                {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}

                <div className="flex gap-4">
                    <Button className="w-full" color="primary" type="submit">
                        Submit
                    </Button>
                </div>
                {alertStatus === 'p' && <Alert color={'success'} title={alertMessage} />}
                {alertStatus === 'n' && <Alert color={'danger'} title={alertMessage} />}
            </div>

            {submitted && (
                <div className="text-small text-default-500 mt-4">
                    Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                </div>
            )}
        
        </Form>
        </> 
    ); 
}

