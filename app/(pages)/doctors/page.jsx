"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@nextui-org/spinner";
import {MailIcon,LockIcon,SearchIcon,EyeIcon,DeleteIcon,EditIcon} from "../../../components/patient/allComp"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
} from "@nextui-org/react";
import { Alert } from "@nextui-org/react";
import { Button, Input } from "@nextui-org/react";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Checkbox,
    Link,
    Select,
    SelectItem
} from "@nextui-org/react";


const sample = {
    _id: 1,
    name: "Dr. Sarah Miller",
    email: "sarah.miller@example.com",
    specialization: "Cardiologist", // neuro // peads //
    experience: 15,
    contactNumber: "03334567890"
};


export const columns = [
    { name: "NAME", uid: "name" },
    { name: "EMAIL", uid: "email" },
    { name: "SPECIALIZATION", uid: "specialization" },
    { name: "EXPERIENCE", uid: "experience" },
    { name: "CONTACT", uid: "contactNumber" },
    { name: "GENDER", uid: "gender" },
    { name: "ACTIONS", uid: "actions" },
];

export const users = [
    {
        _id: 1,
        name: "Tony Reichert",
        age: 24,
        disease: "Management",
        gender: "male",
        patientType: "ICU",
        contactNumber: "03311237808",
        email: "tony.reichert@example.com",
    },
    {
        _id: 2,
        name: "Sophia Turner",
        age: 30,
        disease: "Flu",
        gender: "female",
        patientType: "General Ward",
        contactNumber: "03219874562",
        email: "sophia.turner@example.com"
    },
    {
        _id: 3,
        name: "Ethan Hunt",
        age: 45,
        disease: "Heart Attack",
        gender: "male",
        patientType: "Emergency",
        contactNumber: "03009876543",
        email: "ethan.hunt@example.com"
    },
    {
        _id: 4,
        name: "Amelia Clark",
        age: 28,
        disease: "Diabetes",
        gender: "female",
        patientType: "Regular Checkup",
        contactNumber: "03125678901",
        email: "amelia.clark@example.com"
    },
    {
        _id: 5,
        name: "John Doe",
        age: 60,
        disease: "Pneumonia",
        gender: "male",
        patientType: "ICU",
        contactNumber: "03451237890",
        email: "john.doe@example.com"
    },
];




const statusColorMap = {
    male: "success",
    female: "danger",
};

export default function App() {
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            // case "name":
            //     return (
            //         <User
            //             avatarProps={{ radius: "lg", src: user.avatar }}
            //             description={user.email}
            //             name={cellValue}
            //         >
            //             {user.email}
            //         </User>
            //     );
            // case "age":
            //     return (
            //         <div className="flex flex-col">
            //             <p className="text-bold text-sm capitalize text-default-400">{user.age}</p>
            //         </div>
            //     );
            // case "disease":
            //     return (
            //         <Chip className="capitalize" color={statusColorMap[user.disease]} size="sm" variant="flat">
            //             {cellValue}
            //         </Chip>
            //     );
            // case "gender":
            //     return (
            //         <Chip className="capitalize" color={statusColorMap[user.gender]} size="sm" variant="flat">
            //             {cellValue}
            //         </Chip>
            //     );
            // case "patientType":
            //     return (
            //         <Chip className="capitalize" color={statusColorMap[user.patientType]} size="sm" variant="flat">
            //             {cellValue}
            //         </Chip>
            //     );
            // case "contactNubmer":
            //     return (
            //         <Chip className="capitalize" color={statusColorMap[user.gender]} size="sm" variant="flat">
            //             {cellValue}
            //         </Chip>
            //     );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        {/* <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onHandleUpdate(user._id)}>
                                <EditIcon />
                            </span>
                        </Tooltip> */}
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onHandleDelete(user._id)}>
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [doctors, setDoctors] = useState([])
    const [doctorsDup, setDoctorsDup] = useState(doctors)

    const [loading, setLoading] = useState(false)
    const [fetchStatus, setFetchStatus] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("https://hospital-management-backend-one.vercel.app/hospitalManagement/doctor");
                const data = await response.json();
                setDoctors(data.data);
                setDoctorsDup(data.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, [fetchStatus]);

    const [formInput, setFormInput] = useState({
        name: "",
        email: "",
        gender: "",
        contactNumber: "",
        experience: 0,
        specialization: "",
    })

    const onChange = (e) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value })
    }

    const onSubmit = async () => {
        try {
            setLoading(true)
            const res = await axios.post("https://hospital-management-backend-one.vercel.app/hospitalManagement/doctor", formInput);
            if (!res.data.success) {
                <Alert color={'danger'} title={res.data.message} />;
                return;
            }
            <Alert color={'success'} title={res.data.message} />

            setFetchStatus(!fetchStatus)
            setLoading(false)
            onOpenChange(false);
            setFormInput({
                name: "",
                email: "",
                gender: "",
                contactNumber: "",
                experience: 0,
                specialization: "",
            })
        }
        catch (e) {
            <Alert color={'danger'} title={e} />
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const onHandleDelete = async (id) => {
        try {
            setLoading(true)
            const res = await axios.delete(`https://hospital-management-backend-one.vercel.app/hospitalManagement/doctor/${id}`);
            if (!res.data.success) {
                <Alert color={'danger'} title={res.data.message} />;
                return;
            }
            setFetchStatus(!fetchStatus)
            const filteredDoctors = doctorsDup.filter((doctor) => doctor._id !== id);
            setDoctors(filteredDoctors)
            setDoctorsDup(filteredDoctors);
            <Alert color={'success'} title={res.data.message} />;
            setLoading(false)
        }
        catch (e) {
            <Alert color={'danger'} title={e} />
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    const onHandleUpdate = async (id) => {

    }

    const onHandleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value); // Update search term

        if (value === '') {
            setDoctorsDup(doctors); // Reset list if search term is empty
            return;
        }

        // Filter the doctors based on the search term
        const filteredDoctors = doctorsDup.filter((doctor) =>
            doctor.name.toLowerCase().includes(value.toLowerCase()) ||
            doctor.email.toLowerCase().includes(value.toLowerCase()) || 
            doctor.gender.toLowerCase().includes(value.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(value.toLowerCase()) ||
            doctor.contactNumber.toLowerCase().includes(value.toLowerCase()) ||
            doctor.experience.includes(+value)

        );

        setDoctorsDup(filteredDoctors); // Update the filtered doctors
    };


    return (
        <>
            <div className="flex justify-center flex-row space-x-2 mb-4" >
                <Input
                    isClearable
                    classNames={{
                        label: "text-black/50 dark:text-white/90",
                        input: [
                            "bg-transparent",
                            "text-black/90 dark:text-white/90",
                            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                            "shadow-xl",
                            "bg-default-200/50",
                            "dark:bg-default/60",
                            "backdrop-blur-xl",
                            "backdrop-saturate-200",
                            "hover:bg-default-200/70",
                            "dark:hover:bg-default/70",
                            "group-data-[focus=true]:bg-default-200/50",
                            "dark:group-data-[focus=true]:bg-default/60",
                            "!cursor-text",
                        ],
                    }}
                    label="Search"
                    placeholder="Type to search..."
                    radius="lg"
                    value={searchTerm || ""}
                    onChange={onHandleSearch}
                    startContent={
                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                />
                <Button color="primary" className="px-8 py-7" onPress={onOpen}>+Add Doctor</Button>
                <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Add Doctor Details</ModalHeader>
                                <ModalBody>
                                    <Input
                                        isRequired
                                        isClearable
                                        label="Name"
                                        placeholder="Enter your Name"
                                        name='name'
                                        value={formInput?.name}
                                        variant="bordered"
                                        onChange={onChange}
                                    />
                                    <Input
                                        isRequired
                                        isClearable
                                        label="Email"
                                        placeholder="Enter your Email"
                                        name='email'
                                        value={formInput?.email}
                                        variant="bordered"
                                        onChange={onChange}
                                    />
                                    <Input
                                        isRequired
                                        isClearable
                                        label="Contact Number"
                                        placeholder="Enter your Contact Number"
                                        name='contactNumber'
                                        value={formInput?.contactNumber}
                                        variant="bordered"
                                        onChange={onChange}
                                    />
                                    <Input
                                        isRequired
                                        isClearable
                                        label="Experience"
                                        placeholder="Enter your Experience"
                                        name='experience'
                                        value={formInput?.experience}
                                        variant="bordered"
                                        onChange={onChange}
                                    />
                                    <Select
                                        isRequired
                                        label="Gender"
                                        labelPlacement="outside"
                                        name="gender"
                                        value={formInput?.age}
                                        onChange={onChange}
                                        placeholder="Select Gender"
                                    >
                                        <SelectItem key="Male" value="Male">
                                            Male
                                        </SelectItem>
                                        <SelectItem key="Female" value="Female">
                                            Female
                                        </SelectItem>
                                    </Select>
                                    
                                    <Select
                                        isRequired
                                        label="Specialization"
                                        labelPlacement="outside"
                                        name="specialization"
                                        value={formInput?.specialization}
                                        onChange={onChange}
                                        placeholder="Select Specialization"
                                    >
                                        <SelectItem key="Cardiologist" value="Cardiologist">
                                            Cardiologist
                                        </SelectItem>
                                        <SelectItem key="Neurologist" value="Neurologist">
                                            Neurologist
                                        </SelectItem>
                                        <SelectItem key="Peads" value="Peads">
                                            Peads
                                        </SelectItem>
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                    </Button>
                                    {
                                        !loading ?
                                            <Button color="primary" onPress={onSubmit}>Submit</Button> :
                                            <Spinner />
                                    }
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={doctorsDup}>
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

