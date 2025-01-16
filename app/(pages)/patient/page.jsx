"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@nextui-org/spinner";
import {SearchIcon,DeleteIcon} from "../../../components/patient/allComp"
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

    Select,
    SelectItem
} from "@nextui-org/react";





const columns = [
    { name: "NAME", uid: "name" },
    { name: "AGE", uid: "age" },
    { name: "DISEASE", uid: "disease" },
    { name: "GENDER", uid: "gender" },
    { name: "TYPE", uid: "patientType" },
    { name: "CONTACT", uid: "contactNumber" },
    { name: "ACTIONS", uid: "actions" },
];




const statusColorMap = {
    male: "success",
    female: "danger",
};

export default function App() {
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "age":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-default-400">{user.age}</p>
                    </div>
                );
            case "disease":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.disease]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "gender":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.gender]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "patientType":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.patientType]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "contactNubmer":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.gender]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        {/* <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onHandleUpdate(user._id)}>
                                <EditIcon />
                            </span>
                        </Tooltip> */}
                        <Tooltip color="danger" content="Delete user">
                            <button className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onHandleDelete(user._id)}>
                                <DeleteIcon />
                            </button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [patients, setPatients] = useState([])
    const [patientsDup, setPatientsDup] = useState(patients)

    const [loading, setLoading] = useState(false)
    const [fetchStatus, setFetchStatus] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')


    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch("http://13.235.74.44/hospitalManagement/patient");
                const data = await response.json();
                setPatients(data.data);
                setPatientsDup(data.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, [fetchStatus]);


    const [formInput, setFormInput] = useState({
        name: "",
        email: "",
        age: 0,
        disease: "",
        gender: "",
        patientType: "",
        contactNumber: "",
    })

    const onChange = (e) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value })
    }

    const onSubmit = async () => {
        try {
            setLoading(true)
            const res = await axios.post("http://13.235.74.44/hospitalManagement/patient", formInput);
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
                age: 0,
                disease: "",
                gender: "",
                patientType: "",
                contactNumber: "",
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
            const res = await axios.delete(`http://13.235.74.44/hospitalManagement/patient/${id}`);
            if (!res.data.success) {
                <Alert color={'danger'} title={res.data.message} />;
                return;
            }
            setFetchStatus(!fetchStatus)
            const filteredPatients = patientsDup.filter((patient) => patient._id !== id);
            setPatients(filteredPatients);
            setPatientsDup(filteredPatients);
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
            setPatientsDup(patients); // Reset list if search term is empty
            return;
        }

        // Filter the patients based on the search term
        const filteredPatients = patientsDup.filter((patient) =>
            patient.name.toLowerCase().includes(value.toLowerCase()) ||
            patient.email.toLowerCase().includes(value.toLowerCase()) || 
            patient.disease.toLowerCase().includes(value.toLowerCase()) ||
            patient.gender.toLowerCase().includes(value.toLowerCase()) ||
            patient.patientType.toLowerCase().includes(value.toLowerCase()) ||
            patient.contactNumber.toLowerCase().includes(value.toLowerCase()) ||
            patient.age.includes(+value)

        );

        setPatientsDup(filteredPatients); // Update the filtered patients
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
                <Button color="primary" className="px-8 py-7" onPress={onOpen}>+Add Patient</Button>
                <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Add Patient Details</ModalHeader>
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
                                        label="Age"
                                        placeholder="Enter your Age"
                                        name='age'
                                        value={formInput?.age}
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
                                        label="Patient Type"
                                        labelPlacement="outside"
                                        name="patientType"
                                        value={formInput?.patientType}
                                        onChange={onChange}
                                        placeholder="Select Patient Type"
                                    >
                                        <SelectItem key="ICU" value="ICU">
                                            ICU
                                        </SelectItem>
                                        <SelectItem key="Emergency" value="Emergency">
                                            Emergency
                                        </SelectItem>
                                        <SelectItem key="Peads" value="Peads">
                                            Peads
                                        </SelectItem>
                                        <SelectItem key="General Ward" value="General Ward">
                                            General Ward
                                        </SelectItem>
                                        <SelectItem key="Maternity" value="Maternity">
                                            Maternity
                                        </SelectItem>
                                    </Select>
                                    <Select
                                        isRequired
                                        label="Disease"
                                        labelPlacement="outside"
                                        name="disease"
                                        value={formInput?.disease}
                                        onChange={onChange}
                                        placeholder="Select Disease"
                                    >
                                        <SelectItem key="Flu" value="Flu">
                                            Flu
                                        </SelectItem>
                                        <SelectItem key="Diabetes" value="Diabetes">
                                            Diabetes
                                        </SelectItem>
                                        <SelectItem key="Blood Pressure" value="Blood Pressure">
                                            Blood Pressure
                                        </SelectItem>
                                        <SelectItem key="Asthma" value="Asthma">
                                            Asthma
                                        </SelectItem>
                                        <SelectItem key="Pneumonia" value="Pneumonia">
                                            Pneumonia
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
                <TableBody items={patientsDup}>
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

